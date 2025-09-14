import { router } from '../../main';
import { User } from '../../models/user';

export class AuthService {
  private users: User[] = [
    new User('Bartosz', '123456'),
    new User('Sebastian', '123456'),
  ];

  login(username: string, password: string): boolean {
    const foundUser: User | undefined = this.users.find(
      (u) => u.username === username
    );

    if (!foundUser || foundUser.password !== password) return false;

    localStorage.setItem('userId', foundUser.id);
    localStorage.setItem('username', foundUser.username);

    return true;
  }

  signUp(username: string, password: string) {
    const foundUser: User | undefined = this.users.find(
      (u) => u.username === username
    );

    if (foundUser) return false;

    this.users.push(new User(username, password));

    return true;
  }

  getUsers() {
    return [...this.users];
  }

  logout() {
    localStorage.clear();
    router.navigateTo('/login');
  }
}

export const authService = new AuthService();
