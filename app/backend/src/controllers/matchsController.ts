import { Request, Response } from 'express';
import MatchService from '../services/matchService';
import 'express-async-errors';

export default class MatchController {
  public static async getAll(req: Request, res: Response) {
    const { inProgress } = req.query;
    if (inProgress === 'true' || inProgress === 'false') {
      const matchs = await MatchService.getByQuery(inProgress as string);
      return res.status(200).json(matchs);
    }
    const matchs = await MatchService.getAll();
    return res.status(200).json(matchs);
  }

  public static async create(req: Request, res: Response) {
    const match = req.body;
    const createdMatch = await MatchService.createInProgress(match);
    return res.status(201).json(createdMatch);
  }

  public static async update(req: Request, res: Response) {
    const { id } = req.params;
    const object = req.body;
    await MatchService.update(Number(id), object);
    return res.status(200).json({ message: 'OK' });
  }
}
