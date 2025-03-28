const amqp = require('amqplib');

let channel = null;

const connectRabbitMQ = async () => {
  try {
    const connection = await amqp.connect('amqp://host.docker.internal');
    channel = await connection.createChannel();
    
    // Assert exchanges and queues
    await channel.assertExchange('order_events', 'topic', { durable: true });
    await channel.assertExchange('delivery_events', 'topic', { durable: true });
    
    // Order service queues
    await channel.assertQueue('order_created_queue', { durable: true });
    await channel.bindQueue('order_created_queue', 'order_events', 'order.created');
    
    // Delivery service queues
    await channel.assertQueue('delivery_assignment_queue', { durable: true });
    await channel.bindQueue('delivery_assignment_queue', 'order_events', 'order.ready_for_delivery');
    
    console.log('RabbitMQ connected and queues/exchanges set up');
  } catch (error) {
    console.error('RabbitMQ connection error:', error);
    process.exit(1);
  }
};

const getChannel = () => channel;

module.exports = { connectRabbitMQ, getChannel };