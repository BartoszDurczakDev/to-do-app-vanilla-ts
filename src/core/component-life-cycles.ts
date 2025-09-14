import type { IComponent } from './interfaces/component.interface';

const COMP_KEY: unique symbol = Symbol('mountedComponent');

type MountHost = Element & { [COMP_KEY]?: IComponent };

export function mount<T extends IComponent>(host: Element, comp: T): T {
  unmount(host);
  const h = host as MountHost;
  host.innerHTML = comp.render();
  comp.afterMount?.(host as HTMLElement);
  h[COMP_KEY] = comp;
  return comp;
}

export function unmount(host: Element): void {
  const h = host as MountHost;
  h[COMP_KEY]?.beforeUnmount?.();
  host.innerHTML = '';
  h[COMP_KEY] = undefined;
}

export function update<T extends IComponent>(host: Element, comp: T): T {
  return mount(host, comp);
}
