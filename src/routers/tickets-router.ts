import { Router } from 'express';
import { validateBody, authenticateToken } from '@/middlewares';
import { createTicketSchema } from '@/schemas';
import { postTicket } from '@/controllers';

const ticketsRouter = Router();

ticketsRouter.all('/*', authenticateToken).post('/', validateBody(createTicketSchema), postTicket);

export { ticketsRouter };
