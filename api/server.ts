import express from 'express';
import invoices from './invoice.route.ts';

const app = express();
const port = 3000;

app.use((request, _response, next) => {
  console.log(`${request.method} ${request.url}`);
  next();
});
app.get('/api-learning/health', (_request, response) => {
  response.status(200).json({ status: 'OK!' });
});
app.use('api-learning/invoices', invoices);
app.use((_request, response) => {
  response.status(404).json({ message: 'Recurso não encontrado.' });
});
app.listen(port);
