import { RoutesData } from './';
import { UserStaffController } from '../controller/UserStaffController';

export const userStaff: RoutesData<UserStaffController, typeof UserStaffController>[] = [
  {
    method: 'post',
    route: '/api/user/staff',
    auth: true,
    controller: UserStaffController,
    action: 'create',
  },
  {
    method: 'put',
    route: '/api/user/staff',
    auth: true,
    controller: UserStaffController,
    action: 'update',
  },
  {
    method: 'get',
    route: '/api/user/staff',
    auth: true,
    controller: UserStaffController,
    action: 'all',
  },
  {
    method: 'get',
    route: '/api/user/staff/:id',
    auth: true,
    controller: UserStaffController,
    action: 'one',
  },
  {
    method: 'delete',
    route: '/api/user/staff/:id',
    auth: true,
    controller: UserStaffController,
    action: 'remove',
  },
];
