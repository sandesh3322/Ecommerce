const Joi = require("joi");
const StatusType = require("../../config/constant.config")
const CategoryCreateDTO = Joi.object({
    title : Joi.string().min(3).max(100).required(),
    status: Joi.string().regex(/^(active|inactive)$/).required(),
    // status: Joi.string().valid(...Object.values(StatusType)).required(),
    image: Joi.string().empty(null,"").optional(),
    parentId : Joi.string(),
    brands: Joi.array().items(Joi.string().optional()),




});
const CategoryUpdateDTO = Joi.object({
    title : Joi.string().min(3).max(100).required(),
    status: Joi.string().regex(/^(active|inactive)$/).required(),
    // status: Joi.string().valid(...Object.values(StatusType)).required(),
    image: Joi.string().empty(null,"").optional(),
    parentId : Joi.string(),
    brands: Joi.array().items(Joi.string().optional()),
    

});

// console.log(...Object.values(StatusType));

module.exports = {
    CategoryCreateDTO,
    CategoryUpdateDTO
}