const Joi = require("joi");
const StatusType = require("../../config/constant.config");

const ProductSchema = Joi.object({
    productid: Joi.string().required(), // Assuming productId is a string (ObjectId)
    quantity: Joi.number().integer().min(1).required()
});

const CartCreateDTO = Joi.object({
    products: Joi.array().items(ProductSchema).required() // The product object is required
});

const CartUpdateDTO = Joi.object({
    products: Joi.array().items(ProductSchema).required()// The product object is required
});

module.exports = {
    CartCreateDTO,
    CartUpdateDTO
};