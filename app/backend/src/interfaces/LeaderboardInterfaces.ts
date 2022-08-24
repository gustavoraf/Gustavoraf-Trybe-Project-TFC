export interface MatchScore {
  goalsScored: number;
  goalsReceived: number
}

export interface MatchsHistory {
  clubName: string;
  matchs: MatchScore[];
}

export interface Leaderboard {
  name: string;
  totalPoints: number;
  totalGames: number;
  totalVictories: number;
  totalDraws:number;
  totalLosses: number;
  goalsFavor: number;
  goalsOwn: number;
  goalsBalance: number;
  efficiency: number;
}
