import { ApplicationError } from '@/protocols';

export function forbiddenError(details: string): ApplicationError {
  return {
    name: 'ForbiddenError',
    message: details,
  };
}
