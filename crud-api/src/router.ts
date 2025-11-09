import { IncomingMessage, ServerResponse } from 'http';
import { usersController } from './users/users.controller';
import { handleNotFound } from './utils/errors';

class Router {
  async handle(req: IncomingMessage, res: ServerResponse) {
    const { method, url } = req;

    if (!url || !method) {
      handleNotFound(res, 'Invalid request');
      return;
    }

    if (url.startsWith('/api/users')) {
      await usersController.handleRequest(req, res);
      return;
    }

    handleNotFound(res, 'Endpoint not found');
  }
}

export const router = new Router();
