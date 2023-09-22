import { Router } from 'express';
import { validateBody, authenticateToken } from '@/middlewares';
import { createPaymentSchema } from '@/schemas';
import { postPayment } from '@/controllers';

const paymentsRouter = Router();

paymentsRouter.all('/*', authenticateToken).post('/process', validateBody(createPaymentSchema), postPayment);

export { paymentsRouter };
