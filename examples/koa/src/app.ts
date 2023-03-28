import Koa from 'koa';

const PORT = 3000;
const App = new Koa();

App.use((ctx) => {
  ctx.body = 'Hello Koa!';
});

App.listen(PORT);

console.log(`  > Server Listening at Local: http://localhost:${PORT}`);
