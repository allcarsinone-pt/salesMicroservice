const pg = require('pg');
const Payment = require('../models/Payment');
class PaymentRepository {
    constructor(baseURI) {
        this.baseURI = baseURI;
    }

    async create({vehicleId, price, date, userId ,paymentMethodId}) {
        const client = new pg.Client(this.baseURI);
        await client.connect();
        const result = await client.query(`INSERT INTO payments (vehicleId, price, date, userId, paymentMethodId) VALUES ($1,$2,$3,$4,$5) RETURNING *`,[vehicleId,price,date,userId,paymentMethodId]);
        await client.end();
        if(!result || !result.rows || result.rows.length === 0 || !result.rows[0]) throw new Error('An error occurred while creating a new payment');

        console.log(result.rows[0])
        return new Payment({...result.rows[0]})
    }
    async wipe() {
        const client = new pg.Client(this.baseURI);
        await client.connect();
        await client.query(`DELETE FROM payments`);
        await client.end();
    }
    async getAll({userId}) {
        const client = new pg.Client(this.baseURI);
        await client.connect();
        const result = await client.query(`SELECT * FROM payments WHERE userId = $1`,[userId]);
        await client.end();
        if(!result || !result.rows || result.rows.length === 0) throw new Error('An error occurred while fetching payments');

        return result.rows.map(row => new Payment({...row}));
    }

    async getById(id) {
        const client = new pg.Client(this.baseURI);
        await client.connect();
        const result = await client.query(`SELECT *, paymentmethods.name as 'paymentMethodName' FROM payments INNER JOIN paymentmethods ON payments.paymentMethodId = paymentmethods.id  WHERE id = $1`,[id]);
        await client.end();
        if(!result || !result.rows || result.rows.length === 0 || !result.rows[0]) throw new Error('An error occurred while fetching payment');

        return new Payment({...result.rows[0]});
       
    }	
}

module.exports = PaymentRepository;