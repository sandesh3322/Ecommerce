const { uploadImage} = require("../../config/cloudinary.config");
const { StatusType } = require("../../config/constant.config");
const { deleteFile } = require("../../utilities/helpers");
const { message } = require("../auth/auth.request");
const CartModel = require("../carts/cart.model");
const paymentService = require("./payment.service");
class PaymentController {
    paymentDetail;

    create = async (req,res,next) => {
        try{
            const data = req.body;
           
            const payment = await paymentService.createPayment(data);
            
            res.json({
                result: payment,
                message: " payment created sucessfully",
                meta : null

            })
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
                if(req.query.search){
                    filter = {
                        // title 
                        title : new RegExp(req.query.search,'i') // case insensitive
                    }
                }
                const {count ,data} = await paymentService.listData({
                    skip: skip , 
                    filter: filter,
                    limit: limit

                });
                res.json({
                    result: data,
                    message: "payment list all ",
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
        this.paymentDetail = await paymentService.getDetailByFilter({
            _id:id
        })
        if(!this.paymentDetail){
            throw{status : 404 , message :" payment does not exist "}
        }
       }catch(exception){
        throw exception
       }
        
    }

    show = async (req, res ,next) =>{
        try{
            const id = req.params.id;
           await  this.#validateId(id);
            res.json({
                result :this.paymentDetail,
                message : " Payment fetched sucessfully ",
                meta : null
            })
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
            const response = await paymentService.updatePayment(data,id)
            res.json({
                result: response, 
                meta: null,
                message : " payment updated sucessfully"
            })
        }catch(exception){
            next(exception)
        }
    }

    delete = async(req, res, next) =>{
        try{
            const id = req.params.id
            await this.#validateId(id)
            const response = await paymentService.deleteById(id)
            // todo delete image from cloudinary
            res.json({
                result: response ,
                meta: null,
                message : "payment deleted"
            })
        }catch(exception){
            next(exception)
        }
    }
    // listForHome = async(req,res,next) =>{
    //     try{
    //         const list = await paymentService.listData({
    //             limit: 5,
    //             filter : {
    //                 status: StatusType.ACTIVE,
    //                 startDate: {$lte: new Date()},
    //                 endDate: {$gte: new Date()}
    //             }
    //         })
    //         res.json({
    //             result : list ,
    //             meta: null,
    //             message: " payment list"
    //         })
    //     }catch(exception){
    //             next(exception);
    //     }
    // }
    getSellerPayments = async (req, res, next) => {
        try {
            const sellerid = req.authUser._id; // Get the seller ID from the authenticated user
            const page = +req.query.page || 1; // Current page, default is 1
            const limit = +req.query.limit || 10; // Limit per page, default is 10
            const skip = (page - 1) * limit; // Calculate how many documents to skip
    
            // Step 1: Find all products for the seller
            const sellerProducts = await Product.find({ sellerid: sellerid }).select('_id'); // Get product IDs for the seller
            const productids = sellerProducts.map(product => product._id); // Extract the product IDs
    
            // Step 2: Find all carts that contain the seller's products
            const carts = await CartModel.find({ 'products.productid': { $in: productids } }).select('_id'); // Get cart IDs
            const cartids = carts.map(cart => cart._id); // Extract the cart IDs
    
            // Step 3: Create a filter for payments with order IDs pointing to the carts
            let filter = {};
            if (cartids.length > 0) {
                filter.orderId = { $in: cartids }; // Filter payments by cart IDs
            }
    
            // Step 4: Use the listData function from paymentService for pagination
            const { count, data } = await paymentService.listData({
                skip: skip,
                limit: limit,
                filter: filter,
            });
    
            // Step 5: Send response with payments and pagination metadata
            return res.json({
                result: data,
                message: "Seller payment list fetched successfully",
                meta: {
                    currentPage: page,
                    total: count,
                    limit: limit,
                },
            });
        } catch (exception) {
            next(exception); // Pass the exception to the next middleware
        }
    };

}

module.exports = new PaymentController()