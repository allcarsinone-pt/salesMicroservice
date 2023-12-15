class MockAuthServiceGateway {
    status = 201
    setStatus(status) {
        this.status = status;
    }
    async login(token) {
        console.log(this.status)
        return {status: this.status , body: {id: '123',name: 'John Doe',email: 'test@test.com'}} 

    }
}

module.exports = MockAuthServiceGateway;