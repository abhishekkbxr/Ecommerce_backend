const User = require("../models/userModels");
const ErrorHander = require("../utils/errorhander");
const jwt = require('jsonwebtoken');
const catchAsyncError = require("./catchAsyncError");



exports.isAuthenticatedUser =catchAsyncError(async (req , res , next )=>{
    const {token} = req.cookies ;

    if(!token){
        next(new ErrorHander(" Login to Access the resource " , 401))
    }

    const decodedData = jwt.verify(token, process.env.JWT_SECRET)

    req.user =await User.findById(decodedData.id);
    next();
});

exports.authorizeRoles = (...roles) => {

    return (req, res, next) => {

        if (!roles.includes(req.user.role)) {
            return next (
                new ErrorHander(`Role :${req.user.role} is not allowed to access this resourece `, 403));
        }

        next();
    }
};