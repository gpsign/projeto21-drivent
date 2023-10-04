import { cleanDb } from '../helpers';
import { createUser } from '../factories';
import { createHotel, createRoomWithHotelId } from '../factories/hotels-factory';
import { bookingRepository, enrollmentRepository, ticketsRepository } from '@/repositories';
import { init } from '@/app';
import { bookingService } from '@/services';

beforeAll(async () => {
  await init();
});

beforeEach(async () => {
  await cleanDb();
});

describe('createBooking', () => {
  it('should throw InvalidDataError if roomId is invalid', async () => {
    const prom = bookingService.createBooking({ roomId: Number('Not a number'), userId: 1 });

    expect(prom).rejects.toEqual({ name: 'InvalidDataError', message: 'Invalid data: roomId' });
  });

  it('should throw ForbiddenError if user has no enrollment', async () => {
    jest.spyOn(enrollmentRepository, 'findWithAddressByUserId').mockImplementationOnce(async () => {
      return null;
    });

    const prom = bookingService.createBooking({ roomId: 1, userId: 1 });
    expect(prom).rejects.toEqual({ name: 'ForbiddenError', message: 'User does not have an enrollment' });
  });

  it('should throw ForbiddenError if user has no ticket', async () => {
    jest.spyOn(enrollmentRepository, 'findWithAddressByUserId').mockImplementationOnce(async () => {
      return {
        id: 1,
        cpf: '1234567890',
        birthday: new Date(),
        phone: '1234567890',
        userId: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
        Ticket: null,
        Address: [],
        name: 'abcd',
      };
    });
    jest.spyOn(ticketsRepository, 'findTicketByEnrollmentId').mockImplementationOnce(async () => {
      return null;
    });

    const prom = bookingService.createBooking({ roomId: 1, userId: 1 });
    expect(prom).rejects.toEqual({ name: 'ForbiddenError', message: 'User does not have a ticket' });
  });

  it('should throw ForbiddenError if user has remote ticket', async () => {
    jest.spyOn(enrollmentRepository, 'findWithAddressByUserId').mockImplementationOnce(async () => {
      return {
        id: 1,
        cpf: '1234567890',
        birthday: new Date(),
        phone: '1234567890',
        userId: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
        Ticket: null,
        Address: [],
        name: 'abcd',
      };
    });
    jest.spyOn(ticketsRepository, 'findTicketByEnrollmentId').mockImplementationOnce(async () => {
      return {
        createdAt: new Date(),
        enrollmentId: 1,
        id: 1,
        status: 'PAID',
        ticketTypeId: 1,
        updatedAt: new Date(),
        TicketType: {
          createdAt: new Date(),
          id: 1,
          includesHotel: true,
          isRemote: true,
          name: 'abcd',
          price: 10,
          updatedAt: new Date(),
        },
      };
    });

    const prom = bookingService.createBooking({ roomId: 1, userId: 1 });
    expect(prom).rejects.toEqual({ name: 'ForbiddenError', message: 'User ticket type does not allow booking' });
  });

  it('should throw ForbiddenError if user ticket does not includes hotel', async () => {
    jest.spyOn(enrollmentRepository, 'findWithAddressByUserId').mockImplementationOnce(async () => {
      return {
        id: 1,
        cpf: '1234567890',
        birthday: new Date(),
        phone: '1234567890',
        userId: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
        Ticket: null,
        Address: [],
        name: 'abcd',
      };
    });
    jest.spyOn(ticketsRepository, 'findTicketByEnrollmentId').mockImplementationOnce(async () => {
      return {
        createdAt: new Date(),
        enrollmentId: 1,
        id: 1,
        status: 'PAID',
        ticketTypeId: 1,
        updatedAt: new Date(),
        TicketType: {
          createdAt: new Date(),
          id: 1,
          includesHotel: false,
          isRemote: false,
          name: 'abcd',
          price: 10,
          updatedAt: new Date(),
        },
      };
    });

    const prom = bookingService.createBooking({ roomId: 1, userId: 1 });
    expect(prom).rejects.toEqual({ name: 'ForbiddenError', message: 'User ticket type does not allow booking' });
  });

  it('should throw ForbiddenError if user ticket is not paid', async () => {
    jest.spyOn(enrollmentRepository, 'findWithAddressByUserId').mockImplementationOnce(async () => {
      return {
        id: 1,
        cpf: '1234567890',
        birthday: new Date(),
        phone: '1234567890',
        userId: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
        Ticket: null,
        Address: [],
        name: 'abcd',
      };
    });
    jest.spyOn(ticketsRepository, 'findTicketByEnrollmentId').mockImplementationOnce(async () => {
      return {
        createdAt: new Date(),
        enrollmentId: 1,
        id: 1,
        status: 'RESERVED',
        ticketTypeId: 1,
        updatedAt: new Date(),
        TicketType: {
          createdAt: new Date(),
          id: 1,
          includesHotel: true,
          isRemote: false,
          name: 'abcd',
          price: 10,
          updatedAt: new Date(),
        },
      };
    });

    const prom = bookingService.createBooking({ roomId: 1, userId: 1 });
    expect(prom).rejects.toEqual({ name: 'ForbiddenError', message: 'User ticket type does not allow booking' });
  });

  it('should throw ForbiddenError if room capacity is full', async () => {
    jest.spyOn(enrollmentRepository, 'findWithAddressByUserId').mockImplementationOnce(async () => {
      return {
        id: 1,
        cpf: '1234567890',
        birthday: new Date(),
        phone: '1234567890',
        userId: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
        Ticket: null,
        Address: [],
        name: 'abcd',
      };
    });
    jest.spyOn(ticketsRepository, 'findTicketByEnrollmentId').mockImplementationOnce(async () => {
      return {
        createdAt: new Date(),
        enrollmentId: 1,
        id: 1,
        status: 'PAID',
        ticketTypeId: 1,
        updatedAt: new Date(),
        TicketType: {
          createdAt: new Date(),
          id: 1,
          includesHotel: true,
          isRemote: false,
          name: 'abcd',
          price: 10,
          updatedAt: new Date(),
        },
      };
    });
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
    jest.spyOn(enrollmentRepository, 'findWithAddressByUserId').mockImplementationOnce(async () => {
      return {
        id: 1,
        cpf: '1234567890',
        birthday: new Date(),
        phone: '1234567890',
        userId: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
        Ticket: null,
        Address: [],
        name: 'abcd',
      };
    });
    jest.spyOn(ticketsRepository, 'findTicketByEnrollmentId').mockImplementationOnce(async () => {
      return {
        createdAt: new Date(),
        enrollmentId: 1,
        id: 1,
        status: 'PAID',
        ticketTypeId: 1,
        updatedAt: new Date(),
        TicketType: {
          createdAt: new Date(),
          id: 1,
          includesHotel: true,
          isRemote: false,
          name: 'abcd',
          price: 10,
          updatedAt: new Date(),
        },
      };
    });
    jest.spyOn(bookingRepository, 'getRoomCapacityById').mockImplementationOnce(() => {
      return null;
    });
    const prom = bookingService.createBooking({ roomId: 9999, userId: 1 });

    expect(prom).rejects.toEqual({ name: 'NotFoundError', message: 'No result for this search!' });
  });

  it('should create booking', async () => {
    jest.spyOn(enrollmentRepository, 'findWithAddressByUserId').mockImplementationOnce(async () => {
      return {
        id: 1,
        cpf: '1234567890',
        birthday: new Date(),
        phone: '1234567890',
        userId: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
        Ticket: null,
        Address: [],
        name: 'abcd',
      };
    });
    jest.spyOn(ticketsRepository, 'findTicketByEnrollmentId').mockImplementationOnce(async () => {
      return {
        createdAt: new Date(),
        enrollmentId: 1,
        id: 1,
        status: 'PAID',
        ticketTypeId: 1,
        updatedAt: new Date(),
        TicketType: {
          createdAt: new Date(),
          id: 1,
          includesHotel: true,
          isRemote: false,
          name: 'abcd',
          price: 10,
          updatedAt: new Date(),
        },
      };
    });
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

describe('changeBooking', () => {
  it('should throw InvalidDataError if roomId is invalid', async () => {
    const prom = bookingService.changeBooking({ roomId: Number('Not a number'), bookingId: 1, userId: 1 });

    expect(prom).rejects.toEqual({ name: 'InvalidDataError', message: 'Invalid data: roomId' });
  });

  it('should throw InvalidDataError if bookingId is invalid', async () => {
    const prom = bookingService.changeBooking({ roomId: 1, bookingId: Number('Not a number'), userId: 1 });

    expect(prom).rejects.toEqual({ name: 'InvalidDataError', message: 'Invalid data: bookingId' });
  });

  it('should throw ForbiddenError if booking does not exist', async () => {
    // jest.spyOn(bookingRepository, 'getRoomCapacityById').mockImplementationOnce(async () => {
    //   return {
    //     id: 1,
    //     capacity: 5,
    //   };
    // });
    // jest.spyOn(bookingRepository, 'getCountOfPeopleInRoom').mockImplementationOnce(async () => {
    //   return {
    //     _count: {
    //       userId: 1,
    //     },
    //   };
    // });
    // jest.spyOn(bookingRepository, 'updateBooking').mockImplementationOnce(async () => {
    //   return null;
    // });
    jest.spyOn(bookingRepository, 'getBookingById').mockImplementationOnce(async () => {
      return null;
    });

    const prom = bookingService.changeBooking({ roomId: 1, bookingId: 1, userId: 1 });
    expect(prom).rejects.toEqual({ name: 'ForbiddenError', message: 'No booking' });
  });

  it('should throw ForbiddenError if booking does not belong to user', async () => {
    jest.spyOn(bookingRepository, 'getBookingById').mockImplementationOnce(async () => {
      return { id: 1, roomId: 1, userId: 2, createdAt: new Date(), updatedAt: new Date() };
    });
    const prom = bookingService.changeBooking({ roomId: 1, bookingId: 1, userId: 1 });

    expect(prom).rejects.toEqual({ name: 'ForbiddenError', message: "Not user's booking" });
  });

  it('should throw ForbiddenError if room capacity is full', async () => {
    jest.spyOn(bookingRepository, 'getBookingById').mockImplementationOnce(async () => {
      return { id: 1, roomId: 1, userId: 1, createdAt: new Date(), updatedAt: new Date() };
    });
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
    const prom = bookingService.changeBooking({ roomId: 1, bookingId: 1, userId: 1 });
    expect(prom).rejects.toEqual({ name: 'ForbiddenError', message: 'Room is full' });
  });

  it('should throw NotFoundError if there is no room with given id', async () => {
    jest.spyOn(bookingRepository, 'getBookingById').mockImplementationOnce(async () => {
      return { id: 1, roomId: 1, userId: 1, createdAt: new Date(), updatedAt: new Date() };
    });
    jest.spyOn(bookingRepository, 'getRoomCapacityById').mockImplementationOnce(() => {
      return null;
    });
    const prom = bookingService.changeBooking({ roomId: 9999, bookingId: 1, userId: 1 });

    expect(prom).rejects.toEqual({ name: 'NotFoundError', message: 'No result for this search!' });
  });

  it('should return updated booking id', async () => {
    jest.spyOn(bookingRepository, 'getBookingById').mockImplementationOnce(async () => {
      return { id: 1, roomId: 1, userId: 1, createdAt: new Date(), updatedAt: new Date() };
    });
    jest.spyOn(bookingRepository, 'getRoomCapacityById').mockImplementationOnce(async () => {
      return {
        id: 1,
        capacity: 5,
      };
    });
    jest.spyOn(bookingRepository, 'getCountOfPeopleInRoom').mockImplementationOnce(async () => {
      return {
        _count: {
          userId: 1,
        },
      };
    });
    jest.spyOn(bookingRepository, 'updateBooking').mockImplementationOnce(async () => {
      return {
        id: 1,
      };
    });

    const result = await bookingService.changeBooking({ roomId: 1, bookingId: 1, userId: 1 });
    expect(result).toEqual({ bookingId: 1 });
  });
});

describe('validateUserBooking', () => {
  it('should throw ForbiddenError if user has no enrollment', async () => {
    jest.spyOn(enrollmentRepository, 'findWithAddressByUserId').mockImplementationOnce(async () => {
      return null;
    });

    const prom = bookingService.validateUserBooking(1);
    expect(prom).rejects.toEqual({ name: 'ForbiddenError', message: 'User does not have an enrollment' });
  });

  it('should throw ForbiddenError if user has no ticket', async () => {
    jest.spyOn(enrollmentRepository, 'findWithAddressByUserId').mockImplementationOnce(async () => {
      return {
        id: 1,
        cpf: '1234567890',
        birthday: new Date(),
        phone: '1234567890',
        userId: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
        Ticket: null,
        Address: [],
        name: 'abcd',
      };
    });
    jest.spyOn(ticketsRepository, 'findTicketByEnrollmentId').mockImplementationOnce(async () => {
      return null;
    });

    const prom = bookingService.validateUserBooking(1);
    expect(prom).rejects.toEqual({ name: 'ForbiddenError', message: 'User does not have a ticket' });
  });

  it('should throw ForbiddenError if user has remote ticket', async () => {
    jest.spyOn(enrollmentRepository, 'findWithAddressByUserId').mockImplementationOnce(async () => {
      return {
        id: 1,
        cpf: '1234567890',
        birthday: new Date(),
        phone: '1234567890',
        userId: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
        Ticket: null,
        Address: [],
        name: 'abcd',
      };
    });
    jest.spyOn(ticketsRepository, 'findTicketByEnrollmentId').mockImplementationOnce(async () => {
      return {
        createdAt: new Date(),
        enrollmentId: 1,
        id: 1,
        status: 'PAID',
        ticketTypeId: 1,
        updatedAt: new Date(),
        TicketType: {
          createdAt: new Date(),
          id: 1,
          includesHotel: true,
          isRemote: true,
          name: 'abcd',
          price: 10,
          updatedAt: new Date(),
        },
      };
    });

    const prom = bookingService.validateUserBooking(1);
    expect(prom).rejects.toEqual({ name: 'ForbiddenError', message: 'User ticket type does not allow booking' });
  });

  it('should throw ForbiddenError if user ticket does not includes hotel', async () => {
    jest.spyOn(enrollmentRepository, 'findWithAddressByUserId').mockImplementationOnce(async () => {
      return {
        id: 1,
        cpf: '1234567890',
        birthday: new Date(),
        phone: '1234567890',
        userId: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
        Ticket: null,
        Address: [],
        name: 'abcd',
      };
    });
    jest.spyOn(ticketsRepository, 'findTicketByEnrollmentId').mockImplementationOnce(async () => {
      return {
        createdAt: new Date(),
        enrollmentId: 1,
        id: 1,
        status: 'PAID',
        ticketTypeId: 1,
        updatedAt: new Date(),
        TicketType: {
          createdAt: new Date(),
          id: 1,
          includesHotel: false,
          isRemote: false,
          name: 'abcd',
          price: 10,
          updatedAt: new Date(),
        },
      };
    });

    const prom = bookingService.validateUserBooking(1);
    expect(prom).rejects.toEqual({ name: 'ForbiddenError', message: 'User ticket type does not allow booking' });
  });

  it('should throw ForbiddenError if user ticket is not paid', async () => {
    jest.spyOn(enrollmentRepository, 'findWithAddressByUserId').mockImplementationOnce(async () => {
      return {
        id: 1,
        cpf: '1234567890',
        birthday: new Date(),
        phone: '1234567890',
        userId: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
        Ticket: null,
        Address: [],
        name: 'abcd',
      };
    });
    jest.spyOn(ticketsRepository, 'findTicketByEnrollmentId').mockImplementationOnce(async () => {
      return {
        createdAt: new Date(),
        enrollmentId: 1,
        id: 1,
        status: 'RESERVED',
        ticketTypeId: 1,
        updatedAt: new Date(),
        TicketType: {
          createdAt: new Date(),
          id: 1,
          includesHotel: true,
          isRemote: false,
          name: 'abcd',
          price: 10,
          updatedAt: new Date(),
        },
      };
    });

    const prom = bookingService.validateUserBooking(1);
    expect(prom).rejects.toEqual({ name: 'ForbiddenError', message: 'User ticket type does not allow booking' });
  });
});
