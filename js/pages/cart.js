/* Full cart page with editable quantities and order summary. */
import { totals } from '../state/cart.js';
import { getProduct, SHIPPING } from '../data/catalog.js';
import { availableStock } from '../state/stock.js';
import { formatINR } from '../lib/format.js';
import { esc, $ } from '../lib/dom.js';
import { icon } from '../components/icons.js';

export const title = 'Your Cart — ItsZhop';

export function render() {
  const t = totals();

  if (t.lines.length === 0) {
    return `
    <section class="section"><div class="container">
      <h1 style="margin-bottom:var(--space-5)">Your Cart</h1>
      <div class="empty-state">
        ${icon('cart', 44)}
        <h3>Your cart is empty.</h3>
        <p>Looks like you haven’t added anything yet. Handmade things are waiting for you.</p>
        <a class="btn btn-primary" href="#/shop">Continue Shopping</a>
      </div>
    </div></section>`;
  }

  const rows = t.lines.map((l) => {
    const p = getProduct(l.id);
    const max = availableStock(p.id);
    return `
    <div class="cart-row">
      <img src="${p.image}" alt="${esc(p.alt)}" loading="lazy">
      <div class="cr-name">
        <a href="#/product/${p.id}">${esc(p.name)}</a>
        ${l.variant ? `<div class="cr-unit">${esc(l.variant)}</div>` : ''}
        <div class="cr-unit">${formatINR(l.unit)} each</div>
      </div>
      <div class="stepper cr-stepper">
        <button type="button" data-action="cart-dec" data-id="${p.id}" data-variant="${esc(l.variant)}" aria-label="Decrease quantity of ${esc(p.name)}" ${l.qty <= 1 ? 'disabled' : ''}>${icon('minus', 15)}</button>
        <output aria-label="Quantity of ${esc(p.name)}">${l.qty}</output>
        <button type="button" data-action="cart-inc" data-id="${p.id}" data-variant="${esc(l.variant)}" aria-label="Increase quantity of ${esc(p.name)}" ${l.qty >= max ? 'disabled' : ''}>${icon('plus', 15)}</button>
      </div>
      <span class="cr-total">${formatINR(l.total)}</span>
      <button type="button" class="cl-remove cr-remove" data-action="cart-remove" data-id="${p.id}" data-variant="${esc(l.variant)}">${icon('trash', 15)} Remove</button>
    </div>`;
  }).join('');

  const progress = Math.min(100, Math.round((t.subtotal / SHIPPING.freeAbove) * 100));

  return `
  <section class="section" style="padding-top:28px">
    <div class="container">
      <nav class="breadcrumb" aria-label="Breadcrumb">
        <a href="#/">Home</a><span class="sep">/</span><span aria-current="page">Cart</span>
      </nav>
      <div class="shop-head">
        <h1>Your Cart <span class="muted" style="font-size:1rem">(${t.count} item${t.count === 1 ? '' : 's'})</span></h1>
        <button type="button" class="btn btn-danger-ghost btn-sm" data-action="cart-clear">${icon('trash', 15)} Clear cart</button>
      </div>

      <div class="cart-layout">
        <div class="cart-table">${rows}</div>

        <aside class="summary-card" aria-label="Order summary">
          <h2>Order Summary</h2>
          <div class="sum-row"><span>Items (${t.count})</span><span>${formatINR(t.subtotal)}</span></div>
          <div class="sum-row"><span>Shipping</span><span>${t.shipping === 0 ? '<span class="free">Free</span>' : formatINR(t.shipping)}</span></div>
          <div class="sum-row total"><span>Total</span><span>${formatINR(t.total)}</span></div>
          <div class="ship-progress">
            <div class="bar"><div class="fill" style="width:${progress}%"></div></div>
            <p>${t.shipping === 0 ? '🎉 You’ve unlocked free shipping!' : `Add ${formatINR(SHIPPING.freeAbove - t.subtotal)} more for free shipping.`}</p>
          </div>
          <a class="btn btn-primary btn-block" href="#/checkout" style="margin-top:14px">Proceed to Checkout ${icon('arrow-right', 17)}</a>
          <a class="btn btn-ghost btn-block" href="#/shop" style="margin-top:8px">Continue Shopping</a>
        </aside>
      </div>
    </div>
  </section>`;
}
