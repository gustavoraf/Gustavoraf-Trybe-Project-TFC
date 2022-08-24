import * as sinon from 'sinon';
import * as chai from 'chai';
import chaiHttp = require('chai-http');
import * as jwt from 'jsonwebtoken';

import { app } from '../app';
import MatchService from '../services/matchService';

import { Response } from 'superagent';
import { UserDB } from '../interfaces/UserInterfaces';
import { response } from 'express';
import { readFileSync } from 'fs';
import { MatchDB, MatchDBdetailed } from '../interfaces/MatchInterfaces';

chai.use(chaiHttp);

const { expect } = chai;

describe('GET /matchs', () => {
  let chaiHttpResponse: Response;

  before(async () => {
    sinon
      .stub(MatchService, "getAll")
      .resolves([
        {
          "id": 1,
          "homeTeam": 16,
          "homeTeamGoals": 1,
          "awayTeam": 8,
          "awayTeamGoals": 1,
          "inProgress": false,
          "homeClub": {
            "clubName": "São Paulo"
          },
          "awayClub": {
            "clubName": "Grêmio"
          }
        },
        {
          "id": 41,
          "homeTeam": 16,
          "homeTeamGoals": 2,
          "awayTeam": 9,
          "awayTeamGoals": 0,
          "inProgress": true,
          "homeClub": {
            "clubName": "São Paulo"
          },
          "awayClub": {
            "clubName": "Internacional"
          }
        }
      ] as MatchDBdetailed[]);
    sinon
      .stub(MatchService, "getByQuery")
      .resolves([
        {
          "id": 41,
          "homeTeam": 16,
          "homeTeamGoals": 2,
          "awayTeam": 9,
          "awayTeamGoals": 0,
          "inProgress": true,
          "homeClub": {
            "clubName": "São Paulo"
          },
          "awayClub": {
            "clubName": "Internacional"
          }
        },
        {
          "id": 42,
          "homeTeam": 6,
          "homeTeamGoals": 1,
          "awayTeam": 1,
          "awayTeamGoals": 0,
          "inProgress": true,
          "homeClub": {
            "clubName": "Ferroviária"
          },
          "awayClub": {
            "clubName": "Avaí/Kindermann"
          }
        }
      ] as MatchDBdetailed[]);
  });

  after(()=>{
    (MatchService.getAll as sinon.SinonStub).restore();
    (MatchService.getByQuery as sinon.SinonStub).restore();
  })

  describe('Verifica se consegue buscar todos as partidas', () => {
    let response: Response;
    before(async () => {
      response = await chai.request(app).get('/matchs');
    });

    it('espera status 200', () => {
      expect(response).to.have.status(200);
    });

    it('espera uma lista de partidas', () => {
      expect(response.body).to.deep.equal([
        {
          "id": 1,
          "homeTeam": 16,
          "homeTeamGoals": 1,
          "awayTeam": 8,
          "awayTeamGoals": 1,
          "inProgress": false,
          "homeClub": {
            "clubName": "São Paulo"
          },
          "awayClub": {
            "clubName": "Grêmio"
          }
        },
        {
          "id": 41,
          "homeTeam": 16,
          "homeTeamGoals": 2,
          "awayTeam": 9,
          "awayTeamGoals": 0,
          "inProgress": true,
          "homeClub": {
            "clubName": "São Paulo"
          },
          "awayClub": {
            "clubName": "Internacional"
          }
        }
      ]);
    });
  })

  describe('Verifica se é possível buscar partida por uma query', () => {
    let response: Response;
    before(async () => {
      response = await chai.request(app).get('/matchs').query({ inProgress: 'true' });
    });

    it('espera status 200', () => {
      expect(response).to.have.status(200);
    });

    it('espera clubes que tem inProgess true', () => {
      expect(response.body).to.deep.equal(
        [
          {
            "id": 41,
            "homeTeam": 16,
            "homeTeamGoals": 2,
            "awayTeam": 9,
            "awayTeamGoals": 0,
            "inProgress": true,
            "homeClub": {
              "clubName": "São Paulo"
            },
            "awayClub": {
              "clubName": "Internacional"
            }
          },
          {
            "id": 42,
            "homeTeam": 6,
            "homeTeamGoals": 1,
            "awayTeam": 1,
            "awayTeamGoals": 0,
            "inProgress": true,
            "homeClub": {
              "clubName": "Ferroviária"
            },
            "awayClub": {
              "clubName": "Avaí/Kindermann"
            }
          }
        ]
      );
    });
  })
});

describe('POST /matchs', () => {
  let chaiHttpResponse: Response;

  before(async () => {
    sinon
      .stub(MatchService, "createInProgress")
      .resolves({
        "id": 1,
        "homeTeam": 16,
        "homeTeamGoals": 2,
        "awayTeam": 8,
        "awayTeamGoals": 2,
        "inProgress": true,
      });
  });

  after(()=>{
    (MatchService.createInProgress as sinon.SinonStub).restore();
  })

  describe('Verifica se consegue criar a partida', () => {
    let response: Response;
    before(async () => {
      const user = {
        id: 1,
        username: 'FrangoGostoso',
        role: 'admin',
        email: 'frangoGostoso@gmail.com',
      };
      const jwtConfig: object = { algorithm: 'HS256' };
      const JWT_SECRET = readFileSync('jwt.evaluation.key', { encoding: 'utf8' }) as string;
      const token = jwt.sign(user, JWT_SECRET, jwtConfig);
      response = await chai.request(app).post('/matchs').set('authorization', token);
    });

    it('espera status 201', () => {
      expect(response).to.have.status(201);
    });

    it('espera uma lista de partidas', () => {
      expect(response.body).to.deep.equal({
        "id": 1,
        "homeTeam": 16,
        "homeTeamGoals": 2,
        "awayTeam": 8,
        "awayTeamGoals": 2,
        "inProgress": true,
      });
    });
  })
});

describe('PATCH /matchs/:id/finish', () => {
  let chaiHttpResponse: Response;

  before(async () => {
    sinon
      .stub(MatchService, "update")
      .resolves();
  });

  after(()=>{
    (MatchService.update as sinon.SinonStub).restore();
  })

  describe('Verifica se consegue editar a partida', () => {
    let response: Response;
    before(async () => {
      const user = {
        id: 1,
        username: 'FrangoGostoso',
        role: 'admin',
        email: 'frangoGostoso@gmail.com',
      };
      const jwtConfig: object = { algorithm: 'HS256' };
      const JWT_SECRET = readFileSync('jwt.evaluation.key', { encoding: 'utf8' }) as string;
      const token = jwt.sign(user, JWT_SECRET, jwtConfig);
      response = await chai.request(app).patch('/matchs/1/finish').set('authorization', token);
    });

    it('espera status 204', () => {
      expect(response).to.have.status(204);
    });
  })
});
