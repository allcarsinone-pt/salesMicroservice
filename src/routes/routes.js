const router = require('express').Router();
const PaymentMethodController = require('../controllers/PaymentMethodController');
const PaymentController = require('../controllers/PaymentController');
const AuthServiceMiddleware = require('../middlewares/AuthServiceMiddleware');

router.post('/createPaymentMethod', PaymentMethodController.createPaymentMethod);
router.get('/getAllPaymentMethods', PaymentMethodController.getAllPaymentMethods);
router.delete('/deletePaymentMethod/:id', PaymentMethodController.deletePaymentMethod);
router.post('/createPayment', AuthServiceMiddleware.execute, PaymentController.createPayment);
router.get('/getAllPayments', AuthServiceMiddleware.execute ,PaymentController.getAllPaymentForUser);

module.exports = router;