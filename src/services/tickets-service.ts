import { enrollmentsService } from './enrollments-service';
import { notFoundError } from '@/errors';
import { CreateTicketIncompleteBody, CreateTicketParams, ticketRepository } from '@/repositories/tickets-repository';

async function insertTicket(t: CreateTicketIncompleteBody) {
  const enrollment = await enrollmentsService.getEnrollmentIdByUserId(t.userId);

  if (!enrollment) throw notFoundError();

  const ticket: CreateTicketParams = {
    ticketTypeId: t.ticketTypeId,
    enrollmentId: enrollment.id,
    updatedAt: new Date(),
  };

  const result = await ticketRepository.createTicket(ticket);
  return result;
}

async function getUserTicket(userId: number) {
  const enrollment = await enrollmentsService.getEnrollmentIdByUserId(userId);

  if (!enrollment) throw notFoundError();

  const result = await ticketRepository.findTicketByEnrollmentId(enrollment.id);
  if (!result) throw notFoundError();
  return result;
}

async function getTicketsTypes() {
  const result = await ticketRepository.findManyTicketTypes();
  if (!result) return [];
  return result;
}

export const ticketService = {
  insertTicket,
  getUserTicket,
  getTicketsTypes,
};
