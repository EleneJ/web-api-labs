import dotenv from 'dotenv';
import express from 'express';
import tasksRouter from './api/tasks/index.js'; 
import './db';
import cors from 'cors';
import usersRouter from './api/users';
import authenticate from './authenticate';

dotenv.config();

const errHandler = (err, req, res, next) => {
  if(process.env.NODE_ENV === 'production') {
    return res.status(500).send(`Something went wrong!`);
  }
  res.status(500).send(`Hey!! You caught the error 👍👍. Here's the details: ${err.stack} `);
};

const app = express();

const port = process.env.PORT || 8080;

app.use(cors());

app.use(express.json());

app.use(express.static('public'));

app.use('/api/tasks', authenticate, tasksRouter);

app.use('/api/users', usersRouter);

app.use(errHandler);

app.listen(port, () => {
  console.info(`Server running at ${port}`);
});