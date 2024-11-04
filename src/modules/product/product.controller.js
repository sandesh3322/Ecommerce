const { uploadImage} = require("../../config/cloudinary.config");
const { StatusType } = require("../../config/constant.config");
const { deleteFile } = require("../../utilities/helpers");
const { message } = require("../auth/auth.request");
const productService = require("./product.service");
const slugify = require('slugify')
class ProductController {
    productDetail;

    create = async (req,res,next) => {
        try{
            let data = req.body;
            data.sellerid = req.authuser._id;
            data.slug = slugify(data.title, {lower: true})


            if (req.files && req.files.length > 0) {
                data.images = [];  // Array to store image URLs
                for (let file of req.files) {
                  const imageUrl = await uploadImage("./public/uploads/product/" + file.filename);
                  data.images.push(imageUrl);
                  deleteFile("./public/uploads/product/" + file.filename); // Optionally delete after uploading
                }
              }
        const product = await productService.createProduct(data);
            res.json({
                result: product,
                message: " product created sucessfully",
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
                        $or: [
                            { title: searchRegex },          // search in title
                            { tags: { $in: [searchRegex] } } // search within the tags array
                        ]
                    }
                }
                const {count ,data} = await productService.listData({
                    skip: skip , 
                    filter: filter,
                    limit: limit

                });
                res.json({
                    result: data,
                    message: "product list all ",
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
        this.productDetail = await productService.getDetailByFilter({
            _id:id
        })
        if(!this.productDetail){
            throw{status : 404 , message :" product does not exist "}
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
                result :this.productDetail,
                message : " Product fetched sucessfully ",
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
            if (req.files && req.files.length > 0) {
                data.images = await Promise.all(req.files.map(async (file) => {
                    try {
                        // Upload the file and get the uploaded image URL
                        const uploadedImageUrl = await uploadImage('./public/uploads/product/' + file.filename);
                        
                        // Delete the local file after successful upload
                        deleteFile('./public/uploads/product/' + file.filename);
                        
                        return uploadedImageUrl; // Return the uploaded image URL to the array
                    } catch (err) {
                        console.error(`Error handling file ${file.filename}:`, err);
                        throw { status: 500, message: `Failed to process file ${file.filename}` };
                    }
                }));
            }
            // transform
            const response = await productService.updateProduct(data,id)
            res.json({
                result: response, 
                meta: null,
                message : " product updated sucessfully"
            })
        }catch(exception){
            next(exception)
        }
    }

    delete = async(req, res, next) =>{
        try{
            const id = req.params.id
            await this.#validateId(id)
            const response = await productService.deleteById(id)
            // todo delete image from cloudinary
            res.json({
                result: response ,
                meta: null,
                message : "product deleted"
            })
        }catch(exception){
            next(exception)
        }
    }
    listForHome = async(req,res,next) =>{
        try{
            const list = await productService.listData({
                
                filter : {
                    featured: true,
                   
                }
            })
            res.json({
                result : list ,
                meta: null,
                message: " product list"
            })
        }catch(exception){
                next(exception);
        }
    }
    feature = async (req, res, next) => {
        try {
          const id = req.params.id;
          
          // Validate the product ID
          await this.#validateId(id);
          
          const product = this.productDetail;
          
          if (product.featured === true) {
            // Unfeature the product
            product.featured = false;
            await product.save();
            res.json({
              result: product,
              meta: null,
              message: "Product unfeatured successfully"
            });
          } else {
            // Feature the product
            product.featured = true;
            await product.save();
            res.json({
              result: product,
              meta: null,
              message: "Product featured successfully"
            });
          }
        } catch (exception) {
          next(exception); // Handle any errors
        }
      };

}

module.exports = new ProductController()