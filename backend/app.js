import express from 'express';
import cors from 'cors';
import authRoutes from './routes/auth.js';
import postRoutes from './routes/posts.js';
import plantRoutes from './routes/plants.js';
import userRoutes from './routes/users.js';
import plantreminder from './routes/plantreminder.js';
import contactRoutes from './routes/contact.js';
import quizRoutes from './routes/quizRoutes.js';
import { scheduleEmailNotifications } from './services/emailScheduler.js';

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static('uploads'));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));
// Routes
app.use('/api/auth', authRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/plants', plantRoutes);
app.use('/api/users', userRoutes);
app.use('/api/plantreminder', plantreminder);
app.use('/api/contact', contactRoutes);
app.use('/api/questions', quizRoutes);

// Schedule email notifications
scheduleEmailNotifications();

export default app;