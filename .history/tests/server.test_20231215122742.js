const makeApp = require('../app')
const PaymentMethodRepository = require('../src/repository/PaymentMethodRepository')
const PaymentRepository = require('../src/repository/PaymentRepository')
const MockAuthServiceGateway = require('../src/gateways/MockAuthServiceGateway')
const MockVehicleServiceGateway = require('../src/gateways/MockVehicleServiceGateway')

const {GenericContainer, PullPolicy} = require('testcontainers')
const paymentMethodRepository = new PaymentMethodRepository(process.env.DATABASE_URL)
const paymentRepository = new PaymentRepository(process.env.DATABASE_URL)
const mockVehicleServiceGateway = new MockVehicleServiceGateway()
const mockAuthServiceGateway = new MockAuthServiceGateway()
const app = makeApp(paymentMethodRepository,paymentRepository,mockVehicleServiceGateway, mockAuthServiceGateway)
const request = require('supertest')(app)

//jest.setTimeout(999999)
describe('Test API', () => {
    const container = new GenericContainer('postgres:latest')
    let startedContainer;
    beforeAll(async () => {
        startedContainer = await container.withExposedPorts(5432).withEnvironment({POSTGRES_USER: 'test', POSTGRES_PASSWORD: 'test', POSTGRES_DB: 'test_db'})
        .withCopyFilesToContainer([{source: './database/init-database.sql', target: '/docker-entrypoint-initdb.d/init-database.sql'}]).
        withPullPolicy(PullPolicy.defaultPolicy()).start()
        const port = startedContainer.getMappedPort(5432)
        paymentMethodRepository.baseURI = `postgresql://test:test@localhost:${port}/test_db`
        paymentRepository.baseURI = `postgresql://test:test@localhost:${port}/test_db`

    })

    afterAll(async () => {
        await startedContainer.stop()
    })

    describe('POST /payments', () => {
        test('Should return 201 when payment is created', async () => {

            mockVehicleServiceGateway.setAvailability(1)
            mockVehicleServiceGateway.setNotFound(false)
            mockAuthServiceGateway.setStatus(200)

            const response = await request.post('/payments/createPayment').set('Authorization', 'Bearer token').send({vehicleId: 1, paymentMethodId: 1})
            expect(response.statusCode).toBe(201)
        })
        test('Should return 400 when vehicle is not available', async () => {
            mockVehicleServiceGateway.setAvailability(false)
            mockVehicleServiceGateway.setNotFound(false)
            mockAuthServiceGateway.setStatus(200)
            const response = await request.post('/payments/createPayment').set('Authorization', 'Bearer token').send({vehicleId: 1, paymentMethodId: 1})
            expect(response.statusCode).toBe(400)
        })
        test('Should return 400 when vehicle is not found', async () => {
            mockVehicleServiceGateway.setAvailability(1)
            mockVehicleServiceGateway.setNotFound(true)
            const response = await request.post('/payments/createPayment').set('Authorization', 'Bearer token').send({vehicleId: 1, paymentMethodId: 1})
            expect(response.statusCode).toBe(400)
        })
        test('Should return 400 when missing fields', async () => {
            const response = await request.post('/payments/createPayment').set('Authorization', 'Bearer token').send({vehicleId: 1})
            expect(response.statusCode).toBe(400)
        })
        test('Should return 403 when token is invalid', async () => {
            mockVehicleServiceGateway.setAvailability(1)
            mockVehicleServiceGateway.setNotFound(false)
            mockAuthServiceGateway.setStatus(401)
            const response = await request.post('/payments/createPayment').set('Authorization', 'Bearer token').send({vehicleId: 1, paymentMethodId: 1})
            expect(response.statusCode).toBe(401)
        })
    })

    describe('GET /payments/getAllPayments', () => {

        beforeAll(async () => {
            await paymentRepository.wipe()
            for(let i = 0; i < 5; i++){
                await paymentRepository.create({vehicleId: 1, price: 100, date: new Date().toISOString(), userId: 123, paymentMethodId: 1})
        }
    })
        test('Should return 200 when payments are fetched', async () => {
            mockAuthServiceGateway.setStatus(200)
            const response = await request.get('/payments/getAllPayments').set('Authorization', 'Bearer token')
            expect(response.statusCode).toBe(200)
            expect(response.body.length).toBe(5)
        })
        test('Should return 403 when token is invalid', async () => {
            mockAuthServiceGateway.setStatus(401)
            const response = await request.get('/payments/getAllPayments').set('Authorization', 'Bearer token')
            expect(response.statusCode).toBe(401)  
        })
    })
})