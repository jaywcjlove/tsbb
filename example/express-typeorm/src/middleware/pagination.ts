import { Request, Response } from 'express';
import { Repository } from 'typeorm';

export default function pagination<T>(repository: Repository<T>) {
  return (request: Request, response: Response) => {
    const { page = 1, per_page } = request.query;
    const take = typeof per_page === 'string' && Number(per_page) && Number(per_page) < 100 ? Number(per_page) : 20;
    const skip = typeof page === 'string' && Number(page) ? Number(page) - 1 : 0;
    return repository.findAndCount({ skip: skip * take, take }).then(([data, count]) => {
      response.setHeader('x-per-page', take);
      response.setHeader('x-prev-page', skip);
      response.setHeader('x-page', skip + 1);
      response.setHeader('x-next-page', skip + 2);
      response.setHeader('x-total-pages', Math.ceil(count / take));
      response.setHeader('x-total', count);
      return Promise.resolve(data);
    });
  };
}
