import { Router } from 'express';
import ClubController from '../controllers/clubController';

const club = Router();

club.get('/', ClubController.get);

club.get('/:id', ClubController.getById);

export default club;
