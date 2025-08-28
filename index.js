const express =require("express");
const app = express();
const cors=require('cors');


const connectToMongo = require('./config/config');
connectToMongo(); // This is used to connect to mongoDB database


app.use(express.json()); // It is userd to parse JSON bodies
//app.use(cors);



require('dotenv').config(); // This is used to load env variables from .env file

const port = process.env.PORT || 8000;          //This is used to use env port number

// For Admin Routes
app.use('/api/users',require('./routes/admin/userRoutes'));


app.get('/hello',(req,res)=>{
    res.send("Hello World");
});
app.listen(port,()=>{
    console.log("Server started on port : " + port);
});

