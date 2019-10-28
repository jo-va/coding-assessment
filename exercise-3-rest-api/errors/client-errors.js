export class ClientError extends Error {
  constructor(message) {
    super(message);
    this.name = this.constructor.name;
    Error.captureStackTrace(this, this.constructor);
  }

  toHttpResponse() {
    return {};
  }
}

export class RouteNotFoundError extends ClientError {
  toHttpResponse() {
    return {
      statusCode: 404,
      error: 'Not Found',
      message: 'That route does not exist',
    };
  }
}

export class MethodNotAllowedError extends ClientError {
  toHttpResponse() {
    return {
      statusCode: 405,
      error: 'Method Not Allowed',
      message: 'That method is not allowed',
    };
  }
}

export class BadRequestError extends ClientError {
  constructor(resource, id) {
    super(`Invalid ID [${id}] specified for resource [${resource}].`);
    this.data = { id };
  }

  toHttpResponse() {
    return {
      statusCode: 400,
      error: 'Bad Request',
      message: this.message,
      data: this.data,
    };
  }
}
