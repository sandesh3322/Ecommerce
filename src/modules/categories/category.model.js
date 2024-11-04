const mongoose = require("mongoose");
const { StatusType } = require("../../config/constant.config");

const CategorySchema = new mongoose.Schema({

    
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
    parentId:{
        type : mongoose.Types.ObjectId,
        ref : "Category",
        default : null
    },
    brands:[{
     type: mongoose.Schema.Types.ObjectId,
      ref: 'Brand',
       default: null
     }],

     
    createdBy:{
     type : mongoose.Types.ObjectId,
     ref : "User",
     default : null
    },   
    
      

},{
    timestamps: true,
    autoIndex : true,
    autoCreate: true,
})

const CategoryModel = mongoose.model("Category", CategorySchema);

module.exports = CategoryModel;
