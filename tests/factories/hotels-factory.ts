import { faker } from '@faker-js/faker';
import { prisma } from '@/config';

export async function createHotel() {
  return prisma.hotel.create({
    data: {
      image: faker.image.imageUrl(),
      name: faker.company.companyName(),
    },
  });
}

export async function createRoom(hotelId: number) {
  return prisma.room.create({
    data: {
      capacity: faker.datatype.number({ min: 1, max: 10 }),
      name: faker.datatype.number({ min: 1, max: 1000 }).toString(),
      hotelId,
    },
  });
}

export async function createHotelWithRooms() {
  const hotel = await createHotel();
  const randomNumber = faker.datatype.number({ min: 0, max: 4 });

  for (let i = 1; i <= randomNumber; i++) {
    await createRoom(hotel.id);
  }

  return hotel;
}
