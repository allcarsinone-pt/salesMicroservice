const makeApp = require("./app");
const PaymentMethodRepository = require("./src/repository/PaymentMethodRepository");
const dotenv = require('dotenv');
const PaymentRepository = require("./src/repository/PaymentRepository");
const MockAuthServiceGateway = require("./src/gateways/MockAuthServiceGateway");
const MockVehicleServiceGateway = require("./src/gateways/MockVehicleServiceGateway");
const AxiosAuthServiceAdapter = require("./src/gateways/AxiosAuthServiceAdapter");
const AxiosVehicleServiceAdapter = require("./src/gateways/AxiosVehicleServiceAdapter");
//const LogMockAdapter = require("./src/gateways/LogMockAdapter");
const ElasticLogService = require('./src/controllers/services/ElasticLogService')
const RabbitMQAdapter = require("./src/gateways/RabbitMQAdapter");
const MockRabbitMQ = require("./src/gateways/MockRabbitMQ");
const LogMockAdapter = require("./src/gateways/LogMockAdapter");

//const vehicleService = new MockVehicleServiceGateway();
//vehicleService.setAvailability(1);

dotenv.config();

//const authService = new AxiosAuthServiceAdapter(process.env.GATEWAY_URI);
const authService = new MockAuthServiceGateway();
const vehicleService = new AxiosVehicleServiceAdapter(process.env.GATEWAY_URI);
const app = makeApp(new PaymentMethodRepository(process.env.DATABASE_URL),
                    new PaymentRepository(process.env.DATABASE_URL),
                    vehicleService, 
                    authService, 
                    new LogMockAdapter(),
                    new MockRabbitMQ()
                );

app.listen(process.env.PORT || 3004, () => {
    console.log(`Server is running on http://localhost:${process.env.PORT || 3004}`)
})