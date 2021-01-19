import express, { Response, Request, NextFunction } from 'express';
import { IRoute, Router } from 'express-serve-static-core';

let router: Router = express.Router();

router.get('/', (req: Request, res: Response, next: NextFunction) => {
  res.render('index', { title: 'Express' });
});

export default router;
