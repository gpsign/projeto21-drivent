import { Router } from 'express';
import { authenticateToken, validateBody } from '@/middlewares';
import { getBooking, postBooking, putBooking } from '@/controllers';
import { bookingSchema } from '@/schemas';

const bookingsRouter = Router();

bookingsRouter
  .all('/*', authenticateToken)
  .post('/', validateBody(bookingSchema), postBooking)
  .get('/', getBooking)
  .put('/:bookingId', putBooking);

export { bookingsRouter };
