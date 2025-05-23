import app from './app.js';
import http from 'http';
import config from './config/config.js';
import { Server } from 'socket.io';
import socketMiddleware from './middlewares/socket.middleware.js';

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
  },
});

socketMiddleware(io);

const start = async () => {
  try {
    server.listen(config.PORT, () => {
      console.log(`Server running on port http://localhost:${config.PORT}`);
    });

    process.on('SIGINT', async () => {
      console.log('Shutting down server...');

      server.close(() => {
        console.log('Server shut down');
        process.exit(0);
      });
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

start();
