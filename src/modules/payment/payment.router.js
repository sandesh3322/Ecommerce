const express = require('express');
const router = express.Router();
const axios = require('axios');
const querystring = require('querystring');
const hasPermission = require('../../middlewares/rbac.middleware');
const selfordercheck = require('../../middlewares/selfChecker.middleware')
const paymentController = require('./payment.controller');
const logincheck = require('../../middlewares/auth.middleware');
const selfpaymentshow = require('../../middlewares/selfChecker.middleware')
const verifypayement = require('../../middlewares/verifypayment.middleware')
require('dotenv').config();
//public
// router.get('/list-home', paymentController.listForHome)

 router.route('/success/order/:id')
    .post(logincheck,hasPermission(['admin', 'customer','seller']),verifypayment,selfordercheck , paymentController.create)
 router.route('/')  
    .get(logincheck, hasPermission('admin'), paymentController.index)
router.route('/seller/index')
    .get(logincheck, hasPermission(['admin','seller']),paymentController.getSellerPayments)
    
router.route('/:id')
    .get(logincheck,hasPermission(['admin',"customer", "seller"]),selfpaymentshow, paymentController.show)
    .patch(logincheck,hasPermission("admin"),selfpaymentchecker,setPath('payment'),paymentController.update)
    .delete(logincheck,hasPermission('admin'),selfpaymentchecker, paymentController.delete)


module.exports = router;



