import { LoginPage } from '../../pages/login/login-page.component';
import { SignUpPage } from '../../pages/sign-up/sign-up-page.component';
import type { RouteTable } from './route.type';

export const routes: RouteTable = {
  '/login': { component: () => new LoginPage() },
  '/sign-up': { component: () => new SignUpPage() },
};
