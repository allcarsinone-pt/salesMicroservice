const router = require('express').Router();
const PaymentMethodController = require('../controllers/PaymentMethodController');
const PaymentController = require('../controllers/PaymentController');
const AuthServiceMiddleware = require('../middlewares/AuthServiceMiddleware');
const roles = require('../models/Roles');

router.post('/methods/', AuthServiceMiddleware.execute([roles.ADMIN]), PaymentMethodController.createPaymentMethod);
router.get('/methods', AuthServiceMiddleware.execute([roles.ADMIN]), PaymentMethodController.getAllPaymentMethods);
router.delete('/methods/:id', AuthServiceMiddleware.execute([roles.ADMIN]), PaymentMethodController.deletePaymentMethod);
router.post('/', AuthServiceMiddleware.execute([]), PaymentController.createPayment);
router.get('/', AuthServiceMiddleware.execute([]) ,PaymentController.getAllPaymentForUser);

module.exports = router;