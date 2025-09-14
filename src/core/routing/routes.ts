import { LoginPage } from '../../pages/login/login-page.component';
import type { RouteTable } from './route.type';

export const routes: RouteTable = {
  '/login': { component: () => new LoginPage() },
};
