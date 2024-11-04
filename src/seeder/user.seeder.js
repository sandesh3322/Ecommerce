const bcrypt = require('bcryptjs')
require("../config/db.config");
const {UserRoles,StatusType} = require('../config/constant.config')
const UserModel = require('../modules/user/user.model')
const adminUsers = [
    {
        name : "sandesh admin",
        email: "sandezpoudel@gmail.com",
        password : bcrypt.hashSync("admin123",10),
        role: UserRoles.ADMIN,
        status: StatusType.ACTIVE,
        image:"https://res.cloudinary.com/ditls9nzv/image/upload/v1719373351/Na1JxlGKtdvRNnKFDEnwW4BMJy5JkAShmwcBr5ac_xdjqar.jpg"
    },
    {
        name : "poudel admin",
        email: "kalabaral60+admin@gmail.com",
        password : bcrypt.hashSync("admin123",10),
        role: UserRoles.ADMIN,
        status: StatusType.ACTIVE,

    }
    

]

const seedUser = () => {
    try{
        adminUsers.map(async (user)=>{
            const userData = await UserModel.findOne({
                email : user.email
            })
            console.log('wow')
            console.log(userData)
            if(!userData){
                const userObj = new UserModel(user);
                console.log(userObj.email)
                await userObj.save()
            }
            else{
                console.log("user exists");
            }
        })
        // console.log('seedded');
      
    //    process.exit(1)
    }catch(exception){
        console.log(exception)
    }
}

seedUser();