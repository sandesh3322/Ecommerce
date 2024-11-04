const userCtrl = require("../user/user.controller");
const {setPath, uploadFile} = require('../../middlewares/uploader.middleware')
const { bodyValidator} = require('../../middlewares/validator.middleware')
const { UserCreateDTO} = require('../user/user.request');
const authController = require("./auth.controller");
const LoginDTO = require("./auth.request")
const logincheck = require("../../middlewares/auth.middleware");
const hasPermission = require("../../middlewares/rbac.middleware");

const authRouter = require("express").Router()

authRouter.post("/register",setPath('user'),uploadFile().single("image"),bodyValidator(UserCreateDTO),userCtrl.userCreate)
authRouter.get("/activate/:token", authController.activateUser)
authRouter.get("/resend-activationtoken/:token", authController.resendActivationToken);
authRouter.post("/login", bodyValidator(LoginDTO), authController.login);
authRouter.get("/me",logincheck ,authController.getLoggedInUser);
authRouter.get("/refresh",authController.refreshToken)
module.exports = authRouter;
