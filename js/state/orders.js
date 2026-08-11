/* Demo order store — frontend only. Swap for a real API later. */
import { readJSON, writeJSON } from '../lib/dom.js';

const KEY = 'zhop.orders.v1';

export function placeOrder({ customer, lines, subtotal, shipping, total, mode }) {
  const id =
    'ZHP-' +
    Date.now().toString(36).toUpperCase().slice(-5) +
    String(Math.floor(Math.random() * 90) + 10);
  const order = {
    id,
    placedAt: new Date().toISOString(),
    mode, // 'cart' | 'buynow'
    customer,
    lines,
    subtotal,
    shipping,
    total,
    payment: 'Cash on Delivery (online payments coming soon)',
  };
  const all = readJSON(KEY, []);
  all.unshift(order);
  writeJSON(KEY, all);
  return order;
}

export function getOrder(id) {
  return readJSON(KEY, []).find((o) => o.id === id) || null;
}
