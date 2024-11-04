const express=require('express')
const cors=require('cors');

// import db connection 
require("./db.config");
const router = require('./router.config');
const { MulterError } = require('multer');

// const UserRouter = require("../modules/user/user.router");
// const authRouter = require('../modules/auth/auth.router');
// const authRouter = require("../modules/auth/auth.router")
// const UserRouter = require(__dirname+ "../modules/user/user.router")  C:\Users\HP\Desktop\api-29\src\config\express.config.js
const app=express();
app.use(cors())

//parsers
app.use(express.json()) // json contetnt type
app.use(express.urlencoded({
  extended: true
})) // json contetnt type

// app.use('/user',UserRouter)
// app.use('/auth',authRouter)
app.use(router);




//404 route
app.use((req,res,next)=>{
  next({status:404,message:"resource not found."})
})





// next vitra obejct halda yeha aaunxa 
//error handling middle ware
app.use((error,req,res,next)=>{

    console.log("error", error);
    let statusCode = error.status || 500 ; 
    let message = error.message || "server error..."
    let detail = error.detail || null;
    


    // mongo db unique error handling 
    if(error.code == 11000){
      const uniqueFailedKeys = Object.keys(error.keyPattern)
      detail = {};
      message = "validation failed";

      uniqueFailedKeys.map((field)=>{
          detail[field] = field+'should be unique'
      })
      statusCode = 400
  }

    //  handle multer error
    if(error instanceof MulterError){
      if(error.code === "LIMIT_FILE_SIZE"){
        statusCode = 400
        detail = {
          [error.field]:"file size too large"
        }
      }
    }
    res.status(statusCode).json({
       result: detail,
       message: message,
       meta:null
    })

})

module.exports = app ;

// request url route , API Endpoint ,
// app.get("url,optional",(req,res)=>{})
//app.post("url,optional",(req,res)=>{})
//app.put("url,optional",(req,res)=>{})
//app.patch("url,optional",(req,res)=>{})
//app.delete("url,optional",(req,res)=>{})
// HTTPrequest ,Request
// HTTPresponse , response


// app.get()
// app.get("/product/:id",(req,res)=>{
//   const params = req.params // req.params returns object as {id : value}
//   const query = req.query // {key:value}
//   res.json({
//     result : {
//       params : params,
//       query: query
//     },
//     messege: "example",
//     meta : null
//   })

// })


// app.get("/",(req,res)=>{
 
//   const data1 = req.body ;
//   const data = [];
//    res.json({
//     result: data,
//     messege: "helloworld ",
//     meta: null
//    })
 
// })

// app.get("/about-us",(req,res)=>{
 
//    res.json({
//     result: "",
//     messege: "about us fetched ",
//     meta: null
//    })
 
// })



 // console.log(req)
  // res.end("Home page")
  //  res.send("home ")
 // res.render("file")
  // console.log(__dirname)
  // res.sendFile(__dirname + "/../views/index.html")
  // req.status(200).json({})
  // req.sendStatus


// app.use((req,res)=>{
//   // req ==> incoming data
//     res.end("hello world")

// })




