const { string } = require('joi');
const mongoose = require('mongoose')
const {UserRoles, StatusType} = require("../../config/constant.config")
const AddressSchema= new mongoose.Schema({
    proviname:{
        type:String,
        enum:["Koshi", "Madesh","Bagmati","Gandaki","Lumbini","Karnali","Sudur-Paschim"]
    },
    district : String,
    municipality : String,
    wardNo : Number,
    houseAddress: String
       
    
})
const  UserSchema = new mongoose.Schema({
    name : {
        type: String,
        min : 2,
        max: 50 ,
        required: true
    },
    email: {
        type: String,
        required : true,
        unique: true
    },
    
    password:{
        type: String,
        required: true
    },
    role:{
        type:String,
        enum: {...Object.values(UserRoles)},
        default: UserRoles.CUSTOMER
    },
    status:{
        type:String,
        enum: [...Object.values(StatusType)],
        default: StatusType.INACTIVE
    },
    activationToken: String , 
    activateFor:Date,
    phone : String,
    address : {
        permanent: AddressSchema,
       
        temporary: AddressSchema
    },
    forgetToken: String,
    forgetFor: Date,
    image : String,
    createdBy:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        default: null
    }
                    

},{
    timestamps: true , // createdAt , updated at 
    autoIndex: true,
    autoCreate: true
});
const UserModel = mongoose.model("User",UserSchema)
//authusers 
module.exports = UserModel;