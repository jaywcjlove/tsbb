import { TypeNexus, Action } from 'typenexus';
import supertest from 'supertest';
import { UserController } from '../src/UserController';

describe('API request test case', () => {
  const app = new TypeNexus(3002, {
    routePrefix: '/api',
    developmentMode: false,
  });

  app.authorizationChecker = async (action: Action, roles: string[]) => {
    return false;
  }

  app.controllers([UserController]);
  test('GET /api/questions', async () => {
    let result = await supertest.agent(app.app)
      .get('/api/questions')
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(401)
  
    expect(result.body.name).toEqual('AuthorizationRequiredError');
    expect(Object.keys(result.body)).toEqual([ 'name', 'message' ]);
  });
});
