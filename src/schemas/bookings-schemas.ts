import Joi from 'joi';
import { CreateBookingParams } from '@/protocols';

export const bookingSchema = Joi.object<CreateBookingParams>({ roomId: Joi.number().integer().required().min(1) });
