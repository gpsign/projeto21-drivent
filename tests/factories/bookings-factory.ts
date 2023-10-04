import { createUser } from './users-factory';
import { prisma } from '@/config';

export async function createBooking(roomId: number, userId: number) {
  return await prisma.booking.create({ data: { roomId, userId } });
}

export async function makeRoomFull(roomId: number) {
  const userOne = await createUser();
  const userTwo = await createUser();
  const userThree = await createUser();

  await createBooking(roomId, userOne.id);
  await createBooking(roomId, userTwo.id);
  await createBooking(roomId, userThree.id);
}
