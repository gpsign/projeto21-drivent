import { ApplicationError } from '@/protocols';

export function forbiddenRoomError(details?: string): ApplicationError {
  return {
    name: 'ForbiddenError',
    message: details ? details : 'Room is full',
  };
}
