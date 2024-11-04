const router = require('express').Router()
const { FileFilterType } = require('../../config/constant.config');
const logincheck = require('../../middlewares/auth.middleware');
const hasPermission = require('../../middlewares/rbac.middleware');
const { setPath, uploadFile } = require('../../middlewares/uploader.middleware');
const { bodyValidator } = require('../../middlewares/validator.middleware');
const categoryController = require('./category.controller');
const { CategoryCreateDTO ,CategoryUpdateDTO} = require('./category.request');
//public
router.get('/list-home', categoryController.listForHome)
// to do brand wise list product
 router.get("/:slug/detail",categoryController.detailBySlug)

 router.route('/')
    .post(logincheck,hasPermission("admin"),setPath('category'),uploadFile(FileFilterType.IMAGE).single("image"),bodyValidator(CategoryCreateDTO),categoryController.create)
    .get(logincheck, hasPermission('admin'), categoryController.index)
    
router.route('/:id')
    .get(logincheck,hasPermission('admin'), categoryController.show)
    .patch(logincheck,hasPermission("admin"),setPath('category'),uploadFile(FileFilterType.IMAGE).single("image"),bodyValidator(CategoryUpdateDTO),categoryController.update)
    .delete(logincheck,hasPermission('admin'), categoryController.delete)


    module.exports = router;