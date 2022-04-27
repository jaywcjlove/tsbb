import { TypeormStore } from '@wcj/connect-typeorm';
import session from 'express-session';
import { Session } from '../entity/Session';
import { appDataSource } from '../app-data-source';

export function createSession() {
  // Create Session
  const repository = appDataSource.getRepository(Session);
  // const store = new TypeormStore({ repository });
  const store = new TypeormStore({
    cleanupLimit: 2,
    // limitSubquery: false, // If using MariaDB.
    ttl: 86400,
  }).connect(repository);
  return session({
    secret: 'secret',
    resave: false,
    saveUninitialized: false,
    store: store,
  });
}
