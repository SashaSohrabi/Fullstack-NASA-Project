const http = require('http');
const mongoose = require('mongoose');
const app = require('./app');
const { loadPlanetsData } = require('./models/planets.model');
const PORT = process.env.PORT || 8080;

const MONGO_URL = 'mongodb+srv://nasa-api:1qaz2wsx3edc@nasacluster.f5u6i.mongodb.net/?retryWrites=true&w=majority&appName=NASACluster';

const server = http.createServer(app);

mongoose.connection.once('open', () => {
  console.log('Connected to MongoDB');
});

mongoose.connection.on('error', (err) => {
  console.error('Failed to connect to MongoDB:', err);
})

async function startServer() {
  mongoose.connect(MONGO_URL);
  await loadPlanetsData();

  // Start the server
  server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}...`);
  });
}


startServer();