import { prisma } from '@/config';

async function getRoomsById(id: number) {
  return prisma.room.findUnique({ where: { id } });
}

export const roomRepository = { getRoomsById };
