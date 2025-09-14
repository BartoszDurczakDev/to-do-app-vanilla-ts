import { Router } from './core/routing/router';
import { routes } from './core/routing/routes';
import './style.css';

const mainApp = document.querySelector<HTMLDivElement>('#app')!;

export const router = new Router(mainApp, routes);
