import jwt from 'jsonwebtoken';
import config from '../config/config.js';
import Task from '../models/task.model.js';

const socketMiddleware = (io) => {
  io.use((socket, next) => {
    const token = socket.handshake.query.token;

    if (!token) {
      // console.error('No token provided. Proceeding as unauthenticated.');
      socket.user = null;
      return next();
    }

    jwt.verify(token, config.JWT_SECRET, (err, decoded) => {
      if (err) {
        console.error('Invalid token:', err.message);
        return next(new Error('Authentication error: Invalid token'));
      }

      socket.user = decoded;
      console.log('User authenticated:', decoded);
      next();
    });
  });

  io.on('connection', (socket) => {
    if (socket.user) {
      console.log(`User connected: ${socket.user.id}`);
    } else {
      console.log('User connected: Unauthenticated');
    }

    const broadcastTaskChange = (eventName, message) => {
      io.emit(eventName, message);
    };

    socket.on('task:create', async (task) => {
      try {
        console.log('Creating new task...');

        broadcastTaskChange('task:created', task);
      } catch (e) {
        socket.emit('task:error', {
          title: 'Task creation failed',
          message: e.message,
        });
      }
    });

    socket.on('task:update', async (task) => {
      try {
        console.log('Updating new task...');

        broadcastTaskChange('task:updated', task);
      } catch (e) {
        socket.emit('task:error', {
          title: 'Task update failed',
          message: e.message,
        });
      }
    });

    socket.on('task:delete', async (task) => {
      try {
        console.log('Creating new task...');

        broadcastTaskChange('task:deleted', task);
      } catch (e) {
        socket.emit('task:error', {
          title: 'Task deletion failed',
          message: e.message,
        });
      }
    });

    socket.on('disconnect', () => {
      if (socket.user) {
        console.log(`User disconnected: ${socket.user.id}`);
      } else {
        console.log('User disconnected: Unauthenticated');
      }
    });
  });
};

export default socketMiddleware;
