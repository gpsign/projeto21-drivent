import { bookingRepository } from '@/repositories';
import { forbiddenRoomError, notFoundError } from '@/errors';

type CreateBookingInput = {
  roomId: number;
  userId: number;
};

async function createBooking(params: CreateBookingInput) {
  const { roomId, userId } = params;
  const room = await findRoomByIdOrThrow(roomId);
  const peopleCount = await bookingRepository.getCountOfPeopleInRoom(roomId);

  if (peopleCount._count.userId >= room.capacity) throw forbiddenRoomError();

  const createdBooking = await bookingRepository.createBooking(roomId, userId);

  return { bookingId: createdBooking.id };
}

async function findRoomByIdOrThrow(id: number) {
  const room = await bookingRepository.getRoomById(id);
  if (!room) throw notFoundError();
  return room;
}

export const bookingService = { createBooking, findRoomByIdOrThrow };
