import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { errorHandler } from './middleware/error.middleware';
import authRoutes from './routes/auth.routes';
import userRoutes from './routes/user.routes';
import itemRoutes from './routes/item.routes';
import reviewRoutes from './routes/review.routes';
import bookingRoutes from './routes/booking.routes';
import dashboardRoutes from './routes/dashboard.routes';
import aiRoutes from './routes/ai.routes';

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/items', itemRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/ai', aiRoutes);

app.get('/', (_req, res) => {
  res.send('EventHub Server is running 🚀');
});

app.get('/health', (_req, res) => {
  res.json({ success: true, message: 'Server is healthy ✅' });
});

export default app;
