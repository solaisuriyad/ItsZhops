/* Buy-Now express session: which items checkout should use. */
import { readJSON, writeJSON } from '../lib/dom.js';

const KEY = 'zhop.buynow.v1';

export function setBuyNow(lines) {
  writeJSON(KEY, lines);
}

export function getBuyNow() {
  const raw = readJSON(KEY, null);
  return Array.isArray(raw) && raw.length ? raw : null;
}

export function clearBuyNow() {
  try { localStorage.removeItem(KEY); } catch { /* noop */ }
}
