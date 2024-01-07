import express from 'express';
import loginRouter from './routes/login';
import operationsRouter from './routes/operations';
import cors from 'cors';

export class App {
  public server;
  

  constructor() {
    this.server = express();
    this.server.use(cors());

    this.middlewares();
    this.routes();
  }

  middlewares() {
    this.server.use(express.json());
  }
  
  routes() {
    this.server.use('/api/login', loginRouter);
    this.server.use('/api/operations', operationsRouter);
  }
}

export default new App().server;