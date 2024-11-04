const { uploadImage} = require("../../config/cloudinary.config");
const { CartStatus } = require("../../config/constant.config");
const { deleteFile } = require("../../utilities/helpers");
const { message } = require("../auth/auth.request");
const cartService = require("./cart.service");
const ProductModel = require("../product/product.model")
const CartModel = require("./cart.model")

class CartController {
    cartDetail;

    create = async (req, res, next) => {
        try {
            const { products } = req.body;
    
            // Check if products is an array and has at least one item
            if (!Array.isArray(products) || products.length === 0) {
                return res.status(400).json({ message: "Products array is required." });
            }
    
            // Fetch the existing cart for the user
            let existingCart = await CartModel.findOne({ customerid: req.authuser._id });
    
            // Process each product in the products array
            for (const { productid, quantity } of products) {
                // Validate product ID and quantity
                if (!productid || !quantity || quantity < 1) {
                    return res.status(400).json({ message: "Product ID and quantity must be provided and valid." });
                }
    
                // Find the product in the ProductModel
                const product = await ProductModel.findById(productid);
                if (!product) {
                    return res.status(404).json({ message: `Product with ID ${productid} not found.` });
                }
    
                if (existingCart) {
                    const productIndex = existingCart.products.findIndex(p => p.productid.toString() === productid);
    
                    // If product already exists in the cart, update its quantity
                    if (productIndex !== -1) {
                        existingCart.products[productIndex].quantity += quantity;
                        existingCart.products[productIndex].amount = product.price * existingCart.products[productIndex].quantity; // Update amount
                    } else {
                        // Add new product to the cart
                        existingCart.products.push({
                            productid: productid,
                            quantity: quantity,
                            producttitle: product.title,
                            price: product.price,
                            amount: product.price * quantity // Calculate total amount
                        });
                    }
                    
                    await existingCart.save(); // Save the updated cart
    
                    return res.status(200).json({
                        result: existingCart,
                        message: "Product added to existing cart successfully.",
                        meta: null
                    });
                } else {
                    // Create a new cart if it doesn't exist
                    const cartData = {
                        customerid: req.authuser._id,
                        products: [{
                            productid: productid,
                            producttitle: product.title,
                            quantity: quantity,
                            price: product.price,
                            amount: product.price * quantity // Calculate total amount
                        }],
                        status: CartStatus.PENDING, // Default status
                    };
    
                    const cart = await cartService.createCart(cartData); // Call your cart creation service
    
                    return res.status(201).json({
                        result: cart,
                        message: "Cart created successfully.",
                        meta: null
                    });
                }
            }
        } catch (exception) {
            console.error(exception);
            next(exception);
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
                if (req.query.search) {
                    filter = {
                        products: {
                            $elemMatch: {
                                producttitle: new RegExp(req.query.search, 'i') // Case insensitive regex search
                            }
                        }
                    };
                }
                const {count ,data} = await cartService.listData({
                    skip: skip , 
                    filter: filter,
                    limit: limit

                });
                res.json({
                    result: data,
                    message: "cart list all ",
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
        this.cartDetail = await cartService.getDetailByFilter({
            _id:id
        })
        if(!this.cartDetail){
            throw{status : 404 , message :" cart does not exist "}
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
                result :this.cartDetail,
                message : " Cart fetched sucessfully ",
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
            const { productid, quantity } = req.body;

            if (!productid || !quantity || quantity <= 0) {
                return res.status(400).json({ message: "Product ID and valid quantity are required." });
            }

            const product = await ProductModel.findById(productid);
            if (!product) {
                return res.status(404).json({ message: "Product not found." });
            }

            const productIndex = this.cartDetail.products.findIndex(p => p.productid.toString() === productid);

            if (productIndex === -1) {
                return res.status(404).json({ message: "Product not found in cart." });
            }
            
            // transform
            const response = await cartService.updateCart({productid, quantity},id)
            res.json({
                result: response, 
                meta: null,
                message : " cart updated sucessfully"
            })
        }catch(exception){
            next(exception)
        }
    }

    delete = async(req, res, next) =>{
        try{
            const id = req.params.id
            await this.#validateId(id)
            const response = await cartService.deleteById(id)
            // todo delete image from cloudinary
            res.json({
                result: response ,
                meta: null,
                message : "cart deleted"
            })
        }catch(exception){
            next(exception)
        }
    }
    listForHome = async(req,res,next) =>{
        try{
            // const id = req.authuser.id; // Get the customer's ID from the authenticated user
            const page = +req.query.page || 1; // Current page number from query params, default to 1
            const limit = +req.query.limit || 10; // Items per page, default to 10
            const skip = (page - 1) * limit; // Calculate number of items to skip for pagination

            // Query to find carts created by the customer
            const list = await cartService.listData({
                limit: 5,
                filter : {
                     id:req.authuser._id,
                },
                skip: skip
            })
            res.json({
                result : list ,
                meta: null,
                message: " cart list"
            })
        }catch(exception){
                next(exception);
        }
    }
    removeProduct = async (req,res,next) =>{
        try{
            const cartid = req.params.id;
            const {productid} = req.body;
            await this.#validateId(cartid);
            const cart = await CartModel.findOne({ _id: cartId, customerid: req.authuser._id });
            if(!cart){
                throw {stauts:404 , message :" cart does not exist "}
            }
            const productIndex = cart.products.findIndex(p => p.productid.toString() === productid);
            if (productIndex === -1) {
                return res.status(404).json({ message: "Product not found in cart." });
            }
            cart.products.splice(productIndex, 1);
            await cart.save();
    
            return res.status(200).json({
                message: "Product removed from cart successfully.",
                result: cart,
                meta: null
            });
        }catch(exception){
            next(exception)
        }

    };

}

module.exports = new CartController()