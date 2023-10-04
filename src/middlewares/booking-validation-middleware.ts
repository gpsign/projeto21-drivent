import { NextFunction, Request, Response } from 'express';
import { forbiddenRoomError } from '@/errors';
import { bookingSchema } from '@/schemas';

export function validateBooking(): ValidationMiddleware {
  return (req: Request, res: Response, next: NextFunction) => {
    const { error } = bookingSchema.validate(req.body, {
      abortEarly: false,
    });

    if (!error) {
      next();
    } else {
      let errorMessage = '';
      error.details.forEach((d) => (errorMessage += d.message + ' '));
      throw forbiddenRoomError(errorMessage);
    }
  };
}

type ValidationMiddleware = (req: Request, res: Response, next: NextFunction) => void;
