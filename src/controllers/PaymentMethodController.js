exports.createPaymentMethod = async (req, res) => {
    const {name} = req.body;

    try {
    if(!name) return res.status(400).send({message: 'name is required'})

    const paymentMethodRepository = req.app.get('PaymentMethodRepository')

    const paymentMethod = await paymentMethodRepository.create({name});
    return res.status(201).send(paymentMethod);
    } catch (e) {
        console.log(e)
        return res.status(500).send({message: 'Internal Server Error'})
    }
}

exports.getAllPaymentMethods = async (req, res) => {
    try {
    const paymentMethodRepository = req.app.get('PaymentMethodRepository')
    const paymentMethods = await paymentMethodRepository.getAll();

    return res.status(200).send(paymentMethods);
    } catch (e) {

        console.log(e)
        return res.status(500).send({message: 'Internal Server Error'})
    }
}

exports.deletePaymentMethod = async (req, res) => {
    const {id} = req.params;
    try {
    if(!id) return res.status(400).send({message: 'id is required'})

    const paymentMethodRepository = req.app.get('PaymentMethodRepository')
    
    const paymentMethod = await paymentMethodRepository.delete(id);
    
    return res.status(200).send({message: 'PaymentMethod deleted'});
    } catch (e) {
        console.log(e)
        return res.status(500).send({message: 'Internal Server Error'})
    }
}