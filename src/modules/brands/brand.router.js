const router = require('express').Router()
const { FileFilterType } = require('../../config/constant.config');
const logincheck = require('../../middlewares/auth.middleware');
const hasPermission = require('../../middlewares/rbac.middleware');
const { setPath, uploadFile } = require('../../middlewares/uploader.middleware');
const { bodyValidator } = require('../../middlewares/validator.middleware');
const brandController = require('./brand.controller');
const { BrandCreateDTO ,BrandUpdateDTO} = require('./brand.request');
//public
router.get('/list-home', brandController.listForHome)
// to do brand wise list product

 router.get("/:slug/detail",brandController.detailBySlug)

 router.route('/')
    .post(logincheck,hasPermission("admin"),setPath('brand'),uploadFile(FileFilterType.IMAGE).single("image"),bodyValidator(BrandCreateDTO),brandController.create)
    .get(logincheck, hasPermission('admin'), brandController.index)
    
router.route('/:id')
    .get(logincheck,hasPermission('admin'), brandController.show)
    .patch(logincheck,hasPermission("admin"),setPath('brand'),uploadFile(FileFilterType.IMAGE).single("image"),bodyValidator(BrandUpdateDTO),brandController.update)
    .delete(logincheck,hasPermission('admin'), brandController.delete)


    module.exports = router;