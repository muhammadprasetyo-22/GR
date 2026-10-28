import app from '../server';

export default async function handler(req: any, res: any) {
  // Reconstruct req.url on Vercel Serverless if rewritten with __route query param
  if (req.query && req.query.__route) {
    const route = String(req.query.__route).replace(/^\/+/, '');
    const qIndex = req.url.indexOf('?');
    const queryString = qIndex !== -1 ? req.url.substring(qIndex) : '';
    req.url = `/api/${route}${queryString}`;
  } else if (req.url && !req.url.startsWith('/api/') && !req.url.startsWith('/api?')) {
    const clean = req.url.startsWith('/') ? req.url : `/${req.url}`;
    req.url = `/api${clean}`;
  }
  return app(req, res);
}

export { app };
