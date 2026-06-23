import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import dotenv from 'dotenv';
import { getFallbackRescuePlan } from './src/demoData';

dotenv.config();

const app = express();
const PORT = Number(process.env.PORT || 3000);

app.use(express.json());

app.post('/api/analyze', (req, res) => {
  const { latest_user_message } = req.body || {};

  if (!latest_user_message || typeof latest_user_message !== 'string') {
    return res.status(400).json({ error: 'No tasks provided' });
  }

  try {
    const plan = getFallbackRescuePlan(latest_user_message);
    return res.json({ status: 'ok', plan, fallback: true });
  } catch (error) {
    console.error('Fallback analyzer failed', error);
    return res.status(500).json({ error: 'Fallback analyzer failed' });
  }
});

async function initializeServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`DeadlineOS backend running on http://localhost:${PORT}`);
  });
}

initializeServer().catch((err) => {
  console.error('Failed to start server', err);
});
