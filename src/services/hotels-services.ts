import { invalidDataError, notFoundError } from '@/errors';
import { hotelRepository } from '@/repositories';

async function getAll() {
  const hotelsList = await hotelRepository.findMany();
  return hotelsList;
}

async function getHotelById(id: number) {
  if (id < 1 || isNaN(id)) throw invalidDataError('Hotel ID');
  const hotel = await hotelRepository.findById(id);
  if (!hotel) throw notFoundError();
  return hotel;
}

export const hotelService = {
  getAll,
  getHotelById,
};
