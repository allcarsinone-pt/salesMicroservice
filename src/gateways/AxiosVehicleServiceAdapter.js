const axios = require('axios');

class AxiosVehicleServiceAdapter {
    constructor(baseURI) {
        this.baseURI = baseURI;
    }
    async getVehicle(id) {
        
        const response = await axios.get(`${this.baseURI}/vehicles/get/${id}`)
        return {
            status: response.status,
            body: response.data
        }
    }
}

module.exports = AxiosVehicleServiceAdapter