const { uploadImage} = require("../../config/cloudinary.config");
require('dotenv').config();
const crypto = require('crypto');
const { StatusType } = require("../../config/constant.config");
const { deleteFile } = require("../../utilities/helpers");
const orderService = require("./order.service");
const { v4: uuidv4 } = require('uuid'); 
const axios = require('axios');
const OrderModel = require("./order.model")
const CartModel = require("../carts/cart.model")
const ProductModel = require('../product/product.model');
class OrderController {
    orderDetail;
    

    create = async (req,res,next) => {
        try{
            let data = req.body;
            data.customerid = req.authuser._id;
            let cart = await CartModel.findById(data.cartid).populate('products.productid');
            if (!cart) {
              return res.status(404).json({ result: false, message: 'Cart not found' });
            }
            const amount = cart.products.reduce((total, product) => {
                return total + product.amount; // Assuming 'amount' is pre-calculated in the cart
            }, 0);
            const product_delivery_charge = data.product_delivery_charge || 0; // Get delivery charges if available
            const product_service_charge = data.product_service_charge || 0;
             // Get service charges if available
            const total_amount = amount +( data.tax_amount||0 )+ product_delivery_charge + product_service_charge;
            // Call the function to generate a unique order ID
            const transaction_uuid = uuidv4();
            const product_code = process.env.ESEWA_PRODUCT_CODE;
            const secret_key = process.env.ESewa_SECRET_KEY;
            const signatureString = `total_amount=${total_amount},transaction_uuid=${transaction_uuid},product_code=${product_code}`;
            const hash = crypto.createHmac('sha256', secret_key)
                                 .update(signatureString)
                                 .digest('base64');
            const order = new OrderModel({
              
                cartid: data.cartid,
                address: data.address,
                phone: data.phone,
                amount,
                tax_amount: data.tax_amount,
                total_amount,
                transaction_uuid, // Ensure this is provided in the request
                product_delivery_charge,
                product_service_charge,
                status: 'unpaid',
                signature:hash,
                signed_field_names: "total_amount,transaction_uuid" // Assuming payment is completed at this point
            });
            await order.save();
            cart.orderid = order._id; // Assuming you want to store the order's _id in the cart
             // Update cart status if necessary
            await cart.save();
            const esewaData = {
                amount: total_amount.toString(), // Make sure the amount is in string format
                failure_url: process.env.ESewa_FAILURE_URL+`/order/:${order._id}`, // Use dynamic failure URL
                product_delivery_charge: product_delivery_charge.toString(),
                product_service_charge: product_service_charge.toString(),
                product_code: process.env.ESEWA_PRODUCT_CODE, // Use your actual product code
                signature: hash, // Your signature for security
                signed_field_names: "total_amount,transaction_uuid,product_code",
                success_url: process.env.ESewa_SUCCESS_URL+`/order/:${order._id}`, // Use dynamic success URL
                tax_amount: data.tax_amount.toString(),
                total_amount: total_amount.toString(),
                transaction_uuid: transaction_uuid
            };
            const response = await axios.post('https://rc-epay.esewa.com.np/api/epay/main/v2/form', esewaData, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });
           
            res.json({
                result: response.data, // Response from eSewa
                 // Include the created order in the response
                message: 'Order created and payment initiated successfully',
                meta: null
            });
        }catch(exception){
            console.log(exception)
            next(exception)
        }

    }


    index = async (req,res,next) =>{
        try{
            //load all data
            // pagination 
            // 100 data
            // 10 data perpage
            //total page = 10 => Math.ceil(totalPPAGES/LIMIT)
            // 1 - 100
                const page = +req.query.page || 1
                const limit = +req.query.limit || 10;
                const skip = (page-1) * limit ;
                let filter = {};
                if (req.query.transaction_uuid) {
                    filter.transaction_uuid = new RegExp(req.query.transaction_uuid, 'i'); // Case-insensitive search on transaction_uuid
                }
                if (req.query.status) {
                    filter.status = req.query.status; // Search by status
                }
                const {count ,data} = await orderService.listData({
                    skip: skip , 
                    filter: filter,
                    limit: limit

                });
                res.json({
                    result: data,
                    message: "order list all ",
                    meta: {
                        currentPage: page,
                        total : count ,
                        limit : limit 
                    }
                })



        }catch(exception){
            next(exception);
        }

    }
    #validateId = async(id) => {
       try{
        
        if(!id){
            throw { status: 400 , message: " id is required"}
        }
        this.orderDetail = await orderService.getDetailByFilter({
            _id:id
        })
        if(!this.orderDetail){
            throw{status : 404 , message :" order does not exist "}
        }
       }catch(exception){
        throw exception
       }
        
    }

    show = async (req, res ,next) =>{
        try{
            const id = req.params.id;
           await  this.#validateId(id);
           if(this.orderDetail.status =="paid"){

               res.json({
                   result :this.orderDetail,
                   message : " paid Orders fetched sucessfully ",
                   meta : null
               })
           }
           else{
            next({status: 400,message:'not available'})
           }

        }catch(exception){
            next(exception)
        }

    }

    update = async(req,res,next) =>{
        try{
            const id = req.params.id
            await  this.#validateId(id)
            const data = req.body;
           
            // transform
            const response = await orderService.updateOrder(data,id)
            res.json({
                result: response, 
                meta: null,
                message : " order updated sucessfully"
            })
        }catch(exception){
            next(exception)
        }
    }

    delete = async(req, res, next) =>{
        try{
            const id = req.params.id
            await this.#validateId(id)
            const response = await orderService.deleteById(id)
            // todo delete image from cloudinary
            res.json({
                result: response ,
                meta: null,
                message : "order deleted"
            })
        }catch(exception){
            next(exception)
        }
    }
    sellerlistForPayment = async(req,res,next) =>{
        try{
           
            const sellerProducts = await Product.find({ sellerId: req.authuser._id }).select('_id');
            const sellerProductids = sellerProducts.map(product => product._id)

            const cartsWithSellerProducts = await CartModel.find({
                'products.productid': { $in: sellerProductids } // Match carts that contain seller's products
            }).select('_id'); // Get the cart IDs only
            const cartids = cartsWithSellerProducts.map(cart => cart._id);
            const page = +req.query.page || 1;
            const limit = +req.query.limit || 10;
            const skip = (page - 1) * limit;
    
            const filter = { $and: [
                              { cartid: { $in: cartIds } }, // Orders containing the seller's products
                              { status: 'paid' } // Orders with 'paid' status
                                 ] }; // Filter orders that belong to the found carts
            const { count, data } = await orderService.listData({
                skip: skip,
                limit: limit,
                filter: filter // Pass the filter to the service function
            });; // Sort by the latest orders
    
            // Step 4: Return paginated result
            res.json({
                result: data,
                message: "Seller's orders fetched successfully",
                meta: {
                    currentPage: page,
                    total: count,
                    limit: limit,
                }
            });

           
        }catch(exception){
                next(exception);
        }
    }
    completefunc = async(req,res,next) =>{
        const orderid =req.params.id
        await  this.#validateId(orderid);
        let orderDetail = await OrderModel.findById(orderid);
        if (!orderDetail) {
            return res.status(404).json({ message: "Order not found" });
        }
        if (orderDetail.status !== 'paid') {
            return res.status(400).json({ message: "Order must be paid before it can be marked as complete" });
        }
        orderDetail.status = 'complete';
        res.json({
            result: orderDetail,
            message: "order marked completed",
            meta : null
        });
    }

}

module.exports = new OrderController()