import { RoutesData } from './';
import { UserController } from '../controller/UserController';

export const user: RoutesData<UserController, typeof UserController>[] = [
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
    auth: true,
    controller: UserController,
    action: 'all',
  },
  {
    method: 'get',
    route: '/api/user/:id',
    auth: true,
    controller: UserController,
    action: 'one',
  },
  {
    method: 'post',
    route: '/api/user',
    auth: true,
    controller: UserController,
    action: 'create',
  },
  {
    method: 'put',
    route: '/api/user',
    auth: true,
    controller: UserController,
    action: 'update',
  },
  {
    method: 'delete',
    route: '/api/user/:id',
    auth: true,
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
