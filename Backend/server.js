// connection to dataBase
const connectToMongo = require('./db');
const app=require("./app");
const dotenv = require('dotenv');

// handeling unCaught Exception
process.on("uncaughtException", (err) => {
    console.log(`Error:${err.message}`);
    console.log(`suttning down the server due to unCaught Exception `)
    process.exit(1);
})

// config
dotenv.config({ path: "backend/config/config.env" });


// server
connectToMongo();

app.listen(process.env.PORT , ()=>{
    console.log(`server is listen on https://localhost:${process.env.PORT}`)
})

// Unhandalled errors

process.on("unhandledRejection", (err) => {
    console.log(`Error:${err.message}`);
    console.log(`shuttning down the server due to Unhandaled promise rejection `)
    server.close(() => {
        process.exit(1);
    })
})


