require("dotenv").config();
const { uploadImage } = require("../../config/cloudinary.config");
const { deleteFile } = require("../../utilities/helpers");
const UserModel = require("./user.model");
const userSvc = require("./user.service");


class userController{
  userDetail;
  #validateId = async(id) => {
    try{
     
     if(!id){
         throw { status: 400 , message: " id is required"}
     }
     this.userDetail = await userSvc.getSingleUserByFilter({
         _id:id
     })
     if(!this.userDetail){
         throw{status : 404 , message :" user does not exist "}
     }
    }catch(exception){
     throw exception
    }
     
 }
   userCreate= async (req,res,next) =>{
   try{
    const data = userSvc.transformUserCreate(req);
    await userSvc.registerUser(data);

    await  userSvc.sendActivationEmail({name:data.name,email:data.email,token:data.activationToken})

  
   
    // UserModel.insertMany([data])



     res.json({
      result: data,
      message: "user created",
      meta: null
    })
   }
   catch(exception){
    // console.log("i am here");
    next(exception);

   }
 }

  userLists = async(req,res,next) =>{

    try{
      const page = +req.query.page || 1
      const limit = +req.query.limit || 10
      const skip = (page-1) * limit ;
      let filter={};
  
      if(req.query.search){
        filter = {
          title : new RegExp(req.query.search,'i')
        }
      }
      const {count ,data } = await userSvc.listData({
        skip:skip,
        filter:filter,
        limit:limit
      })
      
      res.json({
       result:null,
       message:`read all user `,
       meta:null
     })
    }catch(exception){
      next(exception);
    }

  }
  
  //logged in user
  //admin role
  // read users



   userListbyid=async (req,res) =>{ // shooowwww
    try{
      const id = req.params.id;
      await this.#validateId(id);
      res.json({
        result:null,
        message:`user detail of ${req.params.id} `,
        meta:null
      })
    }catch(exception){
      next(exception)
    }
    //logged in user
    //admin role
    // read users


}

    userUpdatebyid = async (req,res) =>{

      try{
        const id =req.params.id
        await this.#validateId(id)
        const data = req.body ;
        if(req.file){
          data.image = await uploadImage('./public/uploads/user/'+ req.file.filename);
          deleteFile('./public/uploads/user/'+ req.file.filename)
        }
        const response = await userSvc.updateUser(data,id)

        res.json({
          result:null,
          message:`user update of ${req.params.id} `,
          meta:null
        })
      }
      
      catch(exception){
        next(exception)
      }
   }

    userDeletebyid = async(req,res,next) =>{
      try{
        const id= req.params.id
        await this.#validateId(id)
        const response = await userSvc.userDeletebyid(id)

        res.json({
          result:null,
          message:`user delete of ${req.params.id} `,
          meta:null
        })

      }catch(exception ){
        next(exception);
      }

        }




}



const userCtrl = new userController()
module.exports = userCtrl;