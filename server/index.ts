import responseTime from 'response-time';
import mongoose from 'mongoose';
import express from 'express';
import morgan from 'morgan';
import cors from 'cors';

import config from './config/config';

import shutdown from './middleware/shutdown';

import login from './routes/login';
import register from './routes/register';
import dashboard from './routes/dashboard';
import auth from './routes/auth';
import friend from './routes/friend';
import game from './routes/game';
import coin from './routes/coin';
import account from './routes/account';
import coinflip from './routes/coinflip';

const app = express();

app.use(responseTime());
app.use(express.json());
app.use(morgan('dev'));
app.use(express.urlencoded({ extended: true }));
app.use(cors({ origin: ['http://127.0.0.1:3000', 'http://localhost:3000'], credentials: true }));
app.use(shutdown);

app.disable('x-powered-by');

const api = '/api';

app.use(api, login);
app.use(api, register);
app.use(api, dashboard);
app.use(api, auth);
app.use(api, friend);
app.use(api, game);
app.use(api, coin);
app.use(api, account);
app.use(api, coinflip);

app.listen(config.port, () => {
  console.log(`Listening on http://127.0.0.1:${config.port}/`)

  mongoose.connect(config.mongoUri, () => {
    console.log('MongoDB connected');
  });
});