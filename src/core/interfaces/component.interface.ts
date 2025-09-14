export interface IComponent {
  render(): string;
  afterMount?(root: HTMLElement): void;
  beforeUnmount?(): void;
}
