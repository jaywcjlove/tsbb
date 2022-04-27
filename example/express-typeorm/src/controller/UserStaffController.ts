import { EntityManager, DataSource } from 'typeorm';
import { NextFunction, Request, Response } from 'express';
import { UserStaff } from '../entity/UserStaff';
import pagination from '../middleware/pagination';
import { appDataSource } from '../app-data-source';

export class UserStaffController {
  private repository = appDataSource.getRepository(UserStaff);
  constructor() {}
  async create(request: Request, response: Response, next: NextFunction) {
    const { body } = request;
    const user = this.repository.create({ ...body });
    return this.repository.save(user);
  }

  async all(request: Request, response: Response) {
    return pagination<UserStaff>(this.repository)(request, response);
  }

  async one(request: Request, response: Response) {
    const { params } = request;
    return this.repository.findOneBy({ id: params.id as unknown as number }).then((user) => {
      if (!user) {
        response.status(404);
        return { message: 'Not found user data' };
      }
      return user;
    });
  }

  async remove(request: Request) {
    return this.repository.softDelete(request.params.id).then(() => {
      return Promise.resolve({ message: '删除成功！' });
    });
  }

  async update(request: Request, response: Response, next: NextFunction) {
    const user = await this.repository.findOneBy({
      id: request.params.id as unknown as number,
    });
    await this.repository.merge(user, request.body);
    const results = await this.repository.save(user);
    return response.send(results);
  }
}
