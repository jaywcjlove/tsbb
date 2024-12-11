import path from 'path';
import compression from 'compression'; // compresses requests
import createError from 'http-errors';
import cookieParser from 'cookie-parser';
import express from 'express';
import type { Express, Response, Request, NextFunction } from 'express';
import routes from './routes';

const app: Express = express();

app.disable('x-powered-by');
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
// @ts-ignore
app.use(compression());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
// @ts-ignore
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public'), { maxAge: 31557600000 }));

// app.get('/', (req: Request, res: Response) => {
//   res.send('Hello World');
// });
routes(app);

// catch 404 and forward to error handler
app.use((req: Request, res: Response, next: NextFunction) => {
  next(createError(404));
});

// error handler
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

app.listen(app.get('port'), () => {
  console.log('\n  App is running at\x1b[32;1m http://localhost:%d\x1b[0m in %s mode', app.get('port'), app.get('env'));
  console.log('  Press\x1b[33;1m CTRL-C\x1b[0m to stop\n');
});

/**
 * Event listener for HTTP server "error" event.
 */
app.on('error', (error: any) => {
  if (error.syscall !== 'listen') {
    throw error;
  }
  const bind = typeof app.get('port') === 'string' ? 'Pipe ' + app.get('port') : 'Port ' + app.get('port');
  // handle specific listen errors with friendly messages
  switch (error.code) {
    case 'EACCES':
      console.error(`${bind} requires elevated privileges`);
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error(`${bind} is already in use`);
      process.exit(1);
      break;
    default:
      throw error;
  }
});
