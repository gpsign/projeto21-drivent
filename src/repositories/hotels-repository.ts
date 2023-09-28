import { prisma } from '@/config';

async function findMany() {
  return prisma.hotel.findMany();
}

async function findById(id: number) {
  return prisma.hotel.findUnique({ where: { id }, include: { Rooms: true } });
}

export const hotelRepository = { findMany, findById };
