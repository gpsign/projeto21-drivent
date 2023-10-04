import Joi from 'joi';
import { BookingIdParam, CreateBookingParams } from '@/protocols';

export const bookingSchema = Joi.object<CreateBookingParams>({ roomId: Joi.number().integer().required().min(1) });
export const bookingParamsSchema = Joi.object<BookingIdParam>({
  bookingId: Joi.number().integer().required().min(1),
});
