import css from './button.css?inline';

const sheet = new CSSStyleSheet();
sheet.replaceSync(css);

class Button extends HTMLElement {
  private root = this.attachShadow({ mode: 'open' });

  static get observedAttributes() {
    return ['label', 'variant'];
  }

  get variant(): 'primary' | 'ghost' {
    return (this.getAttribute('variant') as any) ?? 'primary';
  }
  set variant(v: 'primary' | 'ghost') {
    this.setAttribute('variant', v);
  }

  get label(): string {
    return this.getAttribute('label') ?? 'Button';
  }
  set label(v: string) {
    this.setAttribute('label', v);
  }

  connectedCallback() {
    if (!this.root.adoptedStyleSheets.includes(sheet)) {
      this.root.adoptedStyleSheets = [...this.root.adoptedStyleSheets, sheet];
    }

    if (!this.hasAttribute('variant')) this.variant = 'primary';

    this.root.innerHTML = `<button id="btn">${this.label}</button>`;

    this.root.getElementById('btn')!.addEventListener('click', () => {
      this.dispatchEvent(new CustomEvent('ui-click', { bubbles: true }));
    });
  }

  attributeChangedCallback(
    name: string,
    _oldVal: string | null,
    newVal: string | null
  ) {
    if (!this.isConnected || !this.shadowRoot) return;
    if (name === 'label') {
      const btn = this.shadowRoot.querySelector<HTMLButtonElement>('#btn');
      if (btn) btn.textContent = newVal ?? 'Button';
    }
  }
}
customElements.define('button-el', Button);
