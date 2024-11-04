const mongoose = require("mongoose");
const { StatusType } = require("../../config/constant.config");

const BrandSchema = new mongoose.Schema({

    
    title: { 
        type:String,
        required: true,
        min: 3,
        max: 100,
        unique: true
    } ,
    image:{
        type: String,
        required: true,

    },
    slug :{
      type: String,
      required: true,
      unique: true


    },
   

    status:{ 
        type: String ,
        enum: [StatusType.ACTIVE, StatusType.INACTIVE],
        default: StatusType.INACTIVE
        
    },
    createdBy:{
     type : mongoose.Schema.Types.ObjectId,
     ref : "User",
     default : null
    },   
        
      

},{
    timestamps: true,
    autoIndex : true,
    autoCreate: true,
})

const BrandModel = mongoose.model("Brand", BrandSchema);

module.exports = BrandModel;
