import { roomService } from './rooms-service';
import { bookingRepository } from '@/repositories';
import { forbiddenRoomError } from '@/errors';

type CreateBookingInput = {
  roomId: number;
  userId: number;
};

async function createBooking(params: CreateBookingInput) {
  const { roomId, userId } = params;
  const room = await roomService.findByIdOrThrow(roomId);
  const peopleCount = await bookingRepository.getCountOfPeopleInRoom(roomId);

  if (peopleCount._count.userId >= room.capacity) throw forbiddenRoomError();

  const createdBooking = await bookingRepository.createBooking(roomId, userId);

  return { bookingId: createdBooking.id };
}

export const bookingService = { createBooking };
