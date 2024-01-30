exports.createPaymentMethod = async (req, res) => {

    const logServiceApp = req.app.get('LogAdapter')

    // Prevent not allowed users to access this route
    if(req.user.body.blocked.includes(req.originalUrl)) {
        logServiceApp.execute('SalesServiceCreatePaymentMethod', 'You dont have permission to access this route', 'error')
        return res.status(403).json({ message: 'You dont have permission to access this route' })
    }

    const {name} = req.body;

    try {
    if(!name) return res.status(400).send({message: 'name is required'})

    const paymentMethodRepository = req.app.get('PaymentMethodRepository')
    const logServiceApp = req.app.get('LogService')
    const paymentMethod = await paymentMethodRepository.create({name});
    logServiceApp.log({from: 'salesMicroservice', data: `${paymentMethod} created `, date: new Date(), status: 'success'});
    return res.status(201).send(paymentMethod);
    } catch (e) {
        const logServiceApp = req.app.get('LogService')
        logServiceApp.log({from: 'salesMicroservice', data: e.message, date: new Date(), status: 'error'});
        return res.status(500).send({message: 'Internal Server Error'})
    }
}

exports.getAllPaymentMethods = async (req, res) => {

    const logServiceApp = req.app.get('LogAdapter')

    // Prevent not allowed users to access this route
    if(req.user.body.blocked.includes(req.originalUrl)) {
        logServiceApp.execute('SalesServiceGetAllPaymentMethods', 'You dont have permission to access this route', 'error')
        return res.status(403).json({ message: 'You dont have permission to access this route' })
    }

    try {
    const paymentMethodRepository = req.app.get('PaymentMethodRepository')
    const logServiceApp = req.app.get('LogService')
    const paymentMethods = await paymentMethodRepository.getAll();
    logServiceApp.log({from: 'salesMicroservice', data: 'Payments fetched', date: new Date(), status: 'success'});
    return res.status(200).send(paymentMethods);
    } catch (e) {
        const logServiceApp = req.app.get('LogService')
        logServiceApp.log({from: 'salesMicroservice', data: e.message, date: new Date(), status: 'error'});
        return res.status(500).send({message: 'Internal Server Error'})
    }
}

exports.deletePaymentMethod = async (req, res) => {

    const logServiceApp = req.app.get('LogAdapter')

    // Prevent not allowed users to access this route
    if(req.user.body.blocked.includes(req.originalUrl)) {
        logServiceApp.execute('SalesServiceDeletePaymentMethod', 'You dont have permission to access this route', 'error')
        return res.status(403).json({ message: 'You dont have permission to access this route' })
    }

    const {id} = req.params;
    try {
    if(!id) return res.status(400).send({message: 'id is required'})

    const paymentMethodRepository = req.app.get('PaymentMethodRepository')
    const logService = req.app.get('LogService') || console;
    const paymentMethod = await paymentMethodRepository.delete(id);
    logService.log({from: 'salesMicroservice', data: `${paymentMethod} deleted`, date: new Date(), status: 'success'});
    return res.status(200).send({message: 'PaymentMethod deleted'});
    } catch (e) {
        logService.log({from: 'salesMicroservice', data: e.message, date: new Date(), status: 'error'});
        return res.status(500).send({message: 'Internal Server Error'})
    }
}