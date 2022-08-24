import Match from '../database/models/Match';
import Club from '../database/models/Club';
import { MatchsHistory } from '../interfaces/LeaderboardInterfaces';

export default class LeaderboardService {
  Match = Match;

  Club = Club;

  private static getPlainMatches(clubHistory: Club) {
    const plainHistory = clubHistory.get({ plain: true });
    plainHistory.matchs = [...plainHistory.homeMatch, ...plainHistory.awayMatch];
    delete plainHistory.homeMatch;
    delete plainHistory.awayMatch;
    return plainHistory;
  }

  public static async getClubsHomeHistory(): Promise<MatchsHistory[]> {
    const clubsHistory = (await Club.findAll({
      include: [{
        model: Match,
        as: 'homeMatch',
        attributes: [['home_team_goals', 'goalsScored'], ['away_team_goals', 'goalsReceived']],
        where: { inProgress: false },
      }],
    }))
      .map((clubHistory) => {
        const plainHistory = clubHistory.get({ plain: true });
        plainHistory.matchs = [...plainHistory.homeMatch];
        delete plainHistory.homeMatch;
        return plainHistory;
      });
    return clubsHistory;
  }

  public static async getClubsAwayHistory(): Promise<MatchsHistory[]> {
    const clubsHistory = (await Club.findAll({
      include: [{
        model: Match,
        as: 'awayMatch',
        attributes: [['home_team_goals', 'goalsReceived'], ['away_team_goals', 'goalsScored']],
        where: { inProgress: false },
      }],
    }))
      .map((clubHistory) => {
        const plainHistory = clubHistory.get({ plain: true });
        plainHistory.matchs = [...plainHistory.awayMatch];
        delete plainHistory.awayMatch;
        return plainHistory;
      });
    return clubsHistory;
  }

  public static async getClubsOverallHistory(): Promise<MatchsHistory[]> {
    const clubsHistory = (await Club.findAll({
      include: [{
        model: Match,
        as: 'homeMatch',
        attributes: [['home_team_goals', 'goalsScored'], ['away_team_goals', 'goalsReceived']],
        where: { inProgress: false },
      }, {
        model: Match,
        as: 'awayMatch',
        attributes: [['home_team_goals', 'goalsReceived'], ['away_team_goals', 'goalsScored']],
        where: { inProgress: false },
      }],
    }))
      .map(LeaderboardService.getPlainMatches);
    return clubsHistory;
  }
}
