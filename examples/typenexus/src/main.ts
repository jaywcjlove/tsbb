import { TypeNexus, Action } from 'typenexus';
import { UserController } from './UserController.js';

(async () => {
  const app = new TypeNexus(3002, {
    developmentMode: false,
  });

  app.authorizationChecker = async (action: Action, roles: string[]) => {
    return false;
  };

  app.controllers([UserController]);
  await app.start();
})();
