const { uploadImage} = require("../../config/cloudinary.config");
const { StatusType } = require("../../config/constant.config");
const { deleteFile } = require("../../utilities/helpers");
const ProductModal = require("../product/product.model");
const CategoryModel = require("./category.model");
const categoryService = require("./category.service");
const slugify = require('slugify')
class CategoryController {
    categoryDetail;

    create = async (req,res,next) => {
        try{
            const data = req.body;
            data.image= await uploadImage("./public/uploads/category/"+req.file.filename)
            data.slug = slugify(data.title, {lower: true})
            
            deleteFile("./public/uploads/category/"+req.file.filename)
            // req
            if(!data.parentId || data.parentId === 'null'|| data.parentId ===  null){
                data.parentId = null
            }
            if(!data.brands || data.brands === 'null'|| data.brands ===  null){
                data.brands = null
            }
            data.createdBy = req.authuser._id;
            const category = await categoryService.createCategory(data);
            res.json({
                result: category,
                message: " category created sucessfully",
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
                const {count ,data} = await categoryService.listData({
                    skip: skip , 
                    filter: filter,
                    limit: limit

                });
                res.json({
                    result: data,
                    message: "category list all ",
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
        this.categoryDetail = await categoryService.getDetailByFilter({
            _id:id
        })
        if(!this.categoryDetail){
            throw{status : 404 , message :" category does not exist "}
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
                result :this.categoryDetail,
                message : " Category fetched sucessfully ",
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
                data.image = await uploadImage('./public/uploads/category/'+ req.file.filename);
                deleteFile('./public/uploads/category/'+req.file.filename) 
            }
            if(!data.parentId || data.parentId === 'null'|| data.parentId ===  null){
                data.parentId = null
            }
            if(!data.brands || data.brands === 'null'|| data.brands ===  null){
                data.brands = null
            }
            // transform
            const response = await categoryService.updateCategory(data,id)
            res.json({
                result: response, 
                meta: null,
                message : " category updated suceffulyy"
            })
        }catch(exception){
            next(exception)
        }
    }

    delete = async(req, res, next) =>{
        try{
            const id = req.params.id
            await this.#validateId(id)
            const response = await categoryService.deleteById(id)
            // todo delete image from cloudinary
            res.json({
                result: response ,
                meta: null,
                message : "category deleted"
            })
        }catch(exception){
            next(exception)
        }
    }
    listForHome = async(req,res,next) =>{
        try{
            const list = await categoryService.listData({
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
                message: " category list"
            })
        }catch(exception){
                next(exception);
        }
    }
    detailBySlug = async(req,res,next) =>{
        try {
            const slug = req.params.slug;
    
            // Find the category by slug
            const category = await CategoryModel.findOne({ slug: slug });
    
            if (!category) {
                return res.status(404).json({ message: "Category not found" });
            }
    
            // Fetch products associated with this category
            const products = await ProductModal.find({ category: category._id });
    
            return res.json({
                message: `Products for category: ${category.name}`,
                result: products,
                mets:null
            });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: "Server error" });
        }
    }; 
 }



module.exports = new CategoryController()