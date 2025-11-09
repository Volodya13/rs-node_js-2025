import { CreateUserDto, User } from './users.types';
import { v4 as uuidv4 } from 'uuid';
import { NotFoundError } from '../utils/errors';

class UsersService {
  private users: User[] = [];

  async getAllUsers(): Promise<User[]> {
    return this.users;
  }

  async getUserById(id: string): Promise<User | undefined> {
    return this.users.find((user) => user.id === id);
  }

  async createUser(data: CreateUserDto): Promise<User> {
    const newUser: User = { id: uuidv4(), ...data };

    this.users.push(newUser);

    return newUser;
  }

  async updateUser(id: string, data: CreateUserDto): Promise<User> {
    const index = this.users.findIndex((user) => user.id === id);

    if (index === -1) {
      throw new NotFoundError('User not found');
    }

    const updatedUser: User = { id, ...data };
    this.users[index] = updatedUser;

    return updatedUser;
  }

  async deleteUser(id: string): Promise<void> {
    const index = this.users.findIndex((user) => user.id === id);

    if (index === -1) {
      throw new NotFoundError('User not found');
    }

    this.users.splice(index, 1);
  }
}

export const usersService = new UsersService();
