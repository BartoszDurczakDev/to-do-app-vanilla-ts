import { mount, unmount } from '../component-life-cycles';
import type { RouteGuard } from './route.guard';
import type { RouteTable } from './route.type';

export class Router {
  private currentPath = location.pathname || '/';

  constructor(
    private outlet: HTMLElement,
    private routes: RouteTable,
    private guard?: RouteGuard
  ) {
    window.addEventListener('popstate', () => this.navigate());
    this.navigate();
  }

  public navigateTo(path: string, replace = false) {
    if (replace) history.replaceState({}, '', path);
    else history.pushState({}, '', path);
    this.navigate();
  }

  private navigate() {
    const to = location.pathname || '/';
    const from = this.currentPath;

    const targetRoute = this.routes[to];
    const authed = !!localStorage.getItem('userId');

    if (targetRoute?.auth && !authed && to !== '/login')
      return this.navigateTo('/login', true);

    if (to === '/login' && authed) return this.navigateTo('/', true);

    if (this.guard) {
      const redirect = this.guard(to, from);
      if (typeof redirect === 'string' && redirect !== to)
        return this.navigateTo(redirect, true);
    }

    if (!targetRoute) {
      unmount(this.outlet);
      this.outlet.textContent = '404';
      this.currentPath = to;
      return;
    }

    mount(this.outlet, targetRoute.component());
    this.currentPath = to;
  }
}
