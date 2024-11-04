const CartModel = require("../modules/carts/cart.model");
const CartService  = require("../modules/carts/cart.service");
const OrderModel = require("../modules/order/order.model");
const PaymentModel = require("../modules/payment/payment.model");
const ProductService  = require("../modules/product/product.service");
const selfChecker = (req, res, next) => {

    if (req.authuser.role === 'admin') {
        return next(); // Admin can bypass self-check
    }

    const userIdFromToken = req.authuser._id; // Extracted from logincheck middleware
    const userIdFromParams = req.params.id;
  
    if (userIdFromToken.toString() === userIdFromParams || req.user.role === 'admin') {
      next(); // Allow if the user is updating themselves or is an admin
    } else {
      return res.status(403).json({ message: "Unauthorized: You can only update your own profile." });
    }
  };


  const selfcartchecker = async (req, res, next) => {
    if (req.authuser.role === 'admin') {
        return next(); // Admin can bypass self-check
    }

    try {
        const cartId = req.params.id; // Extracting the cart ID from the request params
        const userIdFromToken = req.authuser._id; // Extracted from the logincheck middleware

        // Fetch the cart details using the cart ID
        const cartDetail = await  CartService.getDetailByFilter({ _id: cartId });

        if (!cartDetail) {
            return res.status(404).json({ message: "Cart not found." });
        }

        const customerIdFromCart = cartDetail.customerid; // The customerId from the cart entry

        // Check if the logged-in user is the owner of the cart
        if (customerIdFromCart.toString() === userIdFromToken.toString()) {
            return next(); // Allow if the user is the owner of the cart
        } else {
            return res.status(403).json({ message: "Unauthorized: You can only modify your own cart." });
        }
    } catch (error) {
        next(error); // Pass the error to the error handling middleware
    }
};
  const selfproductchecker = async (req, res, next) => {
    if (req.authuser.role === 'admin') {
        return next(); // Admin can bypass self-check
    }

    try {
        const productId = req.params.id; // Extracting the cart ID from the request params
        const userIdFromToken = req.authuser._id; // Extracted from the logincheck middleware

        // Fetch the cart details using the cart ID
        const productDetail = await    ProductService.getDetailByFilter({ _id: productId});

        if (!productDetail) {
            return res.status(404).json({ message: "Cart not found." });
        }

        const sellerIdFromproduct = productDetail.sellerid; // The customerId from the cart entry

        // Check if the logged-in user is the owner of the cart
        if (sellerIdFromproduct.toString() === userIdFromToken.toString()) {
            return next(); // Allow if the user is the owner of the cart
        } else {
            return res.status(403).json({ message: "Unauthorized: You can only modify your own product." });
        }
    } catch (error) {
        next(error); // Pass the error to the error handling middleware
    }
};
const selfordercheck = async (req, res, next) => {
    try {
        if (req.authuser.role === 'admin') {
            return next();
        }
        if (req.authuser.role === 'seller') {
            // Step 3: Fetch the order by its ID
            const order = await OrderModel.findById(req.params.id).populate('cartid');
            if (!order) {
                return res.status(404).json({ message: 'Order not found' });
            }

            // Step 4: Get the cart details and extract product IDs
            const cart = await CartModel.findById(order.cartid._id);
            if (!cart) {
                return res.status(404).json({ message: 'Cart not found' });
            }

            // Step 5: Find the seller's products
            const sellerProducts = await ProductModel.find({ sellerid: req.authuser._id }).select('_id');
            const sellerProductIds = sellerProducts.map(product => product._id.toString()); // Extract seller's product IDs

            // Step 6: Check if the cart contains any products that belong to the seller
            const hasAccess = cart.products.some(product => sellerProductIds.includes(product.productid.toString()));

            if (hasAccess) {
                return next(); // If the seller has a product in the order, allow access
            } else {
                return res.status(403).json({ message: 'No access to this order' });
            }
        }
        if (req.authuser.role === 'customer') {
            const orderid = req.params.id;
            const userid = req.authuser._id;

            // Find the order by ID
            const orderdetails = await OrderModel.findById(orderid);
            if (!orderdetails) {
                return res.status(404).json({ message: "Order not found" });
            }

            const cartid = orderdetails.cartid;

            // Find the cart by ID
            const cartdetails = await CartModel.findById(cartid);
            if (!cartdetails) {
                return res.status(404).json({ message: "Cart not found" });
            }

            // Check if the cart belongs to the authenticated user
            if (cartdetails.customerid.toString() === userid.toString()) {
                return next();
            } else {
                return res.status(403).json({ message: "Unauthorized" });
            }
        }
        return res.status(403).json({ message: 'Unauthorized access' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};
  const selfpaymentshow = async(req,res,next) =>{
    try{
        if(req.authuser.role =="admin"){
            next()
        }
        if(req.authuser.role == 'customer'){
            const paymentdetail =await PaymentModel.findById(req.params.id)
            if(paymentdetail.customerid == req.authuser._id){
                next()
            
            }else{
                throw{status:400 , message: "no access "}
            }
        }
        if (req.authuser.role === "seller") {
            // Step 1: Get the payment detail
            const paymentDetail = await PaymentModel.findById(req.params.id).populate('orderid'); // Populate the order ID

            // Step 2: Get the order details and populate the cart
            const orderDetail = await OrderModel.findById(paymentDetail.orderid).populate('cartid'); // Assuming orderId references the Order model and cartId references the Cart model

            // Step 3: Check if the cart contains products from the seller
            const cartDetail = orderDetail.cartid; // Get the cart details
            const sellerProducts = await Product.find({ sellerid: req.authuser._id }).select('_id'); // Get the seller's products
            const sellerProductIds = sellerProducts.map(product => product._id); // Extract product IDs

            // Step 4: Check if the cart contains any products from the seller
            const hasAccess = cartDetail.products.some(product => sellerProductIds.includes(product.productid._id));
            if (hasAccess) {
                return next(); // Proceed to the next middleware
            } else {
                throw { status: 400, message: "No access" }; // Deny access
            }
        }
        

    }catch(exception){
        next(exception)

    }
  }


module.exports = {selfChecker, selfcartchecker,selfproductchecker,selfordercheck,selfpaymentshow};
  