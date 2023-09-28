import { enrollmentsService } from './enrollments-service';
import { invalidDataError, notFoundError, paymentRequired } from '@/errors';
import { hotelRepository } from '@/repositories';

async function getAll(userId: number) {
  await validateEnrollmentAndTicket(userId);

  const hotelsList = await hotelRepository.findMany();

  if (hotelsList.length === 0) throw notFoundError();
  return hotelsList;
}

async function getHotelById(userId: number, id: number) {
  if (id < 1 || isNaN(id)) throw invalidDataError('Hotel ID');

  await validateEnrollmentAndTicket(userId);

  const hotel = await hotelRepository.findById(id);
  if (hotel === null) throw notFoundError();
  return hotel;
}

async function validateEnrollmentAndTicket(userId: number) {
  const enrollment = await enrollmentsService.getEnrollmentWithTicketbyUserId(userId);

  const { includesHotel, isRemote } = enrollment.Ticket.TicketType;
  const { status } = enrollment.Ticket;

  if (!includesHotel || isRemote || status === 'RESERVED') throw paymentRequired();
}

export const hotelService = {
  getAll,
  getHotelById,
};
