const { deleteCloudFile } = require("../../config/cloudinary.config")
const OrderModel = require("./order.model")
class OrderService{
    createOrder = async (data) => {
        try{
            const order = new OrderModel(data)
            return await order.save()
        }catch(exception)
        {
            throw exception
        }
    }
    listData = async ({skip=0 , limit=10,filter = {}}) =>{
        try{
            const count = await OrderModel.countDocuments(filter);
            const data = await  OrderModel.find(filter)
                                .populate('cartid')
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
                const orderDetail = await OrderModel.findOne(filter)
                                        .populate("createdBy",["_id","name", "email", "role"])
                return orderDetail;
        }catch(exception){
            throw exception
        }
    }
    updateOrder = async (data,id) => {
        try{
                const response =  await OrderModel.findByIdAndUpdate(id,{$set: data}, {new: true})
                
                return response
        }catch(exception){
            throw exception;
        }
    }
    deleteById = async (id) =>{
        try{
            const response = await OrderModel.findByIdAndDelete(id);
           
            
            if(!response){
                throw {status: 404, message :" order not found " }
            }

            return response;
        }
        catch(exception){
            throw exception
        }
    }
}

module.exports = new OrderService ()