const mongoose = require('mongoose');
const { secret } = require('./secret');

mongoose.set('strictQuery', false);

// local url 
const DB_URL = 'mongodb://localhost:27017/urbanthali'; 
// mongodb url - fallback to local if not provided
const MONGO_URI = secret.db_url || DB_URL;

const connectDB = async () => {
  try { 
    await mongoose.connect(MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 5000, // Keep trying to send operations for 5 seconds
      socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
    });
    console.log('mongodb connection success!');
  } catch (err) {
    console.log('mongodb connection failed!', err.message);
    console.log('Please make sure MongoDB is installed and running on your system');
    console.log('You can download MongoDB from: https://www.mongodb.com/try/download/community');
  }
};

module.exports = connectDB;
