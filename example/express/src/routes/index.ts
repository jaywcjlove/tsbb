import { Express } from 'express';

export default (app: Express) => {
  app.use(require('./home'));
}