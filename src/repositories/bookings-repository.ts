import { prisma } from '@/config';

async function createBooking(roomId: number, userId: number) {
  return prisma.booking.create({ data: { roomId, userId }, select: { id: true } });
}

async function getCountOfPeopleInRoom(roomId: number) {
  return prisma.booking.aggregate({ _count: { userId: true }, where: { roomId } });
}

export const bookingRepository = { createBooking, getCountOfPeopleInRoom };
