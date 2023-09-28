import { Response } from 'express';
import httpStatus from 'http-status';
import { hotelService } from '@/services';
import { AuthenticatedRequest } from '@/middlewares';

export async function getAllHotels(req: AuthenticatedRequest, res: Response) {
  const result = await hotelService.getAll(req.userId);
  return res.status(httpStatus.OK).send(result);
}

export async function getHotelById(req: AuthenticatedRequest, res: Response) {
  const hotelId = Number(req.params.hotelId) as number;
  const result = await hotelService.getHotelById(req.userId, hotelId);

  return res.status(httpStatus.OK).send(result);
}
