import express from 'express';
import cors from 'cors';
import userRoutes from './routes/user.routes.js';
import taskRoutes from './routes/task.routes.js';
import projectRoutes from './routes/project.routes.js';
import workspaceRoutes from './routes/workspace.routes.js';
import commentRoutes from './routes/comment.routes.js';
import tagRoutes from './routes/tag.routes.js';
import bookmarkRoutes from './routes/bookmark.routes.js';
import searchRoutes from './routes/search.routes.js';
import authRoutes from './routes/auth.routes.js';
import mediaRouters from './routes/media.routes.js';
import memberRoutes from './routes/member.routes.js';

const app = express();
const apiPrefix = '/api';

// CORS configuration
app.use(
  cors({
    origin: '*', // Allow all origins
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

// Middleware to parse JSON bodies
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve public files and uploads in the 'public' directory
app.use(express.static('public'));

app.use(`${apiPrefix}/users`, userRoutes);
app.use(`${apiPrefix}/tasks`, taskRoutes);
app.use(`${apiPrefix}/projects`, projectRoutes);
app.use(`${apiPrefix}/workspaces`, workspaceRoutes);
app.use(`${apiPrefix}/comments`, commentRoutes);
app.use(`${apiPrefix}/tags`, tagRoutes);
app.use(`${apiPrefix}/bookmarks`, bookmarkRoutes);
app.use(`${apiPrefix}/media`, mediaRouters);
app.use(`${apiPrefix}/search`, searchRoutes);
app.use(`${apiPrefix}/auth`, authRoutes);
app.use(`${apiPrefix}/members`, memberRoutes);

export default app;
