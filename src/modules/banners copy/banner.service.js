const { deleteCloudFile } = require("../../config/cloudinary.config")
const BannerModel = require("./banner.model")
class BannerService{
    createBanner = async (data) => {
        try{
            const banner = new BannerModel(data)
            return await banner.save()
        }catch(exception)
        {
            throw exception
        }
    }
    listData = async ({skip=0 , limit=10,filter = {}}) =>{
        try{
            const count = await BannerModel.countDocuments(filter);
            const data = await  BannerModel.find(filter)
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
                const bannerDetail = await BannerModel.findOne(filter)
                                        .populate("createdBy",["_id","name", "email", "role"])
                return bannerDetail;
        }catch(exception){
            throw exception
        }
    }
    updateBanner = async (data,id) => {
        try{
                const response =  await BannerModel.findByIdAndUpdate(id,{$set: data}, {new: false})
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
            const response = await BannerModel.findByIdAndDelete(id);
            deleteCloudFile(response.image)
                        .then((result) => {
                                  console.log('Image deleted successfully:', result);
                         })
                        .catch((error) => {
                                  console.error('Error deleting image:', error);
                          });
            
            if(!response){
                throw {status: 404, message :" banner not found " }
            }

            return response;
        }
        catch(exception){
            throw exception
        }
    }
}

module.exports = new BannerService ()