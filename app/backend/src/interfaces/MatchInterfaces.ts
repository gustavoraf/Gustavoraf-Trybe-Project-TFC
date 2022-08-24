export type Indexable = {
  id?: number
};

export type MatchDB = Indexable & {
  homeTeam: number

  homeTeamGoals: number

  awayTeam: number

  awayTeamGoals: number

  inProgress: boolean
};

export type MatchDBdetailed = MatchDB & {
  homeClub: object

  awayClub: object
};

export type MatchScore = {
  homeTeamGoals: number;

  awayTeamGoals: number;
}
