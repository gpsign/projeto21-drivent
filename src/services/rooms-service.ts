import { notFoundError } from '@/errors';
import { roomRepository } from '@/repositories';

async function findByIdOrThrow(id: number) {
  const room = await roomRepository.getRoomsById(id);
  if (!room) throw notFoundError();
  return room;
}

export const roomService = { findByIdOrThrow };
