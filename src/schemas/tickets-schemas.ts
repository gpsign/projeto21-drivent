import Joi from 'joi';
import { CreateTicketRequestBody } from '@/repositories/tickets-repository';

export const createTicketSchema = Joi.object<CreateTicketRequestBody>({
  ticketTypeId: Joi.number().required(),
});
