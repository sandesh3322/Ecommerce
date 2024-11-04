const { deleteCloudFile } = require("../../config/cloudinary.config")
const BrandModel = require("./brand.model")
class BrandService{
    createBrand = async (data) => {
        try{
            const brand = new BrandModel(data)
            return await brand.save()
        }catch(exception)
        {
            throw exception
        }
    }
    listData = async ({skip=0 , limit=10,filter = {}}) =>{
        try{
            const count = await BrandModel.countDocuments(filter);
            const data = await  BrandModel.find(filter)
                                .populate("createdBy",["_id","name","email","role"])
                                .sort({_id: "desc"})
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
                const brandDetail = await BrandModel.findOne(filter)
                                        .populate("createdBy",["_id","name", "email", "role"])
                return brandDetail;
        }catch(exception){
            throw exception
        }
    }
    updateBrand = async (data,id) => {
        try{
                const response =  await BrandModel.findByIdAndUpdate(id,{$set: data}, {new: false})
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
            const response = await BrandModel.findByIdAndDelete(id);
            deleteCloudFile(response.image)
                        .then((result) => {
                                  console.log('Image deleted successfully:', result);
                         })
                        .catch((error) => {
                                  console.error('Error deleting image:', error);
                          });
            
            if(!response){
                throw {status: 404, message :" brand not found " }
            }

            return response;
        }
        catch(exception){
            throw exception
        }
    }
}

module.exports = new BrandService ()