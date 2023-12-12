class Payment {
    constructor({id, vehicleid, price, date, paymentmethodid, paymentMethodName, userid}) {
        this.id = id;
        this.userId = userid;
        this.vehicleId = vehicleid;
        this.price = price;
        this.date = date;
        this.paymentMethodId = paymentmethodid;
        this.paymentMethodName = paymentMethodName;
    }
}

module.exports = Payment;