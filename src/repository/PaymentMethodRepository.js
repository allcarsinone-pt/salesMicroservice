const PaymentMethod = require('../models/PaymentMethod');
const pg = require('pg');
class PaymentMethodRepository {
    constructor(baseURI) {
        this.baseURI = baseURI;
        
    }

    async getAll() {
        const client = new pg.Client(this.baseURI);
        await client.connect();
        const result = await client.query(`SELECT * FROM paymentmethods WHERE safeDelete = 0`);
        await client.end();
        if(!result || !result.rows || result.rows.length === 0)
            return []

        return result.rows.map(row => new PaymentMethod({...row}));
    }

    async create({name}) {
        const client = new pg.Client(this.baseURI);
        await client.connect();
        const result = await client.query(`INSERT INTO paymentmethods (name) VALUES ($1) RETURNING *`,[name]);
        await client.end();
        if(!result || !result.rows || result.rows.length === 0 || !result.rows[0]) throw new Error('An error occurred while creating a new paymentMethod');
        return new PaymentMethod({...result.rows[0]})
    }


    async delete(id) {
        const client = new pg.Client(this.baseURI);
        await client.connect();
        const result = await client.query(`UPDATE paymentmethods SET safeDelete = 1 WHERE id = $1 RETURNING *`,[id]);
        await client.end();
        if(!result || !result.rows || result.rows.length === 0 || !result.rows[0]) throw new Error('An error occurred while deleting paymentMethod');
        return true;
    }
}

module.exports = PaymentMethodRepository;