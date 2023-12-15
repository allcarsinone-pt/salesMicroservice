class MockRabbitMQ {
    
    async sendToQueue (id, queueName = 'updateAvailability') {
        console.log('Mock rabbit')
    }
}

module.exports = MockRabbitMQ