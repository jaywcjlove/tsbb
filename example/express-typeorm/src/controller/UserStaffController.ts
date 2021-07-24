import { getRepository, EntityManager } from 'typeorm';
import { NextFunction, Request, Response } from 'express';
import { UserStaff } from '../entity/UserStaff';
import pagination from '../middleware/pagination';

export class UserStaffController {
  private repository = getRepository(UserStaff);
  constructor(private manager: EntityManager) {
    this.manager = manager;
  }

  async create(request: Request, response: Response, next: NextFunction) {
    const { body } = request;
    const user =  this.manager.create(UserStaff, { ...body });
    return this.manager.save(user);
  }

  async all(request: Request, response: Response) {
    return pagination<UserStaff>(this.repository)(request, response);
  }

  async one(request: Request, response: Response) {
    const { params } = request;
    return this.repository.findOne(params.id).then((user) => {
      if (!user) {
        response.status(404);
        return { message: 'Not found user data' }
      }
      return user
    });
  }

  async remove(request: Request) {
    return this.repository.softDelete(request.params.id).then(() => {
      return Promise.resolve({ message: '删除成功！' });
    });
  }

  async update(request: Request, response: Response, next: NextFunction) {
    const { id } = request.params;
    return this.manager.update(UserStaff, id || request.body.id, { ...request.body })
      .then(({ affected }) => {
        if (affected === 0) {
          response.status(422);
          return Promise.resolve({ message: '修改失败！' });
        }
        return Promise.resolve({ message: '修改员工信息成功！' });
      }).catch((err) => {
        response.status(400);
        return Promise.resolve({ message: '修改失败！' });
      });;
  }
}