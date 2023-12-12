const router = require('express').Router();
const PaymentMethodController = require('../controllers/PaymentMethodController');
const PaymentController = require('../controllers/PaymentController');
router.post('/createPaymentMethod', PaymentMethodController.createPaymentMethod);
router.get('/getAllPaymentMethods', PaymentMethodController.getAllPaymentMethods);
router.delete('/deletePaymentMethod/:id', PaymentMethodController.deletePaymentMethod);
router.post('/createPayment', PaymentController.createPayment);
router.get('/getAllPayments', PaymentController.getAllPaymentForUser);

module.exports = router;