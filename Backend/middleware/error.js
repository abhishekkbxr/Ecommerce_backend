const ErrorHander = require("../utils/errorHander");



module.exports =(err ,req ,res , next )=>{

    err.statusCode =err.statusCode || 500;
    err.message = err.message || "Inernal server Error ";

    // wrong mongoDb ID error
    if(err.name === "CastError"){
        const message =`Resource not found . invalid :${err.path}` ;
        err = new ErrorHander(message , 400)
    };
    // mongoose duplicate error
    if(err.code === 1000){
        const message = `Duplicate ${Object.keys(err.keyValue) } Entered `;
        err = new ErrorHander(message , 400)

    };
     // json webToken  error
     if(err.name === "jsonWebTokenError"){
        const message =`json web token is Invalid , try again ` ;
        err = new ErrorHander(message , 400)
    };
     // jwt expire error
     if(err.name === "tokenExpiredError"){
        const message =`json web token Expire, try again ` ;
        err = new ErrorHander(message , 400)
    };

    res.status(err.statusCode).json({
        success :false,
        message :err.message
    })

}