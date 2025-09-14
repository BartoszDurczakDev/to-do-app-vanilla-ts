import { DetailPage } from '../../pages/detail/detail-page.component';
import { LoginPage } from '../../pages/login/login-page.component';
import { SignUpPage } from '../../pages/sign-up/sign-up-page.component';
import type { RouteTable } from './route.type';

export const routes: RouteTable = {
  '/': { component: () => new DetailPage(), auth: true },
  '/login': { component: () => new LoginPage() },
  '/sign-up': { component: () => new SignUpPage() },
};
