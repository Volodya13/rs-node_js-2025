import { CreateUserDto, User } from './users.types';
import { v4 as uuidv4 } from 'uuid';
import { NotFoundError } from '../utils/errors';
import { usersStore } from './users.store';

class UsersService {
  async getAllUsers(): Promise<User[]> {
    return usersStore.getAll();
  }

  async getUserById(id: string): Promise<User | undefined> {
    return usersStore.getById(id);
  }

  async createUser(data: CreateUserDto): Promise<User> {
    const newUser: User = { id: uuidv4(), ...data };
    usersStore.add(newUser);
    return newUser;
  }

  async updateUser(id: string, data: CreateUserDto): Promise<User> {
    const updatedUser: User = { id, ...data };

    const updated = usersStore.update(updatedUser);
    if (!updated) {
      throw new NotFoundError('User not found');
    }

    return updatedUser;
  }

  async deleteUser(id: string): Promise<void> {
    const removed = usersStore.remove(id);

    if (!removed) {
      throw new NotFoundError('User not found');
    }
  }
}

export const usersService = new UsersService();
