/* Light / dark theme with localStorage persistence (applied pre-paint in index.html). */
import { emit, Events } from '../lib/bus.js';

const KEY = 'zhop.theme.v1';

export function current() {
  if (typeof document === 'undefined') return 'light';
  return document.documentElement.getAttribute('data-theme') === 'dark' ? 'dark' : 'light';
}

export function set(theme) {
  document.documentElement.setAttribute('data-theme', theme);
  try { localStorage.setItem(KEY, theme); } catch { /* private mode */ }
  emit(Events.THEME_CHANGED, theme);
}

export const toggle = () => set(current() === 'dark' ? 'light' : 'dark');
