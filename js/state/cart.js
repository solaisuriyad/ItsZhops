/* Browser cart store: persists to localStorage, broadcasts changes. */
import { getProduct, SHIPPING } from '../data/catalog.js';
import { readJSON, writeJSON } from '../lib/dom.js';
import { emit, Events } from '../lib/bus.js';
import { availableStock } from './stock.js';
import * as core from './cart-core.js';

const KEY = 'zhop.cart.v1';
let items = coreLineFix(readJSON(KEY, []));

function coreLineFix(raw) {
  return (Array.isArray(raw) ? raw : []).filter((l) => l && getProduct(l.id));
}

function commit(next) {
  items = next;
  writeJSON(KEY, items);
  emit(Events.CART_CHANGED, { count: totals().count });
}

export const getLines = () => items.map((l) => l);

export function totals() {
  return core.totals(items, {
    priceFor: (id) => getProduct(id)?.price ?? 0,
    shipping: (subtotal) => (subtotal >= SHIPPING.freeAbove ? 0 : SHIPPING.flat),
  });
}

export function addToCart(id, qty = 1, variant = '') {
  const res = core.addToCart(items, { id, variant, qty }, availableStock);
  if (res.ok) commit(res.items);
  return res;
}

export function setQty(id, variant, qty) {
  const res = core.setQty(items, { id, variant, qty }, availableStock);
  if (res.changed) commit(res.items);
  return res;
}

export function removeLine(id, variant = '') {
  commit(core.removeLine(items, { id, variant }));
}

export function clearCart() {
  commit([]);
}

export const count = () => totals().count;
