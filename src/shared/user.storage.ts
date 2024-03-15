import { AsyncLocalStorage } from 'async_hooks';
import { User } from 'src/users/entities/user.entity';

export const UserStorage = {
  storage: new AsyncLocalStorage<User>(),
  get() {
    return this.storage.getStore();
  },
  set(user: User) {
    return this.storage.enterWith(user);
  },
};
