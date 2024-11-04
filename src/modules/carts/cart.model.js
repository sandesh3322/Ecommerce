const mongoose = require("mongoose");
const { StatusType, CartStatus } = require("../../config/constant.config");
const { object } = require("joi");

const CartSchema = new mongoose.Schema({

    
    orderid: { 
        type:mongoose.Schema.Types.ObjectId,
        ref: 'Order',
        required: false,
    } ,
    customerid: { 
        type:mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    } ,
    products:[{
        productid: { 
            type:mongoose.Schema.Types.ObjectId,
            ref: 'Product',
            required: true,
        } ,
        
        quantity:{
            type:Number,
            required:true,
            min:1
        },
        price:{
            type:Number,
            required:false,

    
        },
        amount:{
            type:Number,
            required:true,
    
        },
    }],
    status:{ 
        type: String ,
        enum:Object.values(CartStatus),
        default: CartStatus.PENDING
        
    }, 
        
      

},{
    timestamps: true,
    autoIndex : true,
    autoCreate: true,
})

const CartModel = mongoose.model("Cart", CartSchema);

module.exports = CartModel;
