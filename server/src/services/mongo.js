const mongoose = require('mongoose');

const MONGO_URL =
  'mongodb+srv://nasa-api:1qaz2wsx3edc@nasacluster.f5u6i.mongodb.net/?retryWrites=true&w=majority&appName=NASACluster';

mongoose.connection.once('open', () => {
  console.log('Connected to MongoDB');
});

mongoose.connection.on('error', (err) => {
  console.error('Failed to connect to MongoDB:', err);
});

async function mongoConnect() {
  await mongoose.connect(MONGO_URL);
}

async function mongoDisconnect() {
  await mongoose.disconnect();
}

module.exports = {
  mongoConnect,
  mongoDisconnect,
};
