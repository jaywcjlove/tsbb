import { NextFunction, Request, Response } from 'express';

export default function basicAuth(auth: boolean) {
  return (request: Request, response: Response, next: NextFunction) => {
    if (auth) {
      const token = request.query.token || request.body.token || (request.headers.authorization || '').replace(/^token\s/, '');
      if (!token || !request.session || !request.session.token || request.session.token !== token) {
        response.status(401);
        return response.json({ code: 401, message: '失效，请重新登录！' });
      }
    }
    next();
  }
}