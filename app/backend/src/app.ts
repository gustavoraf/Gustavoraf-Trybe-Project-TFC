import * as express from 'express';
import { NextFunction, Request, Response } from 'express';
import 'express-async-errors';
import HttpException from './interfaces/HttpException';
import {
  login,
  club,
  matchs,
  leaderboard,
} from './routes';

class App {
  public app: express.Express;

  constructor() {
    this.app = express();
    this.app.use(express.json());
    this.config();
    this.routes();
  }

  private config():void {
    const accessControl: express.RequestHandler = (_req, res, next) => {
      res.header('Access-Control-Allow-Origin', '*');
      res.header('Access-Control-Allow-Methods', 'GET,POST,DELETE,OPTIONS,PUT,PATCH');
      res.header('Access-Control-Allow-Headers', '*');
      next();
    };

    this.app.use(accessControl);
  }

  private routes(): void {
    this.app.use('/login', login);
    this.app.use('/clubs', club);
    this.app.use('/matchs', matchs);
    this.app.use('/leaderboard', leaderboard);
    this.app.use((err: HttpException, _req: Request, res: Response, _next: NextFunction) => {
      if (typeof (err.status) !== 'number') {
        console.log(err);
        return res.status(500).json({ message: 'Erro no banco de dados' });
      }
      console.log(err);
      return res.status(err.status).json({ message: err.message });
    });
  }

  public start(PORT: string | number): void {
    this.app.listen(PORT, () => {
      console.log('Running on', PORT);
    });
  }
}

export { App };

// A execução dos testes de cobertura depende dessa exportação
export const { app } = new App();
