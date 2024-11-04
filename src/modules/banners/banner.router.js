const router = require('express').Router()
const { FileFilterType } = require('../../config/constant.config');
const logincheck = require('../../middlewares/auth.middleware');
const hasPermission = require('../../middlewares/rbac.middleware');
const { setPath, uploadFile } = require('../../middlewares/uploader.middleware');
const { bodyValidator } = require('../../middlewares/validator.middleware');
const bannerController = require('./banner.controller');
const { BannerCreateDTO ,BannerUpdateDTO} = require('./banner.request');
//public
router.get('/list-home', bannerController.listForHome)

 router.route('/')
    .post(logincheck,hasPermission("admin"),setPath('banner'),uploadFile(FileFilterType.IMAGE).single("image"),bodyValidator(BannerCreateDTO),bannerController.create)
    .get(logincheck, hasPermission('admin'), bannerController.index)
    
router.route('/:id')
    .get(logincheck,hasPermission('admin'), bannerController.show)
    .patch(logincheck,hasPermission("admin"),setPath('banner'),uploadFile(FileFilterType.IMAGE).single("image"),bodyValidator(BannerUpdateDTO),bannerController.update)
    .delete(logincheck,hasPermission('admin'), bannerController.delete)


    module.exports = router;