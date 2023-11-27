import express, { Express } from 'express';

import dotenv from 'dotenv';
import { DataSource } from 'typeorm';
import cors from 'cors';
import bodyParser from 'body-parser';
import { Task } from './src/tasks/task.entity';
import { taskRouter } from './src/tasks/task.router';

// Instantiate express
const app: Express = express();
dotenv.config();

// Pase request Body
app.use(bodyParser.json());

// Use CORS install types as well
app.use(cors());

//Create Database Connection
export const AppDataSource = new DataSource({
  type: 'mysql',
  host: '127.0.0.1',
  port: 3307,
  username: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DB, // Make sure this property is set
  entities: [Task],
  synchronize: true,
});

// Define server port
const port = process.env.PORT || 3000;

AppDataSource.initialize()
  .then(() => {
    // Start listening to the requests
    app.listen(port);
    console.log(`Database Connected, your port : ${port}`);
  })
  .catch((err) => {
    console.error('Error connecting to database: ', err);
  });

app.use('/', taskRouter);
