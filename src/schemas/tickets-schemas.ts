import Joi from 'joi';
import { CreateTicketIncompleteBody } from '@/repositories/tickets-repository';

export const createTicketSchema = Joi.object<Pick<CreateTicketIncompleteBody, 'ticketTypeId'>>({
  ticketTypeId: Joi.number().required(),
});
