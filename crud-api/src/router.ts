import { IncomingMessage, ServerResponse } from 'http';

class Router {
  async handle(req: IncomingMessage, res: ServerResponse) {
    const { method, url } = req;

    if (!url || !method) {
      return console.log('Invalid request');
    }

    if (url.startsWith('/api/users')) {
      return console.log(`Handling users route with method: ${method}`);
    }

    return console.log(res, 'Route not found');
  }
}

export const router = new Router();
