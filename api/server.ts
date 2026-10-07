import express from 'express';
import path from 'node:path';
import invoices from './invoice.route.ts';

const app = express();
const port = Number(process.env.port) || 3000;

const dist = path.join(import.meta.dirname, '..', 'web', 'dist');

app.use((request, _response, next) => {
  console.log(`${request.method} ${request.url}`);
  next();
});
app.get('/api-learning/health', (_request, response) => {
  response.status(200).json({ status: 'OK!' });
});
app.use('/api-learning/invoices', invoices);
app.use(express.static(dist));
app.use((_request, response) => {
  response.status(404).json({ message: 'Recurso não encontrado.' });
});
app.listen(port);
