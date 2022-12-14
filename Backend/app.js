const express = require('express');
const app = express();
const cookieParser = require('cookie-parser')

const errorMiddleware = require('./middleware/error')

app.use(express.json());
app.use(cookieParser());
// Routes import 
app.use('/api/v1' , require('./routes/productRoutes'));
app.use('/api/v1' , require('./routes/userRoutes'));
app.use('/api/v1' , require('./routes/orderRoutes'));

// middleware Error 

app.use(errorMiddleware)


module.exports=app;