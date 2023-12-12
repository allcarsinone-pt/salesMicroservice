exports.createPayment = async (req, res) => {
    
    const {vehicleId, paymentMethodId} = req.body;
    

    try {
    if(!vehicleId || !paymentMethodId) return res.status(400).send({message: 'Missing fields'})

    const paymentRepository = req.app.get('PaymentRepository')
    const vehicleServiceGateway = req.app.get('VehicleServiceGateway')

    const vehicle = await vehicleServiceGateway.getVehicle(vehicleId);
    if(vehicle.status !== 200) return res.status(400).send({message: 'Vehicle not found'})
    console.log(vehicle)
    if(vehicle.body.availability === 0) return res.status(400).send({message: 'Vehicle not available'})

    const logServiceApp = req.app.get('LogService')
    const authService = req.app.get('AuthService')
    const token = req.headers.authorization.split(' ')[1];

    const decodedToken = await authService.verifyToken(token)
    console.log(decodedToken)
    if(decodedToken.status !== 200) return res.status(403).send({message: 'Operation not allowed'})

    const paymentMethod = await paymentRepository.create({vehicleId, paymentMethodId, userId: decodedToken.body.id, price: vehicle.body.price, date: new Date().toISOString()});
    logServiceApp.log({from: 'salesMicroservice', data: `Payment done sucessfully `, date: new Date(), status: 'success'});
    return res.status(201).send(paymentMethod);
    } catch (e) {
        const logServiceApp = req.app.get('LogService')
        logServiceApp.log({from: 'salesMicroservice', data: e.message, date: new Date(), status: 'error'});
        return res.status(500).send({message: 'Internal Server Error'})
    }
}

exports.getAllPaymentForUser = async (req, res) => {
    try {
        const authService = req.app.get('AuthService')
        const token = req.headers.authorization.split(' ')[1];
    
        const decodedToken = await authService.verifyToken(token)
        if(decodedToken.status != 200) return res.status(403).send({message: 'Operation not allowed'})
        
    const paymentRepository = req.app.get('PaymentRepository')
    const logServiceApp = req.app.get('LogService')
    const payments = await paymentRepository.getAll({userId: decodedToken.body.id});
    logServiceApp.log({from: 'salesMicroservice', data: 'Payments fetched', date: new Date(), status: 'success'});
    return res.status(200).send(payments);
    } catch (e) {
        const logServiceApp = req.app.get('LogService')
        logServiceApp.log({from: 'salesMicroservice', data: e.message, date: new Date(), status: 'error'});
        return res.status(500).send({message: 'Internal Server Error'})
    }
}
