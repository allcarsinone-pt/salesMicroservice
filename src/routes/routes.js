const router = require('express').Router();
const PaymentMethodController = require('../controllers/PaymentMethodController');
const PaymentController = require('../controllers/PaymentController');
const AuthServiceMiddleware = require('../middlewares/AuthServiceMiddleware');
const roles = require('../models/Roles');

router.post('/createPaymentMethod', AuthServiceMiddleware.execute([roles.ADMIN]), PaymentMethodController.createPaymentMethod);
router.get('/getAllPaymentMethods', AuthServiceMiddleware.execute([roles.ADMIN]), PaymentMethodController.getAllPaymentMethods);
router.delete('/deletePaymentMethod/:id', AuthServiceMiddleware.execute([roles.ADMIN]), PaymentMethodController.deletePaymentMethod);
router.post('/createPayment', AuthServiceMiddleware.execute([]), PaymentController.createPayment);
router.get('/getAllPayments', AuthServiceMiddleware.execute([]) ,PaymentController.getAllPaymentForUser);

module.exports = router;