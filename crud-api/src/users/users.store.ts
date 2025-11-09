import { EventEmitter } from 'events';
import { User } from './users.types';

class UsersStore extends EventEmitter {
  private users: User[] = [];

  initialize(initialUsers?: User[], emitChange = false) {
    this.users = initialUsers ? [...initialUsers] : [];

    if (emitChange) {
      this.emitChange();
    }
  }

  getAll(): User[] {
    return [...this.users];
  }

  getById(id: string): User | undefined {
    return this.users.find((user) => user.id === id);
  }

  add(user: User) {
    this.users.push(user);
    this.emitChange();
  }

  update(user: User) {
    const index = this.users.findIndex((existing) => existing.id === user.id);

    if (index === -1) {
      return false;
    }

    this.users[index] = user;
    this.emitChange();
    return true;
  }

  remove(id: string) {
    const index = this.users.findIndex((user) => user.id === id);

    if (index === -1) {
      return false;
    }

    this.users.splice(index, 1);
    this.emitChange();
    return true;
  }

  onChange(listener: (state: User[]) => void) {
    this.on('change', listener);
    return () => this.off('change', listener);
  }

  private emitChange() {
    this.emit('change', this.getAll());
  }
}

export const usersStore = new UsersStore();

