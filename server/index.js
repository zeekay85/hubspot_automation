import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { aiRoutes } from './routes/aiRoutes.js';
import { errorHandler } from './utilities/errorHandler.js';

const app = express();
const port = process.env.PORT || 3001;

app.use(cors({ origin: 'http://localhost:5173' }));
app.use(express.json({ limit: '1mb' }));

app.get('/api/health', (_request, response) => {
  response.json({ status: 'ok', service: 'marketing-ops-hub-api' });
});

app.use('/api', aiRoutes);
app.use(errorHandler);

app.listen(port, () => {
  console.log(`Marketing Ops Hub API running on http://localhost:${port}`);
});
