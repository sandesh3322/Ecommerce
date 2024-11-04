require("dotenv").config();
const bcrypt = require("bcryptjs");
const mailSvc = require("../../services/mail.service");
const UserModel = require("./user.model");

const {
  randomStringGenerator,
  deleteFile,
} = require("../../utilities/helpers");
const { message } = require("../auth/auth.request");
const { deleteCloudFile } = require("../../config/cloudinary.config");


class UserService {
  generateUserActivationToken = (data) => {
    data.activationToken = randomStringGenerator(100);
    data.activateFor = new Date(
      Date.now() + process.env.TOKEN_ACTIVE_TIME * 60 * 60 * 1000
    );
    return data;
  };

  transformUserCreate = (req) => {
    let data = req.body;
    if (req.file) {
      data.image = req.file.filename;
    }
    data.password = bcrypt.hashSync(data.password, 10);
    data = this.generateUserActivationToken(data);
    data.status = "inactive";
    return data;
  };

  sendActivationEmail = async ({
    name,
    email,
    token,
    sub = "Activate your account !!",
  }) => {
    try {
      await mailSvc.sendEmail({
        to: email,
        sub: sub,
        message: `
                Dear ${name}, <br/>
                <p> Your account has been registered sucessfully .</p>
                <p> Please click on the link below  or copy paste the url in the browser to activate your account :</p>
                <a href = "${process.env.FRONTEND_URL + "auth/activate/" + token}">${
          process.env.FRONTEND_URL + "auth/activate/" + token
        }</a>
                <br>

                <p>-------------------------------------------</p>
                <p> Regards,</p>
                <p> system Admin </p>
                <p> ${process.env.SMTP_FROM}</p>
          
                <p>
                <small><em>Please do not reply to this email.</em></small>
                </p>
                <p> 
                `,
      });
    } catch (exception) {
      throw exception;
    }
  };
  registerUser = async (data) => {
    try {
      const user = new UserModel(data);
      return await user.save();
    } catch (exception) {
    

      throw exception;
    }
  };
  listData = async ({skip=0 , limit=10,filter = {}}) =>{
    try{
        const count = await UserModel.countDocuments(filter);
        const data = await  UserModel.find(filter)
                            .populate("createdBy",["_id","name","email","role"])
                            .sort({_id: "desc"}) // latest on top 
                            .limit(limit)
                            .skip(skip)
        return { count , data}
    }
    catch(exception){
        throw exception
    }
  }
  getSingleUserByFilter = async (filter) => {
    try {
      const userDetail = await UserModel.findOne(filter);
      if (userDetail) {
        return userDetail;
      } else {
        throw { status: 404, message: "user does not exists" };
      }
    } catch (exception) {
      throw exception;
    }
  };
  updateUser= async(data ,id) => {
    try{
      const response = await UserModel.findByIdAndUpdate(id,{$set:data}, {new:false})
      if(data.image){
        deleteCloudFile(response.image)
        .then((result) =>{
          console.log('image deleted sucessfully :', result);
        })
        .catch((error)=>{
          console.log('errro deleting image: ', error);
        });

      }
      return response;
    }catch(exception){
      throw exception ; 
    }

  }
  userDeletebyid= async (id)=>{
    try{
      const response = await UserModel.findByIdAndDelete(id);
      deleteCloudFile(response.image)
      .then((result)=>{
        console.log('image delete sucessfully:',result);

      })
      .catch((error)=>{
        console.error('error deleting image ',error);
      });
      if(!response){
        throw{status:404 , message:"user not found"}
      }
      return response;

    }catch(exception){
      throw exception

    }
  }
}
const userSvc = new UserService();
module.exports = userSvc;
