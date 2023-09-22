import { Ticket } from '@prisma/client';
import { prisma } from '@/config';

async function createTicket(data: CreateTicketParams) {
  return prisma.ticket.create({
    data,
    include: { TicketType: true },
  });
}

async function findTicketByEnrollmentId(enrollmentId: number) {
  return prisma.ticket.findUnique({ where: { enrollmentId }, include: { TicketType: true } });
}

async function findManyTicketTypes() {
  return prisma.ticketType.findMany();
}

export type CreateTicketParams = Omit<Ticket, 'id' | 'createdAt' | 'status'>;
export type CreateTicketIncompleteBody = {
  ticketTypeId: number;
  userId?: number;
};

export const ticketRepository = { createTicket, findTicketByEnrollmentId, findManyTicketTypes };
