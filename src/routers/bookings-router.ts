import { Router } from 'express';
import { authenticateToken } from '@/middlewares';
import { getBooking, postBooking } from '@/controllers';

const bookingsRouter = Router();

bookingsRouter.all('/*', authenticateToken).post('/', postBooking).get('/', getBooking);

export { bookingsRouter };
