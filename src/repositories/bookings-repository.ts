import { prisma } from '@/config';

async function createBooking(roomId: number, userId: number) {
  return prisma.booking.create({ data: { roomId, userId }, select: { id: true } });
}

async function getBookingByUserId(userId: number) {
  return prisma.booking.findUnique({ where: { userId }, select: { id: true, Room: true } });
}

async function getCountOfPeopleInRoom(roomId: number) {
  return prisma.booking.aggregate({ _count: { userId: true }, where: { roomId } });
}

async function getRoomCapacityById(id: number) {
  return prisma.room.findUnique({ where: { id }, select: { id: true, capacity: true } });
}

export const bookingRepository = { createBooking, getBookingByUserId, getCountOfPeopleInRoom, getRoomCapacityById };
