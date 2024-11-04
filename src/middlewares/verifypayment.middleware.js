const OrderModel = require('../modules/order/order.model')
const CartModel = require('../modules/carts/cart.model');
const {  } = require('../modules/order/order.controller');

const verifypayment = async (req,res,next) => {
    try{
        const orderid = req.params.id
        let orderdetail = await OrderModel.findById(orderid);
        const {data} = req.query;
        if (!data) {
            return res.status(400).json({ message: "No data provided" });
        }
        const  decoded = JSON.parse(
            Buffer.from(data,"base64").toString("utf-8")
        )
        if(decoded.status !== "COMPLETE"){
            throw{status:400 ,message:"payment is incomplete"}
        }
        if (orderdetail.signature !== decoded.signature) {
          throw{status:403 , message:"payment verification failed"}
        }
        orderdetail.status = 'paid'; // Or whatever your success status is
        await orderdetail.save();
        next();

    }catch(exception){
        next(exception)
    }
};
module.exports = verifypayement
