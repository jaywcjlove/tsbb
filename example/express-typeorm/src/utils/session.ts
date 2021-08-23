import { getConnection } from 'typeorm';
import { TypeormStore } from 'typeorm-store';
import session from 'express-session';
import { Session } from '../entity/Session';

export function createSession() {
  // Create Session
  const repository = getConnection().getRepository(Session);
  const store = new TypeormStore({ repository });
  return session({
    secret: 'secret',
    resave: false,
    saveUninitialized: false,
    store: store as any,
    cookie: {
      httpOnly: false, // key
      // maxAge: null,
      // path: '/',
      // secure: false,
      maxAge: 1800000,
    },
  });
}
