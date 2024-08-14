const http = require('http');
const app = require('./app');
const PORT = process.env.PORT || 8080;

const server = http.createServer(app);

// Start the server
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
