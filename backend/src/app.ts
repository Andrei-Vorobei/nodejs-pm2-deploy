import 'dotenv/config';
// import path from 'path';
import express from 'express';
import mongoose from 'mongoose';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import { errors } from 'celebrate';

import appRouter from './routes/index';
import { errorMiddleware } from './middlewares/error-middleware';
import { login, createUser } from './controllers/users';
import { authMiddleware } from './middlewares/auth-middleware';
import { requestLogger, errorLogger } from './middlewares/logger-middleware';
import { userAuthValidator } from './validators/user';

const { PORT = 3000, MONGODB_URI } = process.env;
const app = express();

app.use(cookieParser());

mongoose.connect(MONGODB_URI || 'mongodb://localhost:27017/mestodb');
// app.use(express.static(path.join(__dirname, 'public')));

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use(requestLogger);

app.use(cors({
  origin: ['https://magic-friday.ru', 'http://magic-friday.ru', 'http://localhost:3000'],
  credentials: true,
}));

app.post('/signin', userAuthValidator, login);
app.post('/signup', userAuthValidator, createUser);

app.use(authMiddleware);

app.use('/', appRouter);

app.use(errorLogger);

app.use(errors());

app.use(errorMiddleware);

app.listen(PORT, () => {
  console.log(`Сервер запущен на порту ${PORT}`);
});
