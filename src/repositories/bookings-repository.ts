import { prisma } from '@/config';

async function createBooking(roomId: number, userId: number) {
  return prisma.booking.create({ data: { roomId, userId }, select: { id: true } });
}

async function getBookingById(id: number) {
  return prisma.booking.findUnique({ where: { id } });
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

async function updateBooking(id: number, roomId: number) {
  return prisma.booking.update({ data: { roomId }, where: { id }, select: { id: true } });
}

export const bookingRepository = {
  createBooking,
  getBookingById,
  getBookingByUserId,
  getCountOfPeopleInRoom,
  getRoomCapacityById,
  updateBooking,
};
