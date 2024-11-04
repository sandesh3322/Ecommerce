const Joi = require("joi");
const StatusType = require("../../config/constant.config")
const BrandCreateDTO = Joi.object({
    title : Joi.string().min(3).max(100).required(),
    status: Joi.string().regex(/^(active|inactive)$/).required(),
    // status: Joi.string().valid(...Object.values(StatusType)).required(),
    image: Joi.string().required()


});
const BrandUpdateDTO = Joi.object({
    title : Joi.string().min(3).max(100).required(),
    status: Joi.string().regex(/^(active|inactive)$/).required(),
    // status: Joi.string().valid(...Object.values(StatusType)).required(),
    image: Joi.string().optional(),
    

});

// console.log(...Object.values(StatusType));

module.exports = {
    BrandCreateDTO,
    BrandUpdateDTO
}