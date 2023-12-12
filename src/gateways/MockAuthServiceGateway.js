class MockAuthServiceGateway {
    status = 200
    setStatus(status) {
        this.status = status;
    }
    async verifyToken(token) {
        console.log(this.status)
        return {status: this.status , body: {id: '123',name: 'John Doe',email: 'test@test.com'}} 
    
    }
}

module.exports = MockAuthServiceGateway;
