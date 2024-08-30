const http = require('http');
const app = require('./app');
const { mongoConnect } = require('./services/mongo');
const { loadPlanetsData } = require('./models/planets.model');
const { loadLaunchesData } = require('./models/launches.model'); 

const PORT = process.env.PORT || 8080;

const server = http.createServer(app);

async function startServer() {
  await mongoConnect();
  await loadPlanetsData();
  await loadLaunchesData();

  // Start the server
  server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}...`);
  });
}

startServer();
