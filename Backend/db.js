const mongoose = require("mongoose");
const dotenv =require('dotenv')

dotenv.config({path:"backend/config/config.env"})




const connectToMongo = ()=>{
    mongoose.connect(process.env.mongoURI , ()=>{
        console.log("connected to mongodb");
    })
}

module.exports=connectToMongo;

