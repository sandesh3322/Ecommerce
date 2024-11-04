const { deleteCloudFile } = require("../../config/cloudinary.config")
const PaymentModel = require("./payment.model")
class PaymentService{
    createPayment = async (data) => {
        try{
            const payment = new PaymentModel(data)
            return await payment.save()
        }catch(exception)
        {
            throw exception
        }
    }
    listData = async ({skip=0 , limit=10,filter = {}}) =>{
        try{
            const count = await PaymentModel.countDocuments(filter);
            const data = await  PaymentModel.find(filter)
                                .populate("createdBy",["_id","name","email","role"])
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
                const paymentDetail = await PaymentModel.findOne(filter)
                                        .populate("createdBy",["_id","name", "email", "role"])
                return paymentDetail;
        }catch(exception){
            throw exception
        }
    }
    updatePayment = async (data,id) => {
        try{
                const response =  await PaymentModel.findByIdAndUpdate(id,{$set: data}, {new: false})
                if(data.image){
                    deleteCloudFile(response.image)
                        .then((result) => {
                                  console.log('Image deleted successfully:', result);
                         })
                        .catch((error) => {
                                  console.error('Error deleting image:', error);
                          });

                }
                return response
        }catch(exception){
            throw exception;
        }
    }
    deleteById = async (id) =>{
        try{
            const response = await PaymentModel.findByIdAndDelete(id);
            deleteCloudFile(response.image)
                        .then((result) => {
                                  console.log('Image deleted successfully:', result);
                         })
                        .catch((error) => {
                                  console.error('Error deleting image:', error);
                          });
            
            if(!response){
                throw {status: 404, message :" payment not found " }
            }

            return response;
        }
        catch(exception){
            throw exception
        }
    }
}

module.exports = new PaymentService ()