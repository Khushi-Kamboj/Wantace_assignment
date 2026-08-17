import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import configRoutes from './routes/configRoutes.js';
import estimateRoutes from './routes/estimateRoutes.js';
import authRoutes from './routes/authRoutes.js';
import adminConfigRoutes from './routes/adminConfigRoutes.js';

const app = express();

app.use(cors());
app.use(express.json());
app.use(cookieParser());

app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    message: 'Northline Roofing API is running'
  });
});
app.use('/api/config', configRoutes);
app.use('/api/estimate', estimateRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/admin/config', adminConfigRoutes);

export default app;