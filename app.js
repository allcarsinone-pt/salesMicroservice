
const express = require('express')
const routes = require('./src/routes/routes');
const MockVehicleServiceGateway = require('./src/gateways/MockVehicleServiceGateway');
const MockAuthServiceGateway = require('./src/gateways/MockAuthServiceGateway');
const makeApp = (paymentMethodRepository, paymentRepository ,vehicleGateway= new MockVehicleServiceGateway(), authService = new MockAuthServiceGateway() ,logService=console) => {
    const myApp = express();
    myApp.use(express.json());
    
    myApp.set('VehicleServiceGateway', vehicleGateway);
    myApp.set('PaymentRepository', paymentRepository);
    myApp.set('AuthService', authService);
    myApp.set('PaymentMethodRepository', paymentMethodRepository);
    myApp.set('LogService', logService);
    myApp.use('/payments', routes);
    return myApp;
}

module.exports = makeApp;