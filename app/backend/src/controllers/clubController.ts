import { Request, Response } from 'express';
import ClubService from '../services/clubService';
import 'express-async-errors';

export default class ClubController {
  public static async get(req: Request, res: Response) {
    const clubs = await ClubService.getAll();
    return res.status(200).json(clubs);
  }

  public static async getById(req: Request, res: Response) {
    const { id } = req.params;
    const club = await ClubService.getById(Number(id));
    return res.status(200).json(club);
  }
}
