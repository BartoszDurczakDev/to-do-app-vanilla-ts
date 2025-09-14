global.CSSStyleSheet = class CSSStyleSheet {
  constructor() {
    this.cssRules = [];
  }

  replaceSync(css) {
    this._css = css;
  }

  insertRule(rule, index) {
    this.cssRules.splice(index || this.cssRules.length, 0, rule);
  }

  deleteRule(index) {
    this.cssRules.splice(index, 1);
  }
};

if (!('adoptedStyleSheets' in Document.prototype)) {
  Object.defineProperty(Document.prototype, 'adoptedStyleSheets', {
    get() {
      return this._adoptedStyleSheets || [];
    },
    set(value) {
      this._adoptedStyleSheets = value;
    },
  });
}

if (!('adoptedStyleSheets' in ShadowRoot.prototype)) {
  Object.defineProperty(ShadowRoot.prototype, 'adoptedStyleSheets', {
    get() {
      return this._adoptedStyleSheets || [];
    },
    set(value) {
      this._adoptedStyleSheets = value;
    },
  });
}

beforeEach(() => {
  localStorage.clear();
});

afterEach(() => {
  localStorage.clear();
});

const mockOutlet = document.createElement('div');
mockOutlet.id = 'app';
document.body.appendChild(mockOutlet);
