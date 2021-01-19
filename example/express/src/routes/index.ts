import { Express } from 'express';
import home from './home';

export default (app: Express) => {
  app.use(home);
};
