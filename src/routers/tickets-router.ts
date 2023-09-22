import { Router } from 'express';
import { validateBody, authenticateToken } from '@/middlewares';
import { createTicketSchema } from '@/schemas';
import { postTicket, getTicket, getTicketsTypes } from '@/controllers';

const ticketsRouter = Router();

ticketsRouter
  .all('/*', authenticateToken)
  .post('/', validateBody(createTicketSchema), postTicket)
  .get('/', getTicket)
  .get('/types', getTicketsTypes);

export { ticketsRouter };
