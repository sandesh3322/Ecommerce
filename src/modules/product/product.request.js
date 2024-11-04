const Joi = require("joi");
const StatusType = require("../../config/constant.config")
const attributeSchema = Joi.object({
    name: Joi.string().required(),
    value: Joi.string().required(),
  });


const ProductCreateDTO = Joi.object({
    
    title: Joi.string().required(),
    summary: Joi.string().optional(),
    description: Joi.string().required(),
    price: Joi.number().required(),
    status: Joi.string().valid('active', 'inactive').optional(),
    discount: Joi.number().default(0),
    categories: Joi.array().items(Joi.string().length(24)).optional(), // ObjectId
    brand: Joi.string().length(24).optional(), // ObjectId
    attributes: Joi.array().items(attributeSchema).optional(), // Optional attributes
    tags: Joi.array().items(Joi.string()).optional(),
    stockquantity: Joi.number().integer().min(0).optional(),
    images: Joi.array().items(Joi.string().uri()).min(1).optional(),


});
const ProductUpdateDTO = Joi.object({
   
    title: Joi.string().required(),
    summary: Joi.string().optional(),
    description: Joi.string().required(),
    price: Joi.number().required(),
    status: Joi.string().valid('active', 'inactive').optional(),
    discount: Joi.number().default(0),
    categories: Joi.array().items(Joi.string().length(24)).optional(), // ObjectId
    brand: Joi.string().length(24).optional(), // ObjectId
    attributes: Joi.array().items(attributeSchema).optional(), // Optional attributes
    tags: Joi.array().items(Joi.string()).optional(),
    stockquantity: Joi.number().integer().min(0).optional(),
    images: Joi.array().items(Joi.string().uri()).min(1).optional(),

});

// console.log(...Object.values(StatusType));

module.exports = {
    ProductCreateDTO,
    ProductUpdateDTO,
    
}