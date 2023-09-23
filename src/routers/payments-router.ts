import { Router } from 'express';
import { validateBody, authenticateToken } from '@/middlewares';
import { createPaymentSchema } from '@/schemas';
import { getPayment, postPayment } from '@/controllers';

const paymentsRouter = Router();

paymentsRouter
  .all('/*', authenticateToken)
  .post('/process', validateBody(createPaymentSchema), postPayment)
  .get('/', getPayment);

export { paymentsRouter };
