import { getRepository } from 'typeorm';
import crypto from 'crypto';
import { NextFunction, Request, Response } from 'express';
import { User } from '../entity/User';

export class UserController {
  private userRepository = getRepository(User);
  async all(request: Request, response: Response, next: NextFunction) {
    return this.userRepository.find();
  }
  async one(request: Request, response: Response, next: NextFunction) {
    return this.userRepository.findOne(request.params.id);
  }
  async save(request: Request, response: Response, next: NextFunction) {
    return this.userRepository.save(request.body);
  }
  async remove(request: Request, response: Response, next: NextFunction) {
    let userToRemove = await this.userRepository.findOne(request.params.id);
    await this.userRepository.remove(userToRemove);
  }
  async login(req: Request, res: Response) {
    const { username, password } = req.body || {};
    if (!username) {
      res.status(401);
      return Promise.resolve({ code: 1, message: '请输入登录账号' });
    }
    if (!password) {
      res.status(401);
      return Promise.resolve({ code: 2, message: '请输入登录密码' });
    }
    const hashPassword = crypto.createHmac('sha256', password).digest('hex');
    let userInfo = await this.userRepository.findOne(
      {
        username,
        password: hashPassword,
      },
      {
        select: ['username'],
      },
    );

    if (!userInfo) {
      res.status(404);
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
      return Promise.resolve({ message: 'Sign out successfully!' });
    } else {
      return Promise.resolve({ message: 'Sign out successfully!' });
    }
  }
}
