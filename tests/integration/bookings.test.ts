import supertest from 'supertest';
import httpStatus from 'http-status';
import * as jwt from 'jsonwebtoken';
import { faker } from '@faker-js/faker';
import { cleanDb, generateValidToken } from '../helpers';
import { createUser, createHotel, createRoomWithHotelId, makeRoomFull } from '../factories';
import app, { init } from '@/app';

beforeAll(async () => {
  await init();
});

beforeEach(async () => {
  await cleanDb();
});

const server = supertest(app);

describe('POST /booking', () => {
  const generateValidBody = async function () {
    const hotel = await createHotel();
    const room = await createRoomWithHotelId(hotel.id);
    return {
      roomId: room.id,
    };
  };
  it('should respond with status 401 if no token is given', async () => {
    const response = await server.post('/booking');

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  it('should respond with status 401 if given token is not valid', async () => {
    const token = faker.lorem.word();

    const response = await server.post('/booking').set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  it('should respond with status 401 if there is no session for given token', async () => {
    const userWithoutSession = await createUser();
    const token = jwt.sign({ userId: userWithoutSession.id }, process.env.JWT_SECRET);

    const response = await server.post('/booking').set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  describe('when token is valid', () => {
    it('should respond with status 403 when body is not given', async () => {
      const token = await generateValidToken();
      const response = await server.post('/booking').set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(httpStatus.FORBIDDEN);
    });

    it('should respond with status 403 when body is not valid', async () => {
      const invalidBody = { roomId: Number('Not a number') };
      const token = await generateValidToken();

      const response = await server.post('/booking').send(invalidBody).set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(httpStatus.FORBIDDEN);
    });

    describe('when body is valid', () => {
      it('should respond with status 404 if there is no room for given id', async () => {
        const body = { roomId: 1 };
        const token = await generateValidToken();

        const response = await server.post('/booking').send(body).set('Authorization', `Bearer ${token}`);

        expect(response.status).toBe(httpStatus.NOT_FOUND);
      });

      it('should respond with status 403 if room capacity is full', async () => {
        const body = await generateValidBody();
        const token = await generateValidToken();
        await makeRoomFull(body.roomId);

        const response = await server.post('/booking').send(body).set('Authorization', `Bearer ${token}`);

        expect(response.status).toBe(httpStatus.FORBIDDEN);
      });

      it('should respond with status 201 and with booking id', async () => {
        const body = await generateValidBody();
        const token = await generateValidToken();

        const response = await server.post('/booking').send(body).set('Authorization', `Bearer ${token}`);

        expect(response.status).toBe(httpStatus.CREATED);
        expect(response.body).toEqual({ bookingId: expect.any(Number) });
      });
    });
  });
});
