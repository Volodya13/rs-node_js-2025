import { createServer, IncomingMessage, ServerResponse } from 'http';
import { router } from './router';
import { handleError } from './utils/errors';
import { usersStore } from './users/users.store';

export const requestListener = async (
  req: IncomingMessage,
  res: ServerResponse,
) => {
  try {
    await router.handle(req, res);
  } catch (error) {
    handleError(res, error);
  }
};

export const appServer = () => {
  const server = createServer(requestListener);
  usersStore.initialize([]);
  return server;
};
