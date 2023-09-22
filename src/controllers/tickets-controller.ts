import { Response } from 'express';
import httpStatus from 'http-status';
import { CreateTicketIncompleteBody } from '@/repositories/tickets-repository';
import { ticketService } from '@/services';
import { AuthenticatedRequest } from '@/middlewares';

export async function postTicket(req: AuthenticatedRequest, res: Response) {
  const ticket = req.body as CreateTicketIncompleteBody;
  ticket.userId = req.userId;

  const result = await ticketService.insertTicket(ticket);
  return res.status(httpStatus.CREATED).send(result);
}

export async function getTicket(req: AuthenticatedRequest, res: Response) {
  const result = await ticketService.getUserTicket(req.userId);
  return res.status(httpStatus.OK).send(result);
}

export async function getTicketsTypes(req: AuthenticatedRequest, res: Response) {
  const result = await ticketService.getTicketsTypes();
  return res.status(httpStatus.OK).send(result);
}
