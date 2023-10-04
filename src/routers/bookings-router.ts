import { Router } from 'express';
import { authenticateToken, validateBody, validateParams } from '@/middlewares';
import { getBooking, postBooking, putBooking } from '@/controllers';
import { bookingParamsSchema, bookingSchema } from '@/schemas';

const bookingsRouter = Router();

bookingsRouter
  .all('/*', authenticateToken)
  .post('/', validateBody(bookingSchema), postBooking)
  .get('/', getBooking)
  .put('/:bookingId', validateBody(bookingSchema), validateParams(bookingParamsSchema), putBooking);

export { bookingsRouter };
