import { Express } from 'express';
import { user } from './User';
import { userStaff } from './UserStaff';

export interface RoutesData<T, E, K = keyof T> {
  method: Extract<keyof Express, 'get' | 'post' | 'delete' | 'put' | 'patch'>;
  route: string;
  auth?: boolean;
  controller: E;
  action: K;
}

export const Routes = [...userStaff, ...user];
