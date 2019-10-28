export class DomainError extends Error {
  constructor(message) {
    super(message);
    this.name = this.constructor.name;
    Error.captureStackTrace(this, this.constructor);
  }

  toHttpResponse() {
    return {};
  }
}

export class ResourceNotFoundError extends DomainError {
  constructor(resource, query) {
    super(`Resource [${resource}] was not found.`);
    this.data = query;
  }

  toHttpResponse() {
    return {
      statusCode: 404,
      error: 'Not Found',
      message: this.message,
      data: this.data,
    };
  }
}

export class InternalError extends DomainError {
  constructor(error) {
    super(error.message);
    this.data = error;
  }

  toHttpResponse() {
    return {
      statusCode: 500,
      error: 'Internal Server Error',
      message: 'An internal server error occurred',
      data: this.data,
    };
  }
}
