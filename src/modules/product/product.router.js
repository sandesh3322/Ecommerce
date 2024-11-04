const router = require('express').Router()
const { FileFilterType } = require('../../config/constant.config');
const logincheck = require('../../middlewares/auth.middleware');
const hasPermission = require('../../middlewares/rbac.middleware');
const { selfproductchecker } = require('../../middlewares/selfChecker.middleware');
const { setPath, uploadFile } = require('../../middlewares/uploader.middleware');
const { bodyValidator } = require('../../middlewares/validator.middleware');
const productController = require('./product.controller');
const { ProductCreateDTO ,ProductUpdateDTO} = require('./product.request');
//public
router.get('/list-home', productController.listForHome)

 router.route('/')
    .post(logincheck,hasPermission("admin","seller"),setPath('product'),uploadFile(FileFilterType.IMAGE).array("images"),bodyValidator(ProductCreateDTO),productController.create)
    .get(logincheck, hasPermission('admin','customer',"seller"), productController.index)
    
router.route('/:id')
    .get(logincheck,hasPermission('admin',"customer", "seller"), productController.show)
    .patch(logincheck,hasPermission("admin", "seller"),selfproductchecker,setPath('product'),uploadFile(FileFilterType.IMAGE).array("images"),bodyValidator(ProductUpdateDTO),productController.update)
    .delete(logincheck,hasPermission('admin',"seller"),selfproductchecker, productController.delete)
router.route('/:id/featuredoption')
    .patch(logincheck,hasPermission('admin'),productController.feature)

    module.exports = router;