import { Router } from 'express';
import VerificationMiddlewares from '../controllers/middlewares/VerificationMiddlewares';
import LoginController from '../controllers/loginController';

const login = Router();

login.post(
  '/',
  VerificationMiddlewares.verifyEmail,
  VerificationMiddlewares.verifyPassword,
  LoginController.post,
);

login.get('/validate', LoginController.validateGet);

export default login;
