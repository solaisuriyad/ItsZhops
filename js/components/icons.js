/* Inline SVG icon set (stroke-based, inherits currentColor). */

const paths = {
  search: '<circle cx="11" cy="11" r="7"/><path d="m20.5 20.5-4-4"/>',
  sun: '<circle cx="12" cy="12" r="4"/><path d="M12 2.5v2M12 19.5v2M5 5l1.4 1.4M17.6 17.6 19 19M2.5 12h2M19.5 12h2M5 19l1.4-1.4M17.6 6.4 19 5"/>',
  moon: '<path d="M20.5 13.2A8.5 8.5 0 1 1 10.8 3.5a7 7 0 0 0 9.7 9.7z"/>',
  menu: '<path d="M4 7h16M4 12h16M4 17h16"/>',
  close: '<path d="m6 6 12 12M18 6 6 18"/>',
  cart: '<circle cx="9.5" cy="20" r="1.5"/><circle cx="17" cy="20" r="1.5"/><path d="M3 3.5h2.6l2.5 11.7a1.6 1.6 0 0 0 1.6 1.3h7.4a1.6 1.6 0 0 0 1.6-1.3l1.6-7.7H6.2"/>',
  heart: '<path d="M12 20.3S4.7 15.8 2.8 11.5A5.5 5.5 0 0 1 12 6.7a5.5 5.5 0 0 1 9.2 4.8C19.3 15.8 12 20.3 12 20.3z"/>',
  plus: '<path d="M12 5.5v13M5.5 12h13"/>',
  minus: '<path d="M5.5 12h13"/>',
  trash: '<path d="M4 7h16M9.5 7V5.5a1.5 1.5 0 0 1 1.5-1.5h2a1.5 1.5 0 0 1 1.5 1.5V7M6.5 7l.9 12a2 2 0 0 0 2 1.9h5.2a2 2 0 0 0 2-1.9l.9-12M10 11.5v5.5M14 11.5v5.5"/>',
  'arrow-right': '<path d="M4.5 12h15m-6-6.5 6 6.5-6 6.5"/>',
  'arrow-left': '<path d="M19.5 12h-15m6 6.5-6-6.5 6-6.5"/>',
  check: '<path d="m4.5 12.5 5 5.5L19.5 6.5"/>',
  'chevron-down': '<path d="m6 9.5 6 6 6-6"/>',
  truck: '<path d="M2 6h12.5v11H2zM14.5 10h3.8l3.2 3.2V17h-7"/><circle cx="6.5" cy="18.5" r="1.8"/><circle cx="17.5" cy="18.5" r="1.8"/>',
  shield: '<path d="M12 2.8 4.8 5.6v5.8c0 4.8 3.3 8.2 7.2 9.8 3.9-1.6 7.2-5 7.2-9.8V5.6z"/><path d="m9 11.6 2.2 2.2 4.3-4.6"/>',
  leaf: '<path d="M4.5 19.5c0-8.5 5-14.5 15.5-15.5-.5 10.5-6 15.5-12.5 15.5"/><path d="M4.5 19.5c3-5.5 6.5-9.5 11.5-11.5"/>',
  mail: '<rect x="3" y="5" width="18" height="14" rx="2.5"/><path d="m3.5 7.5 8.5 6 8.5-6"/>',
  phone: '<path d="M5.5 3.5h3.2l1.6 4.6-2.3 1.6a12.5 12.5 0 0 0 6.3 6.3l1.6-2.3 4.6 1.6v3.2a2 2 0 0 1-2 2A16.5 16.5 0 0 1 3.5 5.5a2 2 0 0 1 2-2z"/>',
  pin: '<path d="M12 21.5S5 15 5 10a7 7 0 0 1 14 0c0 5-7 11.5-7 11.5z"/><circle cx="12" cy="10" r="2.6"/>',
  user: '<circle cx="12" cy="8" r="4"/><path d="M4.5 20.5c1.4-3.8 4.6-5.7 7.5-5.7s6.1 1.9 7.5 5.7"/>',
  box: '<path d="M3.5 7.5 12 3l8.5 4.5v9L12 21l-8.5-4.5z"/><path d="M3.5 7.5 12 12l8.5-4.5M12 12v9"/>',
  filter: '<path d="M4 6.5h16M7 12h10M10 17.5h4"/>',
  yarn: '<circle cx="12" cy="12" r="8.5"/><path d="M4.8 9.2c4.6-2.6 9.8-2.6 14.4 0M3.8 13.2c5.2-2.8 11.2-2.8 16.4 0M6 17.2c3.8-2.2 8.2-2.2 12 0"/>',
  sparkle: '<path d="m12 3.5 2 6 6 2-6 2-2 6-2-6-6-2 6-2z"/>',
  gift: '<rect x="3.5" y="8" width="17" height="4"/><path d="M5 12v8.5h14V12M12 8v12.5M12 8s-4.5.2-5.5-2C5.8 4.4 7.5 3 9 3.5c2 .7 3 4.5 3 4.5s1-3.8 3-4.5c1.5-.5 3.2.9 2.5 2.5-1 2.2-5.5 2-5.5 2z"/>',
  instagram: '<rect x="3.5" y="3.5" width="17" height="17" rx="4.5"/><circle cx="12" cy="12" r="4"/><circle cx="17.2" cy="6.8" r="1.1" fill="currentColor" stroke="none"/>',
  facebook: '<path d="M13.5 21v-7h2.8l.5-3.2h-3.3V8.7c0-.9.4-1.7 1.7-1.7h1.7V4.2S15.4 4 14 4c-2.8 0-4.5 1.7-4.5 4.6v2.2H6.8V14h2.7v7z"/>',
  youtube: '<rect x="2.5" y="6" width="19" height="12.5" rx="3.5"/><path d="m10.3 9.4 5 2.85-5 2.85z" fill="currentColor" stroke="none"/>',
  whatsapp: '<path d="M12 3.5a8.5 8.5 0 0 0-7.4 12.7L3.5 20.5l4.4-1.1A8.5 8.5 0 1 0 12 3.5z"/><path d="M9.2 8.6c-.5 2.6 3.6 6.8 6.3 6.4l.7-1.7-2.1-1.3-.9.9c-1.1-.5-2-1.4-2.5-2.5l.9-.9-1.2-2.1z" fill="currentColor" stroke="none"/>',
};

export function icon(name, size = 20, extra = '') {
  const body = paths[name] || paths.box;
  return `<svg class="icon ${extra}" width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${body}</svg>`;
}

/** Solid star used by ratings (clipped overlay handles fractions). */
export function star(size = 15) {
  return `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 2.6l2.9 6 6.6.9-4.8 4.6 1.2 6.5L12 17.5l-5.9 3.1 1.2-6.5L2.5 9.5l6.6-.9z"/></svg>`;
}
