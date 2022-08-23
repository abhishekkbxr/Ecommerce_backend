const catchAsyncError = require('../middleware/catchAsyncError');
const ErrorHander = require("../utils/errorHander");
const User = require("../models/userModels");
const sendToken = require('../utils/jwtToken');
const sendEmail = require('../utils/sendEmail');
const crypto = require('crypto');


// USER AUTHENTICATION :--

// register a user 

exports.registerUser = catchAsyncError(async (req, res, next) => {

    const { email, password, name } = req.body;

    let user = await User.create({
        name, email, password,
        avatar: {
            public_id: "this is simple id ",
            url: "profilePicUrl"
        }
    });

    sendToken(user, 201, res);
});


// Login user 

exports.loginUser = catchAsyncError(async (req, res, next) => {
    const { email, password } = req.body;

    //   chacking user is provided both email & password or Not 

    if (!email || !password) {
        return next(new ErrorHander("Entre a valid Email & Password", 400))
    };


    const user = await User.findOne({ email }).select("+password");

    if (!user) {
        return next(new ErrorHander("invalid Email or Password ", 401))
    }

    const isPasswordMatched = await user.comparePassword(password);

    if (!isPasswordMatched) {
        return next(new ErrorHander("invalid Email or Password ", 401))
    }

    sendToken(user, 200, res)
});

// Logout 

exports.logout = catchAsyncError(
    async (req, res, next) => {
        res.cookie("token", null, {
            expires: new Date(Date.now()),
            httpOnly: true
        })
        res.status(200).json({
            success: true,
            message: "logged out"

        })
    }
);

// Forget password

exports.forgotPassword = catchAsyncError(
    async (req, res, next) => {
        const user = await User.findOne({ email: req.body.email });

        if (!user) {
            return next(new ErrorHander("User not Found ", 404))
        }

        //   Get resetPassword Token

        const resetToken = user.getResetPasswordToken();

        await user.save({ validateBeforeSave: false });

        const resetPasswordUrl = `${req.protocol}://${req.get("host")}/api/v1/password/reset/${resetToken}`;

        const message = `Your password reset token is :- \n\n ${resetPasswordUrl} \n\n if you have not requested this email then please ignor it`;

        try {
            await sendEmail({
                email: user.email,
                subject: `Ecommerce password Recovery `,
                message,

            });

            res.status(200).json({
                success: true,
                message: `Email send to ${user.email} successfully `
            })
        } catch (error) {
            user.resetPasswordToken = undefined;
            user.resetPasswordExpire = undefined;

            await user.save({ validateBeforeSave: false });

            return next(new ErrorHander(error.message, 500))
        }
    }
);

exports.resetPassword = catchAsyncError(async (req, res, next) => {
    // creating token hash
    const resetPasswordToken = crypto
        .createHash("sha256")
        .update(req.params.token)
        .digest("hex");

    const user = await User.findOne({
        resetPasswordToken,
        resetPasswordExpire: { $gt: Date.now() },
    });

    if (!user) {
        return next(
            new ErrorHander(
                "Reset Password Token is invalid or has been expired",
                400
            )
        );
    }

    if (req.body.password !== req.body.confirmPassword) {
        return next(new ErrorHander("Password does not password", 400));
    }

    user.password = req.body.password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save();

    sendToken(user, 200, res);
});

// USER ROUTES :--

// get user details 

exports.getUserDetails = catchAsyncError( async (req , res , next )=>{

    const user = await User.findById(req.user.id);

    if(!user){
        return next(new ErrorHander(" user not found " , 404 ))
    }

    res.status(200).json({
        success: true,
        user
    })
}); 

// update User password
exports.updatePassword = catchAsyncError(async (req, res, next) => {
    const user = await User.findById(req.user.id).select("+password");
  
    const isPasswordMatched = await user.comparePassword(req.body.oldPassword);
  
    if (!isPasswordMatched) {
      return next(new ErrorHander("Old password is incorrect", 400));
    }
  
    if (req.body.newPassword !== req.body.confirmPassword) {
      return next(new ErrorHander("password does not match", 400));
    }
  
    user.password = req.body.newPassword;
  
    await user.save();
  
    sendToken(user, 200, res);
  });


//   update user profile 

// update User Profile
exports.updateProfile = catchAsyncError(async (req, res, next) => {
    const newUserData = {
      name: req.body.name,
      email: req.body.email,
    };
  
    // we will add cloudnairy later

    const user = await User.findByIdAndUpdate(req.user.id, newUserData, {
        new: true,
        runValidators: true,
        useFindAndModify: false,
      });
    
      res.status(200).json({
        success: true,
      })
});


// Get all user --- by admin 

exports.getAllUser =catchAsyncError( async (res , req , next )=>{

    const users = await User.find();
    console.log(users)

    res.status(200).json({
        success:true,
        users
    })
});

// get single user ---by Admin 

exports.getSingleUser =catchAsyncError(async (req ,res , next )=>{
    const user = await User.findById(req.params.id);

    if(!user){
        return next(new ErrorHander(` User does not exist with id:${req.params.id}`));
    }

    res.status(200).json({
        success:true,
        user
    })
});

// update user role ---( Admin )

exports.updateUserRole=catchAsyncError(
    async(req , res , next )=>{

        const newUserData = {
            name:req.body.name ,
            email:req.body.email,
            role:req.body.role,
        }

        const user = await User.findByIdAndUpdate(req.params.id ,newUserData ,{
            new:true,
            runValidator:true,
            useFindAndModify:false,
        });

        res.status(200).json({
            success:true
        })

    }
);


// delete user profile ----( Admin )

exports.deleteUser=catchAsyncError(
    async(req , res , next )=>{

        const user = await User.findById(req.params.id);

        // we will remove cloudinary latter

        if(!user){
         return next(new ErrorHander(`user dose note exist with id:${req.params.id} ` ,  400 ))
        }

        await user.remove();
        res.status(200).json({
            success:true,
            message:"user deleted successfully"
        })

    }
);
