const mongoose = require("mongoose");
const { StatusType } = require("../../config/constant.config");

const PaymentSchema = new mongoose.Schema({

    
    orderid: { type: mongoose.Schema.Types.ObjectId, ref: 'Order', required: true },
  
    customerid: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  
    total_amount: { type: Number, required: true },
  
    transaction_uuid: { type: String, required: true },

    ref_id:{type:String , required:true },
  
    payment_method: { type: String, required: true },
  
    status: { type: String, enum: ['success', 'failed'], required: true },
  
    payment_verified_at: { type: Date },
  
    payment_data: { type: Object } // Store raw payment response data
}, 
    { timestamps: true });
        
      



const PaymentModel = mongoose.model("Payment", PaymentSchema);

module.exports = PaymentModel;
