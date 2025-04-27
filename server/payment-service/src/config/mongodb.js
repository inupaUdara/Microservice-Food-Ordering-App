const mongoose = require('mongoose');
const { MONGODB_URI } = require('./env.js');

if(!MONGODB_URI) {
    throw new Error('MONGODB_URI is not defined in environment variables.');
}   

const connectToDatabase = async () => {
    try {
        await mongoose.connect(MONGODB_URI);
        console.log('Connected to MongoDB');
    } catch (error) {
        console.log('Error connecting to MongoDB:', error);
        process.exit(1);
    }
}

module.exports = connectToDatabase;