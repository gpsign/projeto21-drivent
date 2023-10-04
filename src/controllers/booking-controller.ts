import { Response } from 'express';
import httpStatus from 'http-status';
import { bookingService } from '@/services';
import { CreateBookingParams, UpdateBookingBody } from '@/protocols';
import { AuthenticatedRequest } from '@/middlewares';

export async function postBooking(req: AuthenticatedRequest, res: Response) {
  const roomParam = req.body as CreateBookingParams;
  const { userId } = req;

  const result = await bookingService.createBooking({ ...roomParam, userId });

  return res.status(httpStatus.OK).send(result);
}

export async function getBooking(req: AuthenticatedRequest, res: Response) {
  const { userId } = req;

  const result = await bookingService.getUserBooking(userId);

  return res.status(httpStatus.OK).send(result);
}

export async function putBooking(req: AuthenticatedRequest, res: Response) {
  const { roomId } = req.body as UpdateBookingBody;
  const bookingId = Number(req.params.bookingId);
  const { userId } = req;

  const result = await bookingService.changeBooking({ roomId, bookingId, userId });

  return res.status(httpStatus.OK).send(result);
}
