import { jest } from '@jest/globals';

jest.unstable_mockModule('../../main', () => ({
  router: { navigateTo: jest.fn() },
}));

let AuthService: typeof import('./auth.service').AuthService;
let authService: InstanceType<typeof import('./auth.service').AuthService>;

beforeAll(async () => {
  ({ AuthService } = await import('./auth.service'));
});

describe('Auth Service SignUp tests', () => {
  beforeEach(() => {
    authService = new AuthService();
  });

  test('Creating an Account with new User', () => {
    const initLength = authService.getUsers().length;
    authService.signUp('Tester', '123456');
    expect(authService.getUsers().length).toBeGreaterThan(initLength);
  });

  test('Creating an Account with taken UserName User', () => {
    const initLength = authService.getUsers().length;
    authService.signUp('Bartosz', '123456');
    expect(authService.getUsers().length).toEqual(initLength);
  });
});

describe('Auth Service Login test', () => {
  beforeEach(() => {
    authService = new AuthService();
  });

  test('Logging in with existing User', () => {
    const result: boolean = authService.login('Bartosz', '123456');

    expect(result).toBeTruthy();
  });

  test('Logging in with existing User but with incorrect password', () => {
    const result: boolean = authService.login('Bartosz', '12345678');

    expect(result).toBeFalsy();
  });

  test('Login writes to localStorage, logout clears & navigates', () => {
    const ok = authService.login('Bartosz', '123456');
    expect(ok).toBe(true);

    expect(localStorage.getItem('username')).toBe('Bartosz');
    expect(localStorage.getItem('userId')).toBeTruthy();

    authService.logout();

    expect(localStorage.getItem('username')).toBeNull();
    expect(localStorage.getItem('userId')).toBeNull();
  });
});
