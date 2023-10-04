import { TicketStatus } from '@prisma/client';
import { bookingRepository, enrollmentRepository, ticketsRepository } from '@/repositories';
import { forbiddenError, invalidDataError, notFoundError } from '@/errors';

type CreateBookingInput = {
  roomId: number;
  userId: number;
};

type UpdateBooking = {
  bookingId: number;
  roomId: number;
  userId: number;
};

async function validateUserBooking(userId: number) {
  const enrollment = await enrollmentRepository.findWithAddressByUserId(userId);
  if (!enrollment) throw forbiddenError('User does not have an enrollment');

  const ticket = await ticketsRepository.findTicketByEnrollmentId(enrollment.id);
  if (!ticket) throw forbiddenError('User does not have a ticket');

  const type = ticket.TicketType;

  if (ticket.status === TicketStatus.RESERVED || type.isRemote || !type.includesHotel) {
    throw forbiddenError('User ticket type does not allow booking');
  }
}

async function createBooking(params: CreateBookingInput) {
  const { roomId, userId } = params;

  if (isNaN(roomId) || roomId < 1) throw invalidDataError('roomId');

  await validateUserBooking(userId);

  const room = await findRoomCapacityByIdOrThrow(roomId);
  const countResponse = await bookingRepository.getCountOfPeopleInRoom(roomId);
  const peopleCount = countResponse._count.userId;
  if (peopleCount >= room.capacity) throw forbiddenError('Room is full');

  const createdBooking = await bookingRepository.createBooking(roomId, userId);

  return { bookingId: createdBooking.id };
}

async function getUserBooking(userId: number) {
  const booking = await bookingRepository.getBookingByUserId(userId);
  if (!booking) throw notFoundError();
  return booking;
}

async function findRoomCapacityByIdOrThrow(id: number) {
  const room = await bookingRepository.getRoomCapacityById(id);
  if (!room) throw notFoundError();
  return room;
}

async function changeBooking(params: UpdateBooking) {
  const { bookingId, roomId, userId } = params;

  if (isNaN(roomId) || roomId < 1) throw invalidDataError('roomId');
  if (isNaN(bookingId) || bookingId < 1) throw invalidDataError('bookingId');

  const booking = await bookingRepository.getBookingById(bookingId);
  if (!booking) throw forbiddenError('No booking');
  if (booking.userId != userId) throw forbiddenError("Not user's booking");

  const room = await bookingService.findRoomCapacityByIdOrThrow(roomId);
  const countResponse = await bookingRepository.getCountOfPeopleInRoom(roomId);
  const peopleCount = countResponse._count.userId;
  if (peopleCount >= room.capacity) throw forbiddenError('Room is full');

  const updatedBooking = await bookingRepository.updateBooking(bookingId, roomId);
  return {
    bookingId: updatedBooking.id,
  };
}

export const bookingService = {
  createBooking,
  getUserBooking,
  findRoomCapacityByIdOrThrow,
  changeBooking,
  validateUserBooking,
};
