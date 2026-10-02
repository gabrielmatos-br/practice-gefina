import { Router } from 'express';
import invoices from './invoice.data.ts';

const router = Router();

router.get('/api-learning/invoices', (_request, response) => {
  response.status(200).json(invoices);
});
router.get('/api-learning/invoices/:id', (request, response) => {
  const ID = +request.params.id;

  for (let i = 0; i < invoices.length; i++) {
    if (invoices[i].id === ID) {
      response.status(200).json(invoices[ID]);
      return;
    }
  }
  response
    .status(404)
    .json({ error: { message: 'Fatura não encontrada' } });
});

export default router;
