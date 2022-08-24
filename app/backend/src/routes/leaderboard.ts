import { Router } from 'express';
import LeaderboardController from '../controllers/leaderbordController';

const leaderboard = Router();

leaderboard.get('/', LeaderboardController.getAll);

leaderboard.get('/home', LeaderboardController.getAllHome);

leaderboard.get('/away', LeaderboardController.getAllAway);

export default leaderboard;
