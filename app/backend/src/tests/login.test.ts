import * as sinon from 'sinon';
import * as chai from 'chai';
import chaiHttp = require('chai-http');
import * as jwt from 'jsonwebtoken'; 

import { app } from '../app';
import LoginService from '../services/LoginService';

import { Response } from 'superagent';
import { UserDB } from '../interfaces/UserInterfaces';
import { response } from 'express';
import { readFileSync } from 'fs';

chai.use(chaiHttp);

const { expect } = chai;

describe('POST /login', () => {
  let chaiHttpResponse: Response;

  before(async () => {
    sinon
      .stub(LoginService, "findByEmailPassword")
      .resolves({
          id: 1,
          username: 'FrangoGostoso',
          role: 'admin',
          email: 'frangoGostoso@gmail.com',
          password: '123456',
        } as UserDB);
  });

  after(()=>{
    (LoginService.findByEmailPassword as sinon.SinonStub).restore();
  })

  describe('Verifica que quando há erros no body', () => {
    let response: Response;
    before(async () => {
      response = await chai.request(app).post('/login').send({});
    });

    it('espera status 401', () => {
      expect(response).to.have.status(401);
    });

    it('espera um objeto com a propriedade "message" com mensagem específica', () => {
      expect(response.body.message).to.equal('All fields must be filled');
    });
  })

  describe('Verifica se o body tiver email invalido', () => {
    let response: Response;
    before(async () => {
      response = await chai.request(app).post('/login').send({
        email: 'admin@admin.com',
        password: 'terere'
      });
    });

    it('espera status 401', () => {
      expect(response).to.have.status(401);
    });

    it('espera um objeto com a propriedade "message" com mensagem específica', () => {
      expect(response.body.message).to.equal('Incorrect email or password');
    });
  })

  describe('Verifica se o body tiver password invalido', () => {
    let response: Response;
    before(async () => {
      response = await chai.request(app).post('/login').send({
        email: 'frangoGostoso@gmail.com',
        password: 'terere'
      });
    });

    it('espera status 401', () => {
      expect(response).to.have.status(401);
    });

    it('espera um objeto com a propriedade "message" com mensagem específica', () => {
      expect(response.body.message).to.equal('Incorrect email or password');
    });
  })

  describe('Verifica se consegue fazer login com sucesso', () => {
    let response: Response;
    before(async () => {
      response = await chai.request(app).post('/login').send({
        email: 'frangoGostoso@gmail.com',
        password: '123456'
      });
    });

    it('espera status 200', () => {
      expect(response).to.have.status(200);
    });

    it('espera como resposta um token', () => {
      const user = {
        id: 1,
        username: 'FrangoGostoso',
        role: 'admin',
        email: 'frangoGostoso@gmail.com',
      };
      const jwtConfig: object = { algorithm: 'HS256' };
      const JWT_SECRET = readFileSync('jwt.evaluation.key', { encoding: 'utf8' }) as string;
      const token = jwt.sign(user, JWT_SECRET, jwtConfig);
      expect(response.body).to.equal(token);
    });
  })

  describe('Verifica se consegue fazer login com sucesso', () => {
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
      response = await chai.request(app).get('/login/validate').set('authorization', token);
    });

    it('espera status 200', () => {
      expect(response).to.have.status(200);
    });

    it('espera como resposta a role do usuário', () => {
      expect(response.body).to.equal('admin');
    });
  })
});
