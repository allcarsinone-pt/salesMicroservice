
class MockVehicleServiceGateway {
    availabiliy = undefined
    notFound = false
    setAvailability(availability) {
        this.availabiliy = availability;
    }
    setNotFound(notFound) {
        this.notFound = notFound;
    }
  async getVehicle(id) {
    let status = 201
    if(this.notFound) status = 404
    return {
        status,
        body: {
            id,
            availability: this.availabiliy !== undefined ? this.availabiliy : (Math.random() >= 0.5 ? 1 : 0),
            price: 1000,
        }
    }
  }
}
module.exports = MockVehicleServiceGateway;