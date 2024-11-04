const router = require('express').Router()
const { FileFilterType } = require('../../config/constant.config');
const logincheck = require('../../middlewares/auth.middleware');
const hasPermission = require('../../middlewares/rbac.middleware');
const { setPath, uploadFile } = require('../../middlewares/uploader.middleware');
const { bodyValidator } = require('../../middlewares/validator.middleware');
const orderController = require('./order.controller');
const { OrderCreateDTO ,OrderUpdateDTO} = require('./order.request');
const {selfordercheck} = require('../../middlewares/selfChecker.middleware');
//public
router.get('/list-home',logincheck, hasPermission("seller"), orderController.sellerlistForPayment)

 router.route('/')
    .post(logincheck,hasPermission(["admin","customer"]),setPath('order'),bodyValidator(OrderCreateDTO),orderController.create)
    .get(logincheck, hasPermission('admin'), orderController.index)
    
router.route('/:id')
.get(logincheck, hasPermission(['admin', 'seller']), selfordercheck, orderController.show)
    .patch(logincheck,hasPermission("admin"),setPath('order'),bodyValidator(OrderUpdateDTO),orderController.update)
    .delete(logincheck,hasPermission('admin'), orderController.delete)
router.route('/complete/:id')
    .patch(logincheck, hasPermission(['admin','seller']),selfordercheck,orderController.completefunc)


    module.exports = router;