import { Router } from 'express';
import MatchsController from '../controllers/matchsController';
import VerificationMiddlewares from '../controllers/middlewares/VerificationMiddlewares';

const matchs = Router();

matchs.get('/', MatchsController.getAll);

matchs.post('/', VerificationMiddlewares.authMiddleware, MatchsController.create);

matchs.patch('/:id/finish', VerificationMiddlewares.authMiddleware, MatchsController.update);

matchs.patch('/:id', VerificationMiddlewares.authMiddleware, MatchsController.update);

export default matchs;
