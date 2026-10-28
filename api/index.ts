import app from '../server';

export default async function handler(req: any, res: any) {
  try {
    return app(req, res);
  } catch (err: any) {
    console.error('[Vercel Serverless Function Execution Error]', err);
    if (!res.headersSent) {
      return res.status(500).json({
        error: 'Terjadi kesalahan pada server (Serverless Invocation Error): ' + (err?.message || 'Unknown server error')
      });
    }
  }
}

export { app };

