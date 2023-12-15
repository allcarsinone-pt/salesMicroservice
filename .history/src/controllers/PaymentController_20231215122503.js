exports.createPayment = async (req, res) => {

    const {vehicleId, paymentMethodId} = req.body;


    try {
    if(!vehicleId || !paymentMethodId) return res.status(400).send({message: 'Missing fields'})

    const paymentRepository = req.app.get('PaymentRepository')
    const vehicleServiceGateway = req.app.get('VehicleServiceGateway')

    const vehicle = await vehicleServiceGateway.getVehicle(vehicleId);

    if(vehicle.status !== 201) return res.status(400).send({message: 'Vehicle not found'})
    console.log(vehicle)
    if(vehicle.body.availability === false) return res.status(400).send({message: 'Vehicle not available'})

    const logServiceApp = req.app.get('LogAdapter')

    const paymentMethod = await paymentRepository.create({vehicleId, paymentMethodId, userId: req.user.body.id, price: vehicle.body.price, date: new Date().toISOString()});
    const rabbitMQAdapter = req.app.get('RabbitMQ')
    await rabbitMQAdapter.sendToQueue(vehicleId.toString(), 'updateAvailability');
    await logServiceApp.execute('salesMicroservice', 'Payment done sucessfully' , 'success');

    console.log( "AAAAAAA SAIIIIIIIIIIIIIR" );

    return res.status(201).send(paymentMethod);
    } catch (e) {
        const logServiceApp = req.app.get('LogAdapter')
        await logServiceApp.execute('salesMicroservice', e.message, 'error');
        return res.status(500).send({message: 'Internal Server Error'})
    }
}

exports.getAllPaymentForUser = async (req, res) => {
    try {
        const authService = req.app.get('AuthService')
        const token = req.headers.authorization.split(' ')[1];

    const paymentRepository = req.app.get('PaymentRepository')
    const logServiceApp = req.app.get('LogAdapter')
    const payments = await paymentRepository.getAll({userId: req.user.body.id});
    await logServiceApp.execute('salesMicroservice', 'Payments fetched',  'success');
    return res.status(200).send(payments);
    } catch (e) {
        const logServiceApp = req.app.get('LogAdapter')
        await logServiceApp.execute('salesMicroservice', e.message, 'error');
        return res.status(500).send({message: 'Internal Server Error'})
    }
}