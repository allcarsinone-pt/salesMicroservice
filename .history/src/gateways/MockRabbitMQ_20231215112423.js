class MockRabbitMQ {
    
    async sendToQueue (id, queueName = 'updateAvailability') {
    const connection = await amqplib.connect(this.baseURI)
    const channel = await connection.createChannel()
    await channel.assertQueue(queueName)
    await channel.sendToQueue(queueName, Buffer.from(id.toString()))
    }
    
}

module.exports = MockRabbitMQ