const { deleteCloudFile } = require("../../config/cloudinary.config")
const ProductModel = require("./product.model")
class ProductService{
    createProduct = async (data) => {
        try{
            const product = new ProductModel(data)
            return await product.save()
        }catch(exception)
        {
            throw exception;
        }
    }
    listData = async ({skip=0 , limit=50 ,filter = {}}) =>{
        try{
            const count = await ProductModel.countDocuments(filter);
            const data = await  ProductModel.find(filter)
                                .populate("createdBy",["_id","name","email","role"])
                                .sort({_id: "desc"}) // latest on top 
                              //  .limit(limit)
                                .skip(skip)
            return { count , data}
        }
        catch(exception){
            throw exception
        }
    }
    getDetailByFilter= async (filter) => {
        try{
                const productDetail = await ProductModel.findOne(filter)
                                        .populate("createdBy",["_id","name", "email", "role"])
                return productDetail;
        }catch(exception){
            throw exception
        }
    }
    updateProduct = async (data,id) => {
        try{
                const response =  await ProductModel.findByIdAndUpdate(id,{$set: data}, {new: true})
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
            const response = await ProductModel.findByIdAndDelete(id);
            deleteCloudFile(response.image)
                        .then((result) => {
                                  console.log('Image deleted successfully:', result);
                         })
                        .catch((error) => {
                                  console.error('Error deleting image:', error);
                          });
            
            if(!response){
                throw {status: 404, message :" product not found " }
            }

            return response;
        }
        catch(exception){
            throw exception
        }
    }
}

module.exports = new ProductService ()