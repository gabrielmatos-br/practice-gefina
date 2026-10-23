import path from 'node:path';
import express from 'express';

import dashboard from '../src/modules/dashboard/dashboard.route.ts';
import invoices from '../src/modules/invoice/invoice.route.ts';

import pool from './shared/database.ts';

const app = express();

app.use(express.json());

const port = Number(process.env.port) || 3000;
const dist = path.join(
  import.meta.dirname,
  '..',
  '..',
  'web',
  'dist',
);

app.use((request, _response, next) => {
  console.log(`${request.method} ${request.url}`);
  next();
});

app.get('/api/health', async (_request, response) => {
  try {
    const connect = await pool.query(
      'SELECT datname FROM pg_database WHERE oid = 5;',
    );

    response.status(200).json({
      status: 'Server is running!',
      database: connect.rows[0].datname,
    });
  } catch (error) {
    console.error(error);

    response.status(500).json({
      error: {
        status: 500,
        message: 'Server is running but the database is unavailable.',
      },
    });
  }
});

app.use('/api/dashboard', dashboard);
app.use('/api/invoices', invoices);

app.use(express.static(dist));

app.use((request, response, next) => {
  if (request.url.startsWith('/api')) {
    next();
    return;
  }

  response.sendFile(path.join(dist, 'index.html'));
});

app.use((_request, response) => {
  response.status(404).json({ message: 'Recurso não encontrado.' });
});

app.listen(port);
