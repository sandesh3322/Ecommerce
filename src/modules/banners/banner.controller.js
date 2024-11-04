const { uploadImage} = require("../../config/cloudinary.config");
const { StatusType } = require("../../config/constant.config");
const { deleteFile } = require("../../utilities/helpers");
const { message } = require("../auth/auth.request");
const bannerService = require("./banner.service");
class BannerController {
    bannerDetail;

    create = async (req,res,next) => {
        try{
            const data = req.body;
            data.image= await uploadImage("./public/uploads/banner/"+req.file.filename)
            deleteFile("./public/uploads/banner/"+req.file.filename)
            const banner = await bannerService.createBanner(data);
            data.createdBy = req.authuser._id;
            res.json({
                result: banner,
                message: " banner created sucessfully",
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
                const {count ,data} = await bannerService.listData({
                    skip: skip , 
                    filter: filter,
                    limit: limit

                });
                res.json({
                    result: data,
                    message: "banner list all ",
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
        this.bannerDetail = await bannerService.getDetailByFilter({
            _id:id
        })
        if(!this.bannerDetail){
            throw{status : 404 , message :" banner does not exist "}
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
                result :this.bannerDetail,
                message : " Banner fetched sucessfully ",
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
            if(req.file){
                data.image = await uploadImage('./public/uploads/banner/'+ req.file.filename);
                deleteFile('./public/uploads/banner/'+req.file.filename) 
            }
            // transform
            const response = await bannerService.updateBanner(data,id)
            res.json({
                result: response, 
                meta: null,
                message : " banner updated sucessfully"
            })
        }catch(exception){
            next(exception)
        }
    }

    delete = async(req, res, next) =>{
        try{
            const id = req.params.id
            await this.#validateId(id)
            const response = await bannerService.deleteById(id)
            // todo delete image from cloudinary
            res.json({
                result: response ,
                meta: null,
                message : "banner deleted"
            })
        }catch(exception){
            next(exception)
        }
    }
    listForHome = async(req,res,next) =>{
        try{
            const list = await bannerService.listData({
                limit: 5,
                filter : {
                    status: StatusType.ACTIVE,
                    // startDate: {$lte: new Date()},
                    // endDate: {$gte: new Date()}
                }
            })
            res.json({
                result : list ,
                meta: null,
                message: " banner list"
            })
        }catch(exception){
                next(exception);
        }
    }

}

module.exports = new BannerController()