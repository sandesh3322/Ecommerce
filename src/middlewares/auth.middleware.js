require("dotenv").config();
const jwt = require('jsonwebtoken');
const userSvc = require("../modules/user/user.service");
const logincheck = async (req,res,next) =>{

  try{
    let token = req.headers['authorization'] || null
    if(!token){
      throw {status:401, message: "unauthorized access"}
    }else{
      // bearer token
      token = token.split(" ").pop()

      const data = jwt.verify(token, process.env.JWT_SECRET);
      // console.log(data);
      if(data.hasOwnProperty("type")){
        throw {status: 403 , message: "Access token required"}
      }
      const user = await userSvc.getSingleUserByFilter({
        _id : data.sub
      })
     req.authuser ={
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      status: user.status,
      address: user.address,
      phone: user.phone ,
      image: user.image 
     }
     next()
    }
  } catch (exception){
    console.log(exception)
    next({status:401,message:exception.message})

  }
    
  
}

module.exports = logincheck;