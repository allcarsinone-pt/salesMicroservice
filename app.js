const express = require('express')
const routes = require('./src/routes/routes');
const MockVehicleServiceGateway = require('./src/gateways/MockVehicleServiceGateway');
const MockAuthServiceGateway = require('./src/gateways/MockAuthServiceGateway');
const LogMockAdapter = require('./src/gateways/LogMockAdapter');
const MockRabbitMQ = require('./src/gateways/MockRabbitMQ');

const makeApp = (paymentMethodRepository, paymentRepository ,vehicleGateway= new MockVehicleServiceGateway(), authService = new MockAuthServiceGateway() , rabbitMQ=new MockRabbitMQ()) => {
    const myApp = express();
    myApp.use(express.json());

    myApp.set('VehicleServiceGateway', vehicleGateway);
    myApp.set('PaymentRepository', paymentRepository);
    myApp.set('RabbitMQ', rabbitMQ);
    myApp.set('AuthAdapter', authService);
    myApp.set('PaymentMethodRepository', paymentMethodRepository);
    myApp.use('/payments', routes);
    return myApp;
}

module.exports = makeApp;