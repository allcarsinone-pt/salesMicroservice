const axios = require('axios');

class AxiosAuthServiceAdapter {
    constructor(baseURI) {
        this.baseURI = baseURI;
    }
    async login(token) {
        const response = await axios.get(`${this.baseURI}/users/validate`, {
            headers: {
                authorization: token
            }
        })
        return {
            status: response.status,
            body: response.data
        }
    }
}

module.exports = AxiosAuthServiceAdapter