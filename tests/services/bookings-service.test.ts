import { cleanDb } from '../helpers';
import { createUser } from '../factories';
import { createHotel, createRoomWithHotelId } from '../factories/hotels-factory';
import { bookingRepository } from '@/repositories';
import { init } from '@/app';
import { bookingService } from '@/services';

beforeAll(async () => {
  await init();
});

beforeEach(async () => {
  await cleanDb();
});

describe('createBooking', () => {
  it('should throw ForbiddenError if roomId is invalid', async () => {
    const prom = bookingService.createBooking({ roomId: Number('Not a number'), userId: 1 });

    expect(prom).rejects.toEqual({ name: 'ForbiddenError', message: 'Invalid Room ID' });
  });

  it('should throw ForbiddenError if userId is invalid', async () => {
    const prom = bookingService.createBooking({ roomId: 1, userId: Number('Not a number') });

    expect(prom).rejects.toEqual({ name: 'ForbiddenError', message: 'Invalid User ID' });
  });

  it('should throw ForbiddenError if room capacity is full', async () => {
    jest.spyOn(bookingRepository, 'getRoomCapacityById').mockImplementationOnce(async () => {
      return {
        id: 1,
        capacity: 5,
      };
    });
    jest.spyOn(bookingRepository, 'getCountOfPeopleInRoom').mockImplementationOnce(async () => {
      return {
        _count: {
          userId: 5,
        },
      };
    });
    const prom = bookingService.createBooking({ roomId: 1, userId: 1 });
    expect(prom).rejects.toEqual({ name: 'ForbiddenError', message: 'Room is full' });
  });

  it('should throw NotFoundError if there is no room with given id', async () => {
    jest.spyOn(bookingRepository, 'getRoomCapacityById').mockImplementationOnce(() => {
      return null;
    });
    const prom = bookingService.createBooking({ roomId: 9999, userId: 1 });

    expect(prom).rejects.toEqual({ name: 'NotFoundError', message: 'No result for this search!' });
  });

  it('should create booking', async () => {
    jest.spyOn(bookingRepository, 'getRoomCapacityById').mockImplementationOnce(async () => {
      return {
        id: 1,
        capacity: 5,
      };
    });
    jest.spyOn(bookingRepository, 'getCountOfPeopleInRoom').mockImplementationOnce(async () => {
      return {
        _count: {
          userId: 3,
        },
      };
    });
    const user = await createUser();
    const hotel = await createHotel();
    const room = await createRoomWithHotelId(hotel.id);

    const createdBooking = await bookingService.createBooking({ roomId: room.id, userId: user.id });
    expect(createdBooking).toEqual({ bookingId: expect.any(Number) });
  });
});

describe('getUserBooking', () => {
  it('should throw NotFoundError if user does not have a booking', async () => {
    jest.spyOn(bookingRepository, 'getBookingByUserId').mockImplementationOnce(async () => {
      return null;
    });

    const prom = bookingService.getUserBooking(1);

    expect(prom).rejects.toEqual({ name: 'NotFoundError', message: 'No result for this search!' });
  });

  it('should return booking', async () => {
    jest.spyOn(bookingRepository, 'getBookingByUserId').mockImplementationOnce(async () => {
      return {
        id: 1,
        Room: {
          id: 2,
          name: '1020',
          capacity: 3,
          hotelId: 3,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      };
    });

    const booking = await bookingService.getUserBooking(1);
    expect(booking).toEqual({
      id: 1,
      Room: {
        id: 2,
        name: '1020',
        capacity: 3,
        hotelId: 3,
        createdAt: expect.any(Date),
        updatedAt: expect.any(Date),
      },
    });
  });
});

describe('findRoomCapacityOrThrow', () => {
  it('should throw NotFoundError if room was not found', async () => {
    jest.spyOn(bookingRepository, 'getRoomCapacityById').mockImplementationOnce(async () => {
      return null;
    });

    const prom = bookingService.findRoomCapacityByIdOrThrow(1);

    expect(prom).rejects.toEqual({ name: 'NotFoundError', message: 'No result for this search!' });
  });

  it('should return room id and capacity', async () => {
    jest.spyOn(bookingRepository, 'getRoomCapacityById').mockImplementationOnce(async () => {
      return {
        id: 1,
        capacity: 3,
      };
    });

    const booking = await bookingService.findRoomCapacityByIdOrThrow(1);
    expect(booking).toEqual({
      id: 1,
      capacity: 3,
    });
  });
});