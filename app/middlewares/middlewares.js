import { send } from '../deps.js';

const errorMiddleware = async(context, next) => {
  try {
    await next();
  } catch (e) {
    console.log(e);
  }
}

const requestTimingMiddleware = async({ request, session }, next) => {
  let id = 'anonymous';

  if (await session.get('authenticated')) {
    id = (await session.get('user')).id;
  }

  const now = new Date();

  const start = Date.now();
  await next();
  const ms = Date.now() - start;

  const date = now.getFullYear() + '-' + (now.getMonth() + 1) + '-' + now.getDate();
  const time = now.getHours() + ":" + now.getMinutes() + ":" + now.getSeconds();
  const dateTime = date + ' ' + time;

  console.log(`${request.method} ${request.url.pathname} - time: ${dateTime} - user: ${id} - ${ms} ms`);
}

const serveStaticFilesMiddleware = async(context, next) => {
  if (context.request.url.pathname.startsWith('/static')) {
    const path = context.request.url.pathname.substring(7);
  
    await send(context, path, {
      root: `${Deno.cwd()}/static`
    });
  
  } else {
    await next();
  }
}

const authMiddleware = async({request, response, session}, next) => {
  if (request.url.pathname.startsWith('/auth') || request.url.pathname === '/') {
    await next();
  } else if (request.url.pathname.startsWith('/api')) {
    await next();
  } else {
    if (!(await session.get('authenticated'))) {
      response.redirect('/auth/login');
    } else {
      await next();
    }
  }
}

export { errorMiddleware, requestTimingMiddleware, serveStaticFilesMiddleware, authMiddleware };