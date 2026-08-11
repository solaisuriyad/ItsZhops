/* Subtle toast notifications. */
import { icon } from './icons.js';
import { $, esc } from '../lib/dom.js';

const ICONS = { success: 'check', error: 'close', info: 'sparkle' };

export function toast(message, { type = 'success', duration = 2600 } = {}) {
  const host = $('#toasts');
  if (!host) return;
  const el = document.createElement('div');
  el.className = `toast ${type}`;
  el.setAttribute('role', 'status');
  el.innerHTML = `${icon(ICONS[type] || 'check', 18)}<span>${esc(message)}</span>`;
  host.appendChild(el);
  while (host.children.length > 3) host.firstElementChild.remove();
  setTimeout(() => {
    el.classList.add('leaving');
    el.addEventListener('animationend', () => el.remove(), { once: true });
  }, duration);
}
