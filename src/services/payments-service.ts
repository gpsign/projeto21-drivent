import { invalidCredentialsError, invalidDataError, notFoundError, unauthorizedError } from '@/errors';
import { CreatePayment, PaymentRequestBody, paymentRepository } from '@/repositories/payments-repository';
import { ticketRepository } from '@/repositories/tickets-repository';
import { enrollmentRepository } from '@/repositories';

async function createPayment(p: PaymentRequestBody & { userId: number }) {
  const ticket = await ticketRepository.findTicketById(p.ticketId);
  if (ticket === null) throw notFoundError();

  const enrollment = await enrollmentRepository.findIdByUserId(p.userId);

  if (ticket.enrollmentId != enrollment.id) throw unauthorizedError();

  const cardDigits = String(p.cardData.number);

  const payment: CreatePayment = {
    ticketId: p.ticketId,
    cardIssuer: p.cardData.issuer,
    cardLastDigits: cardDigits.substring(cardDigits.length - 4, cardDigits.length),
    updatedAt: new Date(),
    value: ticket.TicketType.price,
  };

  await ticketRepository.setTicketPaid(p.ticketId);
  const result = await paymentRepository.insertPayment(payment);
  return result;
}

async function getPayment(p: { ticketId: number; userId: number }) {
  if (p.ticketId === null || isNaN(p.ticketId)) throw invalidDataError('Ticket ID');
  const enrollment = await enrollmentRepository.findIdByUserId(p.userId);
  const payment = await paymentRepository.findPaymentByTicketId(p.ticketId);
  const ticket = await ticketRepository.findTicketById(p.ticketId);
  if (!ticket) throw notFoundError();

  if (!payment) throw unauthorizedError();

  if (ticket.enrollmentId != enrollment.id) throw unauthorizedError();
  return payment;
}

export const paymentService = {
  createPayment,
  getPayment,
};
