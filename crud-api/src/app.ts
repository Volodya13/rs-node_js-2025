import { createServer, IncomingMessage, ServerResponse } from 'http';
import { router } from './router';

export const requestListener = async (
  req: IncomingMessage,
  res: ServerResponse,
) => {
  try {
    await router.handle(req, res);
  } catch (error) {
    console.error('Error handling request:', error);
  }
};

export const appServer = () => createServer(requestListener);
