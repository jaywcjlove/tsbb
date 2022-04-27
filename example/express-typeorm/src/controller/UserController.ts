import { EntityManager } from 'typeorm';
import { NextFunction, Request, Response } from 'express';
import crypto from 'crypto';
import { User } from '../entity/User';
import pagination from '../middleware/pagination';
import { appDataSource } from '../app-data-source';

export class UserController {
  private repository = appDataSource.getRepository(User);
  constructor() {}
  async all(request: Request, response: Response) {
    return pagination<User>(this.repository)(request, response);
  }

  async one(request: Request, response: Response, next: NextFunction) {
    const { params } = request;
    return this.repository.findOneBy({ id: params.id as unknown as number }).then((user) => {
      if (!user) {
        response.status(401);
        return { message: 'Not found user data' };
      }
      return user;
    });
  }

  async create(request: Request, response: Response, next: NextFunction) {
    return this.repository
      .save(request.body)
      .then((user) => {
        delete user.password;
        return user;
      })
      .catch((err) => {
        response.status(409);
        return Promise.resolve({ message: '用户已存在，无法创建。' });
      });
  }

  async update(request: Request, response: Response, next: NextFunction) {
    const { id } = request.body;

    const user = await this.repository.findOneBy({
      id: request.body.id as unknown as number,
    });
    await this.repository.merge(user, request.body);
    const results = await this.repository.save(user);
    return response.send(results);
  }

  async remove(request: Request) {
    return this.repository.softDelete(request.params.id).then(() => {
      return Promise.resolve({ message: '删除成功！' });
    });
  }

  async login(req: Request, res: Response) {
    const { username, password } = req.body || {};
    if (!username) {
      res.status(332);
      return Promise.resolve({ code: 1, message: '请输入登录账号' });
    }
    if (!password) {
      res.status(331);
      return Promise.resolve({ code: 2, message: '请输入登录密码' });
    }
    const hashPassword = crypto.createHmac('sha256', password).digest('hex');
    let userInfo = await this.repository.findOne({
      where: { username, password: hashPassword },
      select: ['username', 'id'],
    });

    if (!userInfo) {
      res.status(401);
      return Promise.resolve({ code: 3, message: '用户名或密码错误' });
    }
    if (req.session.token) {
      const { token, userInfo: sessionUserInfo } = req.session;
      return Promise.resolve({ token, ...sessionUserInfo });
    }

    const token = crypto.createHmac('sha256', `${username}`).digest('hex');
    req.session.token = token;
    req.session.userInfo = userInfo;
    req.session.userId = userInfo.id;
    return Promise.resolve({ ...userInfo, token });
  }

  async verify(req: Request, res: Response) {
    if (req.session.token) {
      const { token, userInfo } = req.session;
      return Promise.resolve({ token, ...userInfo });
    }
    res.status(401);
    return Promise.resolve({ code: 401, message: '失效，请重新登录！' });
  }

  async logout(req: Request, res: Response) {
    req.session.destroy((error) => {
      res.status(error ? 500 : 200);
      let data = { message: 'Sign out successfully!' };
      if (error) {
        data = { ...error };
      }
      return Promise.resolve({ ...data });
    });
  }
}
