import { Router } from 'express';
import { authenticateToken, validateBooking } from '@/middlewares';
import { postBooking } from '@/controllers';

const bookingsRouter = Router();

bookingsRouter.all('/*', authenticateToken).post('/', validateBooking, postBooking);

export { bookingsRouter };
