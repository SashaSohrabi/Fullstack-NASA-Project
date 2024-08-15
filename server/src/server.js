const http = require('http');
const app = require('./app');
const { loadPlanetsData } = require('./models/planets.model');
const PORT = process.env.PORT || 8080;

const server = http.createServer(app);

async function startServer() {
  await loadPlanetsData();

  // Start the server
  server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}...`);
  });
}


startServer();