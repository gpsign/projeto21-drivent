import { Response } from 'express';
import httpStatus from 'http-status';
import { bookingService } from '@/services';
import { CreateBookingParams } from '@/protocols';
import { AuthenticatedRequest } from '@/middlewares';

export async function postBooking(req: AuthenticatedRequest, res: Response) {
  const roomParam = req.body as CreateBookingParams;
  const { userId } = req;

  const result = await bookingService.createBooking({ ...roomParam, userId });

  return res.status(httpStatus.OK).send(result);
}
