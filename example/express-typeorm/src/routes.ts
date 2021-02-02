import { Express } from 'express';
import { UserController } from './controller/UserController';

export type RoutesData = {
  method: Extract<keyof Express, 'get' | 'post' | 'delete' | 'put' | 'patch'>;
  route: string;
} & {
  controller: typeof UserController;
  action: keyof UserController;
};

export const Routes: RoutesData[] = [
  {
    method: 'post',
    route: '/api/login',
    controller: UserController,
    action: 'login',
  },
  {
    method: 'post',
    route: '/api/logout',
    controller: UserController,
    action: 'logout',
  },
  {
    method: 'get',
    route: '/api/user',
    controller: UserController,
    action: 'all',
  },
  {
    method: 'get',
    route: '/api/user/:id',
    controller: UserController,
    action: 'one',
  },
  {
    method: 'post',
    route: '/api/user',
    controller: UserController,
    action: 'save',
  },
  {
    method: 'delete',
    route: '/api/user/:id',
    controller: UserController,
    action: 'remove',
  },
  {
    method: 'get',
    route: '/api/verify',
    controller: UserController,
    action: 'verify',
  },
];
