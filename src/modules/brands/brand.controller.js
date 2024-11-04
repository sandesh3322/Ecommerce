const { uploadImage} = require("../../config/cloudinary.config");
const { StatusType } = require("../../config/constant.config");
const { deleteFile } = require("../../utilities/helpers");
const BrandModel = require("./brand.model");
const brandService = require("./brand.service");
const slugify = require('slugify');
class BrandController {
    brandDetail;

    create = async (req,res,next) => {
        try{
            const data = req.body;
            data.image= await uploadImage("./public/uploads/brand/"+req.file.filename)
            data.slug = slugify(data.title, {lower: true})
            
            deleteFile("./public/uploads/brand/"+req.file.filename)
            const brand = await brandService.createBrand(data);
            data.createdBy = req.authuser._id;
            res.json({
                result: brand,
                message: " brand created sucessfully",
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
                const {count ,data} = await brandService.listData({
                    skip: skip , 
                    filter: filter,
                    limit: limit

                });
                res.json({
                    result: data,
                    message: "brand list all ",
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
        // const id = req.params.id
        if(!id){
            throw { status: 400 , message: " id is required"}
        }
        this.brandDetail = await brandService.getDetailByFilter({
            _id:id
        })
        if(!this.brandDetail){
            throw{status : 404 , message :" brand does not exist "}
        }
       }catch(exception){
        throw exception
       }
        
    }

    show = async (req, res ,next) =>{
        try{
            const id = req.params.id;
           await  this.#validateId(id,req);
            res.json({
                result :this.brandDetail,
                message : " Brand fetched sucessfully ",
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
                data.image = await uploadImage('./public/uploads/brand/'+ req.file.filename);
                deleteFile('./public/uploads/brand/'+req.file.filename) 
            }
            // transform
            const response = await brandService.updateBrand(data,id)
            res.json({
                result: response, 
                meta: null,
                message : " brand updated suceffulyy"
            })
        }catch(exception){
            next(exception)
        }
    }

    delete = async(req, res, next) =>{
        try{
            const id = req.params.id
            await this.#validateId(id)
            const response = await brandService.deleteById(id)
            // todo delete image from cloudinary
            res.json({
                result: response ,
                meta: null,
                message : "brand deleted"
            })
        }catch(exception){
            next(exception)
        }
    }
    listForHome = async(req,res,next) =>{
        try{
            const list = await brandService.listData({
                limit: 5,
                filter : {
                    status: StatusType.ACTIVE,
                    startDate: {$lte: new Date()},
                    endDate: {$gte: new Date()}
                }
            })
            res.json({
                result : list ,
                meta: null,
                message: " brand list"
            })
        }catch(exception){
                next(exception);
        }
    }
    detailBySlug = async(req,res,next) =>{
        try {
            const slug = req.params.slug;
    
            // Find the brand by slug
            const brand = await BrandModel.findOne({ slug: slug });
    
            if (!brand) {
                return res.status(404).json({ message: "Brand not found" });
            }
    
            // Fetch products associated with this brand
            const products = await ProductModal.find({ brand: brand._id });
    
            return res.json({
                meta:null,
                message: `Products for brand: ${brand.name}`,
                result: products
            });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: "Server error" });
        }
    };
    }



module.exports = new BrandController()