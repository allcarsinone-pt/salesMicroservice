const makeApp = require("./app");
const PaymentMethodRepository = require("./src/repository/PaymentMethodRepository");
const dotenv = require('dotenv');
const PaymentRepository = require("./src/repository/PaymentRepository");
const MockAuthServiceGateway = require("./src/gateways/MockAuthServiceGateway");
const MockVehicleServiceGateway = require("./src/gateways/MockVehicleServiceGateway");

const authService = new MockAuthServiceGateway();
const vehicleService = new MockVehicleServiceGateway();

authService.setStatus(200);
vehicleService.setAvailability(1);

dotenv.config();
const app = makeApp(new PaymentMethodRepository(process.env.DATABASE_URL),new PaymentRepository(process.env.DATABASE_URL),vehicleService, authService);

app.listen(process.env.PORT || 3000, () => {
    console.log(`Server is running on http://localhost:${process.env.PORT || 3000}`)
})