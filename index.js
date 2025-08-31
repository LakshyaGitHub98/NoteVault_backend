const express =require("express");
const app = express();
const cors=require('cors');
const userAuthRouter=require('./routes/authectication/userAuth');
const adminUserRouter=require('./routes/admin/userRoutes');
const fileRoutes=require("./routes/files/fileRoutes")

const connectToMongo = require('./config/config');
const user = require("./models/user");
connectToMongo(); // This is used to connect to mongoDB database


app.use(cors());
app.use(express.json()); // It is userd to parse JSON bodies
app.use(express.urlencoded({extended:true}))
//app.use(cors);



require('dotenv').config(); // This is used to load env variables from .env file

const port = process.env.PORT || 8000;          //This is used to use env port number

// For Admin Routes
app.use('/api/users',adminUserRouter);


// For User Registration Routes
app.use('/api/auth',userAuthRouter);


app.use('/api/file',fileRoutes);

app.get('/hello',(req,res)=>{
    res.send("Hello World");
});

app.listen(port, '0.0.0.0',()=>{
    console.log("Server started on port : " + port);
});