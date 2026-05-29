import express from 'express';

const app = express();
const port = Number(process.env.PORT) || 4000;

app.use(express.json());

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', uptime: process.uptime() });
});

app.get('/api/message', (_req, res) => {
  res.json({ message: 'Hello from the Node.js server!' });
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
