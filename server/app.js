import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { aiRoutes } from './routes/aiRoutes.js';
import { errorHandler } from './utilities/errorHandler.js';

export const app = express();

app.use(
  cors({
    origin: process.env.NODE_ENV === 'production' ? true : 'http://localhost:5173',
  }),
);
app.use(express.json({ limit: '1mb' }));

app.get('/api/health', (_request, response) => {
  response.json({ status: 'ok', service: 'marketing-ops-hub-api' });
});

app.use('/api', aiRoutes);
app.use(errorHandler);
