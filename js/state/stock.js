/* Stock = catalog stock minus units sold (demo orders), persisted locally. */
import { getProduct } from '../data/catalog.js';
import { readJSON, writeJSON } from '../lib/dom.js';

const KEY = 'zhop.sold.v1';
let sold = readJSON(KEY, {});

export function availableStock(id) {
  const p = getProduct(id);
  if (!p) return 0;
  return Math.max(0, p.stock - (sold[id] || 0));
}

export function recordSale(id, qty) {
  sold[id] = (sold[id] || 0) + qty;
  writeJSON(KEY, sold);
}
