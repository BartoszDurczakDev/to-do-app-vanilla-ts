import '../../components/atoms/button/button.component';
import './login-page.css';
import type { IComponent } from '../../core/interfaces/component.interface';
import { authService } from '../../services/auth/auth.service';
import { router } from '../../main';

export class LoginPage implements IComponent {
  private handleSubmit!: EventListener;

  private formEl?: HTMLFormElement;
  private createAccountBtn?: HTMLButtonElement;
  private loginErrorMsgEl?: HTMLParagraphElement;

  constructor() {
    this.handleSubmit = this.onLoginSubmitted.bind(this);
  }

  private onLoginSubmitted(e: Event) {
    e.preventDefault();

    if (!this.formEl) return;

    const username = (
      this.formEl.elements.namedItem('username') as HTMLInputElement
    )?.value.trim();

    const password = (
      this.formEl.elements.namedItem('password') as HTMLInputElement
    )?.value.trim();

    const authenticated = authService.login(username, password);

    if (!authenticated) {
      const errorMsg: string = 'Invalid username or password';
      this.loginErrorMsgEl!.classList.remove('hidden');
      this.loginErrorMsgEl!.innerHTML = errorMsg;
      return;
    }

    router.navigateTo('/');
  }

  private onGoToCreateAccount() {
    router.navigateTo('/sign-up');
  }

  afterMount(root: HTMLElement) {
    this.formEl =
      root.querySelector<HTMLFormElement>('.login-form') ?? undefined;
    this.createAccountBtn =
      root.querySelector('#navigate-to-create-account') ?? undefined;

    this.loginErrorMsgEl =
      root.querySelector('#error-login-username') ?? undefined;

    this.formEl?.addEventListener('submit', this.handleSubmit);
    this.createAccountBtn?.addEventListener(
      'click',
      this.onGoToCreateAccount.bind(this)
    );
  }

  beforeUnmount(): void {
    this.formEl?.removeEventListener('submit', this.handleSubmit);
    this.createAccountBtn?.removeEventListener(
      'click',
      this.onGoToCreateAccount.bind(this)
    );
  }

  render() {
    return `
      <div class="login-page">
        <div class="login-page__content">
          <h1>Login</h1>
          <form class="login-form">
            <div class="login-form__input">
              <label for="username">Username</label>
              <input id="username" name="username" type="text" minlength=3 required />
            </div>
            <div class="login-form__input">
              <label for="password">Password</label>
              <input id="password" name="password" type="password" minlength=5 required />
              <p id="error-login-username" class="hidden error"></p>
            </div>
            <input type="submit" value="Sign In"/>
          </form>
          <button-el variant="link" label="Create Account" id="navigate-to-create-account"></button-el>
        </div>
      </div>
    `;
  }
}
