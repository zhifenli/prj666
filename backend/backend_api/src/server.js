// src/server.js

// We want to gracefully shutdown our server
const stoppable = require('stoppable');

// Import WebSocketServer from the 'ws' package
const { WebSocketServer } = require('ws');

// Get our express app instance
const app = require('./app');

// Get the desired port from the process' environment. Default to `8080`
const port = parseInt(process.env.PORT || '8080', 10);

// Start a server listening on this port and wrap it with `stoppable`
const server = stoppable(
  app.listen(port, () => {
    // Log a message that the server has started, and which port it's using.
    console.log(`Server started on port ${port}`);
  })
);

// Create a WebSocketServer instance using the HTTP server
const wss = new WebSocketServer({ noServer: true });

// Store connected WebSocket clients
let clients = [];

// WebSocket server connection event
wss.on('connection', (ws) => {
  console.log('Client connected');
  clients.push(ws);

  // Handle client disconnection
  ws.on('close', () => {
    clients = clients.filter(client => client !== ws);
    console.log('Client disconnected');
  });
});

// Upgrade HTTP requests to WebSocket connections
server.on('upgrade', (request, socket, head) => {
  wss.handleUpgrade(request, socket, head, (ws) => {
    wss.emit('connection', ws, request);
  });
});

// Graceful shutdown handling
process.on('SIGTERM', shutdown);
process.on('SIGINT', shutdown);

function shutdown() {
  console.log('Received shutdown signal, closing WebSocket and HTTP server...');
  
  // Close WebSocket connections
  clients.forEach((client) => {
    if (client.readyState === client.OPEN) {
      client.close();
    }
  });

  // Stop accepting new connections, then shut down after existing connections are handled
  server.stop((err) => {
    if (err) {
      console.error('Error shutting down the server:', err);
      process.exit(1);
    } else {
      console.log('Server shutdown gracefully');
      process.exit(0);
    }
  });
}

// Export our server instance so other parts of our code can access it if necessary.
module.exports = server;
