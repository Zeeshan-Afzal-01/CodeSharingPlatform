import mongoose from 'mongoose';

const mongoURL = "mongodb://localhost:27017/codeSharingPlatform"
if (!mongoURL) {
  console.error('MongoDB URI is not defined');
  process.exit(1);  // Exit the application if the URI is missing
}

mongoose.connect(mongoURL);

const db = mongoose.connection;

db.on('connected', () => {
  console.log('MongoDB is connected');
});

db.on('error', () => {
  console.log('MongoDB connection failed');
});

db.on('disconnected', () => {
  console.log('MongoDB is disconnected');
});

export default db;
