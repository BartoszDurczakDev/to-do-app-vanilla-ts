import '../../components/atoms/button/button.component';
import './sign-up-page.css';
import type { IComponent } from '../../core/interfaces/component.interface';
import { authService } from '../../services/auth/auth.service';
import { router } from '../../main';

export class SignUpPage implements IComponent {
  private handleSubmit: EventListener;

  private formEl?: HTMLFormElement;
  private navigateToLoginBtnEl?: HTMLButtonElement;

  constructor() {
    this.handleSubmit = this.onSignUpSubmitted.bind(this);
  }

  private onSignUpSubmitted(e: Event) {
    e.preventDefault();

    if (!this.formEl) return;

    const username = (
      this.formEl.elements.namedItem('username') as HTMLInputElement
    )?.value.trim();
    const password = (
      this.formEl.elements.namedItem('password') as HTMLInputElement
    )?.value.trim();

    const singUp = authService.signUp(username, password);

    if (!singUp) {
      const usernameError = document.getElementById('error-sign-up-username');
      if (!usernameError) return;

      usernameError.classList.remove('hidden');

      usernameError.innerText = 'Username already taken';

      return;
    }

    authService.login(username, password);
    router.navigateTo('/');
  }

  private onGoToLogin() {
    router.navigateTo('/login');
  }

  afterMount(root: HTMLElement) {
    this.formEl =
      root.querySelector<HTMLFormElement>('.sign-up-form') ?? undefined;

    this.navigateToLoginBtnEl =
      root.querySelector<HTMLButtonElement>('#navigate-to-login') ?? undefined;

    this.navigateToLoginBtnEl?.addEventListener(
      'click',
      this.onGoToLogin.bind(this)
    );
    this.formEl?.addEventListener('submit', this.handleSubmit);
  }

  beforeUnmount(): void {
    this.formEl?.removeEventListener('submit', this.handleSubmit);
    this.navigateToLoginBtnEl?.removeEventListener(
      'click',
      this.onGoToLogin.bind(this)
    );
  }

  render() {
    return `
      <div class="sign-up-page">
        <div class="sign-up-page__content">
          <h1>Create Account</h1>
          <form class="sign-up-form">
            <div class="sign-up-form__input">
              <label for="username">Username</label>
              <input id="username" name="username" type="text" minlength=3 required/>
              <p id="error-sign-up-username" class="hidden error"></p>
            </div>
            <div class="sign-up-form__input">
              <label for="password">Password</label>
              <input id="password" name="password" type="password" minlength=5 required/>
            </div>
            <input type="submit" value="Sign Up"/>
          </form>
          <button-el variant="link" label="Already have an Account?" id="navigate-to-login"></button-el>
        </div>
      </div>
    `;
  }
}
