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
    const user = socket.user || 'Unauthenticated';
    console.log(`User connected: ${user.username}`);

    // Test
    socket.on('saying:hi', (data) => {
      console.log(`${user.username} says: ${data}`);
      socket.emit('responding:hi', 'Hello there!');
    });

    // Rooms
    socket.on('project:join', (projectId) => {
      socket.join(projectId);
      console.log(`[${user.username}] Joined project: ${projectId}`);
      socket.emit('project:joined', { projectId });
    });

    socket.on('project:leave', (projectId) => {
      socket.leave(projectId);
      console.log(`[${user.username}] Left project: ${projectId}`);
      socket.emit('project:left', { projectId });
    });

    // Task events
    socket.on('task:fetchAll', async (projectId) => {
      try {
        console.log(
          `[${user.username}] Fetching tasks... Project Id: ${projectId}`
        );

        const tasks = await taskService.findAllTasks(projectId);

        io.to(projectId).emit('task:fetchedAll', { content: tasks });
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
          `[${user.username}] Fetching task... Id: ${id}. Project Id: ${projectId}`
        );

        const task = await taskService.findTaskById(id, projectId);
        io.to(projectId).emit('task:fetched', { content: task });
      } catch (e) {
        socket.emit('task:error', {
          title: 'Task fetch failed',
          message: e.message,
        });
      }
    });

    socket.on('task:create', async ({ task, projectId }) => {
      try {
        console.log(
          `[${user.username}] Creating new task... Project Id: ${projectId}`
        );

        const newTask = await taskService.createTask({ ...task }, projectId);
        // Using io instead of socket to emit to all connected clients (see later to emit to a specific room)
        io.to(projectId).emit('task:created', { content: newTask });
      } catch (e) {
        socket.emit('task:error', {
          title: 'Task creation failed',
          message: e.message,
        });
      }
    });

    socket.on('task:update', async ({ id, task, projectId }) => {
      try {
        console.log(
          `[${user.username}] Updating new task... Id: ${id}. Project Id: ${projectId}`
        );

        const updatedTask = await taskService.updateTask(id, { ...task });
        io.to(projectId).emit('task:updated', { content: updatedTask });
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
          `[${user.username}] Deleting new task... Id: ${id}. Project Id: ${projectId}`
        );

        await taskService.deleteTask(id);
        io.to(projectId).emit('task:deleted', { content: { id } });
      } catch (e) {
        socket.emit('task:error', {
          title: 'Task deletion failed',
          message: e.message,
        });
      }
    });

    socket.on('disconnect', () => {
      console.log(`User disconnected: ${user.username}`);
    });
  });
};

export default socketMiddleware;
