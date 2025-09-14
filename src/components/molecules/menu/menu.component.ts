import type { IComponent } from '../../../core/interfaces/component.interface';
import { router } from '../../../main';
import { authService } from '../../../services/auth/auth.service';
import './menu.css';

export class Menu implements IComponent {
  private logoutBtn?: HTMLElement;
  private brandEl?: HTMLAnchorElement;

  private onLogoutClicked!: EventListener;
  private onBrandClicked!: EventListener;

  private handleLogoutClicked() {
    authService.logout();
  }
  private handleBrandClicked = (e: Event) => {
    e.preventDefault();
    router.navigateTo('/');
  };

  afterMount(root: HTMLElement) {
    this.logoutBtn =
      root.querySelector<HTMLElement>('#logout-btn') ?? undefined;
    this.brandEl = root.querySelector<HTMLAnchorElement>('.brand') ?? undefined;

    this.onLogoutClicked = this.handleLogoutClicked.bind(this);
    this.onBrandClicked = this.handleBrandClicked.bind(this);

    this.logoutBtn?.addEventListener('click', this.onLogoutClicked);
    this.brandEl?.addEventListener('click', this.onBrandClicked);
  }

  beforeUnmount() {
    this.logoutBtn?.removeEventListener('click', this.onLogoutClicked);
    this.brandEl?.removeEventListener('click', this.onBrandClicked);
    this.logoutBtn = undefined;
    this.brandEl = undefined;
  }

  render() {
    return `
      <div class="menu" role="navigation">
        <a class="brand" href="/" data-route="/">RYZE To-Do App</a>
        <nav class="menu-nav">
          <button-el id="logout-btn" variant="link" label="Logout"></button-el>
        </nav>
      </div>
    `;
  }
}
