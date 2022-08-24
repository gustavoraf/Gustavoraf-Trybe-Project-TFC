import { NextFunction, Request, Response } from 'express';
import * as jwt from 'jsonwebtoken';
import { readFileSync } from 'fs';
import { JsonWebTokenError, TokenExpiredError } from 'jsonwebtoken';
import 'express-async-errors';

const jwtConfig: object = { algorithm: 'HS256' };

export default class VerificationMiddlewares {
  public static authMiddleware(req: Request, res: Response, next: NextFunction) {
    try {
      const token = req.headers.authorization as string;
      const JWT_SECRET = readFileSync('jwt.evaluation.key', { encoding: 'utf8' }) as string;
      jwt.verify(token, JWT_SECRET, jwtConfig);
      next();
    } catch (err) {
      if (err instanceof JsonWebTokenError || err instanceof TokenExpiredError) {
        return res.status(401).json({ error: 'Invalid token' });
      }
      return next(err);
    }
  }

  public static verifyEmail(req: Request, res: Response, next: NextFunction) {
    const { email } = req.body;
    if (!email) {
      return res.status(401).json({ message: 'All fields must be filled' });
    }
    next();
  }

  public static verifyPassword(req: Request, res: Response, next: NextFunction) {
    const { password } = req.body;
    if (!password) {
      return res.status(401).json({ message: 'All fields must be filled' });
    }
    next();
  }
}
