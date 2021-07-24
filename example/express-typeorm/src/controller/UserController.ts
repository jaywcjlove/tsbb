import { getRepository, EntityManager } from 'typeorm';
import { NextFunction, Request, Response } from 'express';
import crypto from 'crypto';
import { User } from '../entity/User';
import pagination from '../middleware/pagination';

export class UserController {
  private userRepository = getRepository(User);
  constructor(private manager: EntityManager) {
    this.manager = manager
  }

  async all(request: Request, response: Response) {
    return pagination<User>(this.userRepository)(request, response);
  }

  async one(request: Request, response: Response, next: NextFunction) {
    const { params } = request;
    return this.userRepository.findOne(params.id).then((user) => {
      if (!user) {
        response.status(401);
        return { message: 'Not found user data' }
      }
      return user
    });
  }

  async create(request: Request, response: Response, next: NextFunction) {
    return this.userRepository.save(request.body).then((user) => {
      delete user.password;
      return user;
    }).catch((err) => {
      response.status(409);
      return Promise.resolve({ message: '用户已存在，无法创建。' });
    });
  }

  async update(request: Request, response: Response, next: NextFunction) {
    const { id } = request.body;
    return this.manager.update(User, id, {...request.body })
      .then(({ affected }) => {
        if (affected === 0) {
          response.status(422);
          return Promise.resolve({ message: '修改失败！' });
        }
        return Promise.resolve({ message: '修改用户信息成功！' });
      }).catch((err) => {
        response.status(400);
        return Promise.resolve({ message: '修改失败！' });
      });
  }

  async remove(request: Request) {
    return this.userRepository.softDelete(request.params.id).then(() => {
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
    let userInfo = await this.userRepository.findOne(
      {
        username,
        password: hashPassword,
      },
      {
        select: ['username', 'id'],
      },
    );

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
    if (req.session) {
      req.session.token = undefined;
      req.session.userInfo = undefined;
      req.session.userId = undefined;
    }
    return Promise.resolve({ message: 'Sign out successfully!' });
  }
}
