const Joi = require("joi");

const UserCreateDTO = Joi.object({
    
    // name : Joi.string().regex(/^[a-zA-Z ]+$/i)min(2).max(50).required().messages({
    name : Joi.string().min(2).max(50).required().messages({
        "string.empty": "name field cannot be empty",
    }),
    email : Joi.string().email().required().messages({
        "string.email" : " email must be of valid format"
    }),
    address: Joi.string().optional().empty(),
    phone: Joi.string().min(10).max(15).optional(),
    password: Joi.string().min(8).max(25).required(),
    confirmPassword: Joi.string().equal(Joi.ref('password')).required().messages({
        "any.only": "password and confirm password should match"
    }),
    image: Joi.string(),
    role: Joi.string().regex(/^(seller|customer)$/) .required().messages({
        "string.pattern.base":"role can be seller or customer",
})

})
module.exports = {
    UserCreateDTO
}