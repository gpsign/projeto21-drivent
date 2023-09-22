import { notFoundError } from '@/errors';
import { CreateTicketParams, ticketRepository } from '@/repositories/tickets-repository';

async function insertTicket(t: CreateTicketParams) {
  if (!t.enrollmentId) throw notFoundError();

  const result = await ticketRepository.createTicket(t);
  return result;
}

export const ticketService = {
  insertTicket,
};
