import { Request, Response } from 'express';
import * as jwt from 'jsonwebtoken';
import { compare } from 'bcryptjs';
import { readFileSync } from 'fs';
import { UserDB, UserWithoutPassword } from '../interfaces/UserInterfaces';
import LoginService from '../services/LoginService';
import 'express-async-errors';

const jwtConfig: object = { algorithm: 'HS256' };

export default class LoginController {
  public static async post(req: Request, res: Response) {
    const { email, password } = req.body;
    const user = await LoginService.findByEmailPassword(email) as UserDB;
    if (!user) {
      return res.status(401).json({ message: 'Incorrect email or password' });
    }
    const passwordVerification = await compare(password, user.password);
    if (!passwordVerification) {
      return res.status(401).json({ message: 'Incorrect email or password' });
    }
    const passwordRemovedUser = {
      id: user.id,
      username: user.username,
      role: user.role,
      email: user.email,
    };
    const JWT_SECRET = readFileSync('jwt.evaluation.key', { encoding: 'utf8' }) as string;
    const token = jwt.sign({ ...passwordRemovedUser }, JWT_SECRET, jwtConfig);
    return res.status(200).json({ user: passwordRemovedUser, token, });
  }

  public static async validateGet(req: Request, res: Response) {
    const { authorization: token } = req.headers;
    const { role } = jwt.decode(token as string, jwtConfig) as UserWithoutPassword;
    return res.status(200).json(role);
  }
}
