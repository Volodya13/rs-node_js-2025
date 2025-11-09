import { ServerResponse } from 'http';

export class HttpError extends Error {
  constructor(
    public statusCode: number,
    message: string,
  ) {
    super(message);
  }
}

export class BadRequestError extends HttpError {
  constructor(message: string) {
    super(400, message);
  }
}

export class NotFoundError extends HttpError {
  constructor(message: string) {
    super(404, message);
  }
}

export const handleError = (response: ServerResponse, error: unknown) => {
  if (error instanceof HttpError) {
    response.writeHead(error.statusCode, {
      'Content-Type': 'application/json',
    });
    response.end(JSON.stringify({ error: error.message }));
  }

  response.writeHead(500, { 'Content-Type': 'application/json' });
  response.end(JSON.stringify({ error: 'Internal Server Error' }));
};

export const handleNotFound = (response: ServerResponse, message: string) => {
  response.writeHead(404, { 'Content-Type': 'application/json' });
  response.end(JSON.stringify({ error: message }));
};
