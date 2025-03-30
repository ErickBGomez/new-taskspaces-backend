import jwt from 'jsonwebtoken';
import config from '../config/config.js';
import * as taskService from '../services/task.service.js';

const socketMiddleware = (io) => {
  io.use((socket, next) => {
    const token = socket.handshake.auth.token;

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
    const user = socket.user?.id || 'Unauthenticated';
    console.log(`User connected: ${user}`);

    socket.on('saying:hi', (data) => {
      console.log(`${user} says: ${data}`);
      socket.emit('responding:hi', 'Hello there!');
    });

    socket.on('task:fetchAll', async (projectId) => {
      try {
        console.log(`[${user}] Fetching tasks... Project Id: ${projectId}`);

        const tasks = await taskService.findAllTasks(projectId);

        socket.emit('task:fetchedAll', { content: tasks });
      } catch (e) {
        socket.emit('task:error', {
          title: 'Task fetch failed',
          message: e.message,
        });
      }
    });

    socket.on('task:fetch', async ({ id, projectId }) => {
      try {
        console.log(
          `[${user}] Fetching task... Id: ${id}. Project Id: ${projectId}`
        );

        const task = await taskService.findTaskById(id, projectId);
        socket.emit('task:fetched', { content: task });
      } catch (e) {
        socket.emit('task:error', {
          title: 'Task fetch failed',
          message: e.message,
        });
      }
    });

    socket.on('task:create', async ({ projectId, task }) => {
      try {
        console.log(`[${user}] Creating new task... Project Id: ${projectId}`);

        const newTask = await taskService.createTask(projectId, task);
        socket.emit('task:created', { content: newTask });
      } catch (e) {
        socket.emit('task:error', {
          title: 'Task creation failed',
          message: e.message,
        });
      }
    });

    socket.on('task:update', async ({ id, projectId, task }) => {
      try {
        console.log(
          `[${user}] Updating new task... Id: ${id}. Project Id: ${projectId}`
        );

        const updatedTask = await taskService.updateTask(id, projectId, task);
        socket.emit('task:updated', { content: updatedTask });
      } catch (e) {
        socket.emit('task:error', {
          title: 'Task update failed',
          message: e.message,
        });
      }
    });

    socket.on('task:delete', async ({ id, projectId }) => {
      try {
        console.log(
          `[${user}] Deleting new task... Id: ${id}. Project Id: ${projectId}`
        );

        await taskService.deleteTask(id, projectId);
        socket.emit('task:deleted', { content: null });
      } catch (e) {
        socket.emit('task:error', {
          title: 'Task deletion failed',
          message: e.message,
        });
      }
    });

    socket.on('disconnect', () => {
      console.log(`User disconnected: ${user}`);
    });
  });
};

export default socketMiddleware;
