import express from 'express';
import cors from 'cors';
import userRoutes from './routes/user.routes.js';
import taskRoutes from './routes/task.routes.js';
import projectRoutes from './routes/project.routes.js';
import workspaceRoutes from './routes/workspace.routes.js';
import commentRoutes from './routes/comment.routes.js';
import tagRoutes from './routes/tag.routes.js';
import authRoutes from './routes/auth.routes.js';

const app = express();
const apiPrefix = '/api';

app.use(
  cors({
    origin: '*', // Allow all origins
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);
app.use(express.json());

app.use(`${apiPrefix}/users`, userRoutes);
app.use(`${apiPrefix}/tasks`, taskRoutes);
app.use(`${apiPrefix}/projects`, projectRoutes);
app.use(`${apiPrefix}/workspaces`, workspaceRoutes);
app.use(`${apiPrefix}/comments`, commentRoutes);
app.use(`${apiPrefix}/tags`, tagRoutes);
app.use(`${apiPrefix}/auth`, authRoutes);

//TODO: Error handling goes here

export default app;
