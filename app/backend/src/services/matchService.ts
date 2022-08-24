import { MatchDB, MatchDBdetailed, MatchScore } from '../interfaces/MatchInterfaces';
import HttpException from '../interfaces/HttpException';
import Match from '../database/models/Match';
import Club from '../database/models/Club';

export default class MatchService {
  Match = Match;

  public static async getAll() {
    const matchs = await Match.findAll({
      include: [{
        model: Club,
        as: 'homeClub',
        attributes: ['clubName'],
      },
      {
        model: Club,
        as: 'awayClub',
        attributes: ['clubName'],
      }],
    });
    return matchs as unknown as MatchDBdetailed[];
  }

  public static async getByQuery(query: string) {
    let booleanQuery = false;
    if (query === 'true') {
      booleanQuery = true;
    }
    const matchs = await Match.findAll({
      where: { inProgress: booleanQuery },
      include: [{
        model: Club,
        as: 'homeClub',
        attributes: ['clubName'],
      },
      {
        model: Club,
        as: 'awayClub',
        attributes: ['clubName'],
      }],
    });
    return matchs as unknown as MatchDBdetailed[];
  }

  public static async createInProgress(object: MatchDB) {
    if (object.awayTeam === object.homeTeam) {
      const err: HttpException = {
        status: 401,
        message: 'It is not possible to create a match with two equal teams',
        name: '',
      };
      throw err;
    }
    const awayTeam = await Club.findByPk(object.awayTeam);
    const homeTeam = await Club.findByPk(object.homeTeam);
    if (!awayTeam || !homeTeam) {
      const err: HttpException = {
        status: 404, message: 'There is no team with such id!', name: '' };
      throw err;
    }
    const match = await Match.create(object);
    return match as MatchDB;
  }

  public static async update(id: number, object: MatchScore) {
    if (object.homeTeamGoals) {
      console.log(object)
      await Match.update({ ...object }, { where: { id } });
    } else {
      await Match.update({ inProgress: false }, { where: { id } });
    }
  }
}
