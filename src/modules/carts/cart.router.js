const router = require('express').Router()
const { FileFilterType } = require('../../config/constant.config');
const logincheck = require('../../middlewares/auth.middleware');
const hasPermission = require('../../middlewares/rbac.middleware');
const { setPath, uploadFile } = require('../../middlewares/uploader.middleware');
const { bodyValidator } = require('../../middlewares/validator.middleware');
const cartController = require('./cart.controller');
const { CartCreateDTO ,CartUpdateDTO} = require('./cart.request');
const {selfChecker,selfcartchecker} = require('../../middlewares/selfChecker.middleware')
//public
// router.route('/list-home')
//     .get(logincheck,hasPermission('customer'),selfcartchecker, cartController.listForHome)

 router.route('/')
    .post(logincheck,hasPermission('admin','customer','seller'),bodyValidator(CartCreateDTO),cartController.create)
    .get(logincheck, hasPermission('admin'), cartController.index)
    
router.route('/:id')
    .get(logincheck,hasPermission(['admin','customer']),selfcartchecker, cartController.show)

    .patch(logincheck,hasPermission("admin",'customer'),selfcartchecker,bodyValidator(CartUpdateDTO),cartController.update)
    .delete(logincheck,hasPermission('admin','customer'),selfcartchecker, cartController.delete)
router.route('/:id/product')
    .delete(logincheck, hasPermission('admin', 'customer'), selfcartchecker, cartController.removeProduct);


    module.exports = router;