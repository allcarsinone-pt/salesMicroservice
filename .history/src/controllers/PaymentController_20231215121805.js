exports.createPayment = async (req, res) => {

    const {vehicleId, paymentMethodId} = req.body;


    try {
    if(!vehicleId || !paymentMethodId) return res.status(400).send({message: 'Missing fields'})

console.log( '>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> PASOU 0' )

    const paymentRepository = req.app.get('PaymentRepository')
    const vehicleServiceGateway = req.app.get('VehicleServiceGateway')


console.log( '>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> PASOU 1' )


    const vehicle = await vehicleServiceGateway.getVehicle(vehicleId);

console.log( '>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> PASOU 2' )

    if(vehicle.status !== 201) return res.status(400).send({message: 'Vehicle not found'})
    console.log(vehicle)
    if(vehicle.body.availability === false) return res.status(400).send({message: 'Vehicle not available'})

    const logServiceApp = req.app.get('LogAdapter')


console.log( '>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> PASOU 3' )


    const paymentMethod = await paymentRepository.create({vehicleId, paymentMethodId, userId: req.user.body.id, price: vehicle.body.price, date: new Date().toISOString()});
    const rabbitMQAdapter = req.app.get('RabbitMQ')


console.log( '>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> PASOU 4' )


    await rabbitMQAdapter.sendToQueue(vehicleId.toString(), 'updateAvailability');

console.log( '>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> PASOU 5' )


    await logServiceApp.execute('salesMicroservice', 'Payment done sucessfully' , 'success');


console.log( '>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> PASOU 6' )

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