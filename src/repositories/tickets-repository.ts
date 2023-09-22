import { Ticket } from '@prisma/client';
import { prisma } from '@/config';

async function createTicket(data: CreateTicketParams) {
  const result = await prisma.ticket.create({
    data,
    include: { TicketType: true },
  });
  return result;
}

export type CreateTicketParams = Omit<Ticket, 'id' | 'createdAt' | 'status'>;
export type CreateTicketRequestBody = Pick<Ticket, 'ticketTypeId'>;

export const ticketRepository = { createTicket };
