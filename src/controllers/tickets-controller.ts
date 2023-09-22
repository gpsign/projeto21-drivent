import { Response } from 'express';
import httpStatus from 'http-status';
import { CreateTicketParams, CreateTicketRequestBody } from '@/repositories/tickets-repository';
import { ticketService, enrollmentsService } from '@/services';
import { AuthenticatedRequest } from '@/middlewares';

export async function postTicket(req: AuthenticatedRequest, res: Response) {
  const { ticketTypeId } = req.body as CreateTicketRequestBody;
  const { userId } = req;

  const enrollment = await enrollmentsService.getEnrollmentIdByUserId(userId);

  const ticket: CreateTicketParams = {
    ticketTypeId: ticketTypeId,
    enrollmentId: enrollment.id,
    updatedAt: new Date(),
  };

  const result = await ticketService.insertTicket(ticket);
  return res.status(httpStatus.CREATED).send(result);
}
