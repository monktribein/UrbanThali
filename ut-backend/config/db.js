const mongoose = require('mongoose');
const { secret } = require('./secret');

mongoose.set('strictQuery', false);

// local url 
const DB_URL = 'mongodb://0.0.0.0:27017/shofy'; 
// mongodb url - using MongoDB Atlas or local fallback
const MONGO_URI = secret.db_url || 'mongodb+srv://urbanthali:urbanthali123@cluster0.mongodb.net/urbanthali?retryWrites=true&w=majority';

const connectDB = async () => {
  try { 
    console.log('Attempting to connect to MongoDB...');
    console.log('Connection string:', MONGO_URI);
    await mongoose.connect(MONGO_URI);
    console.log('mongodb connection success!');
  } catch (err) {
    console.log('mongodb connection failed!', err.message);
    console.log('Error details:', err);
    // Don't exit the process, let the server continue
  }
};

module.exports = connectDB;
