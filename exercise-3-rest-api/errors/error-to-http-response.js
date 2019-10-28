import { ClientError } from './client-errors';
import { DomainError } from './domain-errors';
import Logger from '../loaders/logger';

export function mapErrorToHttpResponse(error) {
  if (error instanceof DomainError || error instanceof ClientError) {
    return error.toHttpResponse();
  }
  return {
    statusCode: 500,
    error: 'Internal Server Error',
    message: 'An internal server error occurred',
  };
}

export function sendHttpErrorResponse(res, error) {
  const httpError = mapErrorToHttpResponse(error);
  Logger.error(error);
  return res.status(httpError.statusCode).json(httpError);
}
