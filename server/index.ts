import responseTime from 'response-time';
import socketIo from 'socket.io';
import mongoose from 'mongoose';
import express from 'express';
import morgan from 'morgan';
import http from 'http';
import cors from 'cors';
import fs from 'fs';

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
import portfolio from './routes/portfolio';

import { fake, real, get } from './services/coins';

const app = express();
const server = http.createServer(app);

let rawOrigins = fs.readFileSync('origins.json');
let origins: any = JSON.parse(rawOrigins.toString());
origins = origins.map((origin: any) => origin.url);

// @ts-ignore
const io = socketIo(server, {
  cors: true,
  origin: origins
});

app.use(responseTime());
app.use(express.json());
app.use(morgan('dev'));
app.use(express.urlencoded({ extended: true }));
app.use(cors());
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
app.use(api, portfolio);

setInterval(async () => {
  await real();
}, 5 * 60 * 1000);

setInterval(async () => {
  await fake();
}, 2.5 * 60 * 1000);

io.on('connection', (socket: any) => {
  setInterval(async () => {
    socket.emit('coin-update', await get());
  }, 2.5 * 60 * 1000);
});

server.listen(config.port, () => {
  console.log(`Listening on http://127.0.0.1:${config.port}/`);

  // @ts-ignore
  mongoose.connect(config.mongoUri, () => {
    console.log('MongoDB connected');
  });
});