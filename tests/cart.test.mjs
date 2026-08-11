/* Unit tests for pure cart logic (no browser APIs). Run: npm test */
import assert from 'node:assert/strict';
import * as cart from '../js/state/cart-core.js';

const STOCK = { A: 5, B: 2, O: 0 };
const avail = (id) => STOCK[id] ?? 10;
const priceFor = (id) => ({ A: 199, B: 499, O: 99 })[id] ?? 100;
const ship = (s) => (s >= 999 ? 0 : 50);

/* add */
let r = cart.addToCart([], { id: 'A', qty: 2 }, avail);
assert.equal(r.ok, true);
assert.equal(r.items[0].qty, 2);

/* merge same line */
r = cart.addToCart(r.items, { id: 'A', qty: 2 }, avail);
assert.equal(r.items.length, 1);
assert.equal(r.items[0].qty, 4);

/* clamp at stock */
r = cart.addToCart(r.items, { id: 'A', qty: 5 }, avail);
assert.equal(r.items[0].qty, 5);
assert.equal(r.clamped, true);

/* cannot exceed stock further */
r = cart.addToCart(r.items, { id: 'A', qty: 1 }, avail);
assert.equal(r.ok, false);

/* out of stock product */
r = cart.addToCart([], { id: 'O', qty: 1 }, avail);
assert.equal(r.ok, false);

/* separate variant lines share product stock */
let v = cart.addToCart([], { id: 'B', variant: 'Red', qty: 1 }, avail);
v = cart.addToCart(v.items, { id: 'B', variant: 'Blue', qty: 1 }, avail);
assert.equal(v.items.length, 2);
v = cart.addToCart(v.items, { id: 'B', qty: 1 }, avail);
assert.equal(v.ok, false, 'stock shared across variants');

/* qty sanitisation */
r = cart.setQty([{ id: 'A', qty: 3 }], { id: 'A', qty: 0 }, avail);
assert.equal(r.items[0].qty, 1);
r = cart.setQty([{ id: 'A', qty: 3 }], { id: 'A', qty: 'abc' }, avail);
assert.equal(r.items[0].qty, 1);
r = cart.setQty([{ id: 'A', qty: 3 }], { id: 'A', qty: 99 }, avail);
assert.equal(r.items[0].qty, 5, 'clamped to stock');

/* remove */
r = cart.removeLine([{ id: 'A', qty: 1 }, { id: 'B', qty: 1 }], { id: 'A' });
assert.equal(r.length, 1);
assert.equal(r[0].id, 'B');

/* totals — integer math, Indian shipping rule */
const t = cart.totals([{ id: 'A', qty: 2 }, { id: 'B', qty: 1 }], { priceFor, shipping: ship });
assert.equal(t.subtotal, 199 * 2 + 499); // 897
assert.equal(t.shipping, 50);
assert.equal(t.total, 947);
assert.equal(t.count, 3);

const t2 = cart.totals([{ id: 'B', qty: 2 }], { priceFor, shipping: ship }); // 998 → shipping 50
assert.equal(t2.shipping, 50);
const t3 = cart.totals([{ id: 'A', qty: 5 }], { priceFor, shipping: ship }); // 995
assert.equal(t3.shipping, 50);
const t4 = cart.totals([{ id: 'B', qty: 2 }, { id: 'A', qty: 1 }], { priceFor, shipping: ship }); // 1197
assert.equal(t4.shipping, 0);
assert.equal(t4.total, 1197);

/* empty cart */
const t5 = cart.totals([], { priceFor, shipping: ship });
assert.equal(t5.total, 0);
assert.equal(t5.shipping, 0);

console.log('✓ cart-core: all assertions passed');
