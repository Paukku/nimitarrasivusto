import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import orderRoutes from './routes/orderRoutes';
import { errorHandler } from './middleware/errorHandler';

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok' });
});

app.use('/api/orders', orderRoutes);
app.use(errorHandler);

const port = process.env.PORT ? parseInt(process.env.PORT, 10) : 3001;
app.listen(port, () => {
  console.log(`Backend running on http://localhost:${port}`);
});
