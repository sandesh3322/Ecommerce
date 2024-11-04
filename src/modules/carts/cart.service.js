const { deleteCloudFile } = require("../../config/cloudinary.config")
const CartModel = require("./cart.model")
class CartService{
    createCart = async (data) => {
        try{
            const cart = new CartModel(data)
            return await cart.save()
        }catch(exception)
        {
            throw exception
        }
    }
    listData = async ({skip=0 , limit=10,filter = {}}) =>{
        try{
            const count = await CartModel.countDocuments(filter);
            const data = await  CartModel.find(filter)
                                .populate("customerid",["_id","name","email","role"])
                                .populate({
                                    path: "products.productid", // Populate the productid within products array
                                    select: ["_id", "title", "price"] // Select fields to return
                                })
                                .populate("orderid",["_id","status",'amount'])
                                .sort({_id: "desc"}) // latest on top 
                                .limit(limit)
                                .skip(skip)
            return { count , data}
        }
        catch(exception){
            throw exception
        }
    }
    getDetailByFilter= async (filter) => {
        try{
                const cartDetail = await CartModel.findOne(filter)
                .populate("customerid",["_id","name","email","role"])
                .populate({
                    path: "products.productid", // Populate the productid within products array
                    select: ["_id", "title", "price"] // Select fields to return
                })
                .populate("orderid",["_id","status",'amount'])
                return cartDetail;
        }catch(exception){
            throw exception
        }
    }
    updateCart = async ({productid,quantity},id) => {
        try{
            const cart = await CartModel.findById(id);
            if (!cart) {
                throw { status: 404, message: "Cart not found." };
            }
            const productIndex = cart.products.findIndex(p => p.productid.toString() === productid);
            if (productIndex === -1) {
                throw { status: 404, message: "Product not found in cart." };
            }
            cart.products[productIndex].quantity = quantity;
            cart.products[productIndex].amount = cart.products[productIndex].price * quantity; // Update the amount based on the new quantity
            const updatedCart = await cart.save(); // Save and return the updated cart

            return updatedCart; // Return the updated cart
        }catch(exception){
            throw exception;
        }
    }
    deleteById = async (id) =>{
        try{
            const response = await CartModel.findByIdAndDelete(id);
          
            
            if(!response){
                throw {status: 404, message :" cart not found " }
            }

            return response;
        }
        catch(exception){
            throw exception
        }
    }
}

module.exports = new CartService ()