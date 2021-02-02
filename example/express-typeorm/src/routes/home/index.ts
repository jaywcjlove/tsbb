import express, { Response, Request, NextFunction } from 'express';
import { Router } from 'express-serve-static-core';

let router: Router = express.Router();

router.get('/', (req: Request, res: Response, next: NextFunction) => {
  res.render('index', {
    title: 'Express',
    token: req.session.token,
    username: req.session.userInfo ? req.session.userInfo.username : '',
  });
});

router.get('/logout', (req: Request, res: Response, next: NextFunction) => {
  req.session.token = undefined;
  req.session.userInfo = undefined;
  req.session.userId = undefined;
  res.redirect('/');
});

export default router;
