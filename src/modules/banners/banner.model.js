const mongoose = require("mongoose");
const { StatusType } = require("../../config/constant.config");

const BannerSchema = new mongoose.Schema({

    
    title: { 
        type:String,
        required: true,
        min: 3,
        max: 100
    } ,
    image:{
        type: String,
        required: true,

    },
    link :{
      type: String,
      default: null


    },
    startDate: Date,
    endDate: Date,

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

const BannerModel = mongoose.model("Banner", BannerSchema);

module.exports = BannerModel;
