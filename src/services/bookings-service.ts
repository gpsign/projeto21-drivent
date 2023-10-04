import { bookingRepository } from '@/repositories';
import { forbiddenError, notFoundError } from '@/errors';

type CreateBookingInput = {
  roomId: number;
  userId: number;
};

async function createBooking(params: CreateBookingInput) {
  const { roomId, userId } = params;

  if (isNaN(roomId) || roomId < 1) throw forbiddenError('Invalid Room ID');
  if (isNaN(userId) || userId < 1) throw forbiddenError('Invalid User ID');

  const room = await findRoomCapacityByIdOrThrow(roomId);
  const peopleCount = await bookingRepository.getCountOfPeopleInRoom(roomId);

  if (peopleCount._count.userId >= room.capacity) throw forbiddenError('Room is full');

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

export const bookingService = { createBooking, getUserBooking, findRoomCapacityByIdOrThrow };
