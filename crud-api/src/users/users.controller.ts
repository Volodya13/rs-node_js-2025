import { IncomingMessage, ServerResponse } from 'http';
import { BadRequestError, NotFoundError } from '../utils/errors';
import { usersService } from './users.service';
import { isUuid, parseBody } from '../utils/helpers';

class UsersController {
  async handleRequest(req: IncomingMessage, res: ServerResponse) {
    const { method, url } = req;

    if (!url || !method) throw new BadRequestError('Invalid request');

    const match = url.match(/^\/api\/users\/?([0-9a-fA-F-]+)?$/);

    if (!match) throw new BadRequestError('Invalid users endpoint');

    const userId = match[1];

    switch (method) {
      case 'GET':
        if (userId) {
          await this.getById(res, userId);
        } else {
          await this.getAll(res);
        }
        return;
      case 'POST':
        await this.create(req, res);
        return;
      case 'PUT':
        if (!userId) throw new BadRequestError('User ID is required for update');
        await this.update(req, res, userId);
        return;
      case 'DELETE':
        if (!userId) throw new BadRequestError('User ID is required for delete');
        await this.delete(res, userId);
        return;
      default:
        throw new BadRequestError(`Unsupported method ${method}`);
    }
  }

  private async getAll(res: ServerResponse) {
    const users = await usersService.getAllUsers();

    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(users));
  }

  private async getById(res: ServerResponse, id: string) {
    if (!isUuid(id)) throw new BadRequestError('Invalid user ID');

    const user = await usersService.getUserById(id);

    if (!user) throw new NotFoundError('User not found');

    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(user));
  }

  private async create(req: IncomingMessage, res: ServerResponse) {
    const body = await parseBody(req);

    if (!body || typeof body !== 'object')
      throw new BadRequestError('Invalid body');

    const { username, age, hobbies } = body as Record<string, unknown>;

    if (
      typeof username !== 'string' ||
      typeof age !== 'number' ||
      !Array.isArray(hobbies) ||
      hobbies.some((hobby) => typeof hobby !== 'string')
    )
      throw new BadRequestError('Invalid user data');

    const newUser = await usersService.createUser({ username, age, hobbies });

    res.writeHead(201, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(newUser));
  }

  private async update(req: IncomingMessage, res: ServerResponse, userId: string) {
    const body = await parseBody(req);

    if (!body || typeof body !== 'object') {
      throw new BadRequestError('Invalid request body');
    }

    const { username, age, hobbies } = body as Record<string, unknown>;

    if (
      typeof username !== 'string' ||
      typeof age !== 'number' ||
      !Array.isArray(hobbies) ||
      hobbies.some((hobby) => typeof hobby !== 'string')
    ) {
      throw new BadRequestError('Invalid user data');
    }

    const updatedUser = await usersService.updateUser(userId, { username, age, hobbies });

    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(updatedUser));
  }

  private async delete(res: ServerResponse, userId: string) {
    await usersService.deleteUser(userId);

    res.writeHead(204).end();
  }
}

export const usersController = new UsersController();
