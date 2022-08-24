import { Request, Response } from 'express';
import { MatchScore, MatchsHistory, Leaderboard } from '../interfaces/LeaderboardInterfaces';
import LeaderboardService from '../services/leaderboardService';
import 'express-async-errors';

export default class LeaderboardController {
  private static calcTotalPoints(matchs: MatchScore[]): number {
    const total: number = matchs.reduce((points, element) => {
      if (element.goalsScored > element.goalsReceived) return points + 3;
      if (element.goalsScored === element.goalsReceived) return points + 1;
      return points;
    }, 0);
    return total;
  }

  private static calcTotalMatchs(matchs: MatchScore[]): number {
    return matchs.length;
  }

  private static calcTotalVictories(matchs: MatchScore[]): number {
    const total: number = matchs.reduce((points, element) => {
      if (element.goalsScored > element.goalsReceived) return points + 1;
      return points;
    }, 0);
    return total;
  }

  private static calcTotalDefeats(matchs: MatchScore[]): number {
    const total: number = matchs.reduce((points, element) => {
      if (element.goalsScored < element.goalsReceived) return points + 1;
      return points;
    }, 0);
    return total;
  }

  private static calcTotalDraws(matchs: MatchScore[]): number {
    const total: number = matchs.reduce((points, element) => {
      if (element.goalsScored === element.goalsReceived) return points + 1;
      return points;
    }, 0);
    return total;
  }

  private static calcTotalGoalsScored(matchs: MatchScore[]): number {
    const total: number = matchs.reduce((points, element) => points + element.goalsScored, 0);
    return total;
  }

  private static calcTotalGoalsReceived(matchs: MatchScore[]): number {
    const total: number = matchs.reduce((points, element) => points + element.goalsReceived, 0);
    return total;
  }

  private static createLeaderboardObject(element: MatchsHistory) {
    return {
      name: element.clubName,
      totalPoints: LeaderboardController.calcTotalPoints(element.matchs),
      totalGames: LeaderboardController.calcTotalMatchs(element.matchs),
      totalVictories: LeaderboardController.calcTotalVictories(element.matchs),
      totalDraws: LeaderboardController.calcTotalDraws(element.matchs),
      totalLosses: LeaderboardController.calcTotalDefeats(element.matchs),
      goalsFavor: LeaderboardController.calcTotalGoalsScored(element.matchs),
      goalsOwn: LeaderboardController.calcTotalGoalsReceived(element.matchs),
      goalsBalance: 0,
      efficiency: 0,
    };
  }

  private static isHigherOrLower(a: number, b: number) {
    if (a > b) return -1;
    if (a < b) return 1;
    return 0;
  }

  private static sortLeaderboard(leaderboard: Leaderboard[]) {
    return leaderboard.sort((a, b) => {
      const points = LeaderboardController.isHigherOrLower(a.totalPoints, b.totalPoints);
      const victories = LeaderboardController.isHigherOrLower(a.totalVictories, b.totalVictories);
      const balance = LeaderboardController.isHigherOrLower(a.goalsBalance, b.goalsBalance);
      const goalsFavor = LeaderboardController.isHigherOrLower(a.goalsFavor, b.goalsFavor);

      if (points) return points;

      if (victories) return victories;

      if (balance) return balance;

      if (goalsFavor) return goalsFavor;

      return 0;
    });
  }

  private static createLeaderboard(matchs: MatchsHistory[]) {
    const unsorted = matchs.map((element) => {
      const clubScores = LeaderboardController.createLeaderboardObject(element);

      clubScores.goalsBalance = clubScores.goalsFavor - clubScores.goalsOwn;
      clubScores.efficiency = Number(((clubScores.totalPoints / (3 * element.matchs.length)) * 100)
        .toFixed(2));

      return clubScores;
    });

    return LeaderboardController.sortLeaderboard(unsorted);
  }

  public static async getAll(req: Request, res: Response) {
    const overallHistory = await LeaderboardService.getClubsOverallHistory();
    const leaderboard = LeaderboardController.createLeaderboard(overallHistory);
    res.status(200).json(leaderboard);
  }

  public static async getAllAway(req: Request, res: Response) {
    const awayHistory = await LeaderboardService.getClubsAwayHistory();
    const leaderboard = LeaderboardController.createLeaderboard(awayHistory);
    res.status(200).json(leaderboard);
  }

  public static async getAllHome(req: Request, res: Response) {
    const homeHistory = await LeaderboardService.getClubsHomeHistory();
    const leaderboard = LeaderboardController.createLeaderboard(homeHistory);
    res.status(200).json(leaderboard);
  }
}
