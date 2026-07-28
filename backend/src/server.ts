import express from 'express';
import cors from 'cors';
import router from './routes';
import { errorHandler } from './middlewares/error.middleware';
import { config } from './config';

const app = express();
app.use(cors());
app.use(express.json());
app.use('/api', router);
app.use(errorHandler);

app.listen(config.port, () => {
  console.log(`Backend running on port ${config.port}`);
});