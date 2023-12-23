import express from 'express';
import loginRouter from './routes/login'
var db = require("./database/database")

export class App {
  public server;
  

  constructor() {
    this.server = express();

    this.middlewares();
    this.routes();
  }

  middlewares() {
    this.server.use(express.json());
  }
  
  routes() {
    this.server.use('/api/login', loginRouter);
  }
}

export default new App().server;