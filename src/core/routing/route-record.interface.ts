import type { IComponent } from '../interfaces/component.interface';

export interface RouteRecord {
  component: () => IComponent;
  auth?: boolean;
}
