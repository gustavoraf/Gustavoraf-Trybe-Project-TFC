import * as sinon from 'sinon';
import * as chai from 'chai';
import chaiHttp = require('chai-http');
import * as jwt from 'jsonwebtoken';

import { app } from '../app';
import ClubService from '../services/clubService';

import { Response } from 'superagent';
import { UserDB } from '../interfaces/UserInterfaces';
import { response } from 'express';
import { readFileSync } from 'fs';

chai.use(chaiHttp);

const { expect } = chai;

describe('GET /clubs', () => {
  let chaiHttpResponse: Response;

  before(async () => {
    sinon
      .stub(ClubService, "getAll")
      .resolves([
        {
          "id": 1,
          "clubName": "Avaí/Kindermann"
        },
        {
          "id": 2,
          "clubName": "Bahia"
        },
        {
          "id": 3,
          "clubName": "Botafogo"
        },
      ]);
  sinon
      .stub(ClubService, "getById")
      .resolves({
          "id": 1,
          "clubName": "Avaí/Kindermann"
      });
  });

  after(()=>{
    (ClubService.getById as sinon.SinonStub).restore();
    (ClubService.getAll as sinon.SinonStub).restore();
  })

  describe('Verifica se consegue buscar todos os clubes', () => {
    let response: Response;
    before(async () => {
      response = await chai.request(app).get('/clubs');
    });

    it('espera status 200', () => {
      expect(response).to.have.status(200);
    });

    it('espera uma lista de clubes', () => {
      expect(response.body).to.deep.equal([
        {
          "id": 1,
          "clubName": "Avaí/Kindermann"
        },
        {
          "id": 2,
          "clubName": "Bahia"
        },
        {
          "id": 3,
          "clubName": "Botafogo"
        },
      ]);
    });
  })

  describe('Verifica se consegue buscar um clube com sucesso', () => {
    let response: Response;
    before(async () => {
      response = await chai.request(app).get('/clubs/1');
    });

    it('espera status 200', () => {
      expect(response).to.have.status(200);
    });

    it('espera um clube', () => {
      expect(response.body).to.deep.equal(
        {
          "id": 1,
          "clubName": "Avaí/Kindermann"
        }
      );
    });
  })
});
