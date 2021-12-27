import responseTime from 'response-time';
import mongoose from 'mongoose';
import express from 'express';
import morgan from 'morgan';
import cors from 'cors';

import config from './config/config';

const app = express();

app.use(responseTime());
app.use(express.json());
app.use(morgan('dev'));
app.use(express.urlencoded({ extended: true }));
app.use(cors({ origin: ['http://127.0.0.1:3000', 'http://localhost:3000'], credentials: true }));

app.disable('x-powered-by');

const api = '/api';

app.listen(config.port, () => {
  console.log(`Listening on http://127.0.0.1:${config.port}/`)

  // @ts-ignore
  mongoose.connect(config.mongoUri, () => {
    console.log('MongoDB connected');
  });
});