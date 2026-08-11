/* Slide-in cart drawer: quick view of the cart from any page. */
import { totals } from '../state/cart.js';
import { getProduct } from '../data/catalog.js';
import { formatINR } from '../lib/format.js';
import { esc, $ } from '../lib/dom.js';
import { icon } from './icons.js';

let open = false;

export function renderDrawer() {
  return `
  <div class="drawer" id="cart-drawer" aria-hidden="true">
    <div class="overlay" data-action="close-cart"></div>
    <aside class="panel" role="dialog" aria-modal="true" aria-label="Shopping cart">
      <div class="drawer-head">
        <h2>Your Cart <span class="muted" data-drawer-count></span></h2>
        <button type="button" class="icon-btn" data-action="close-cart" aria-label="Close cart">${icon('close', 20)}</button>
      </div>
      <div class="drawer-body" data-drawer-body></div>
      <div class="drawer-foot" data-drawer-foot></div>
    </aside>
  </div>`;
}

export function setDrawer(openIt) {
  open = openIt;
  const el = $('#cart-drawer');
  if (!el) return;
  el.classList.toggle('open', open);
  el.setAttribute('aria-hidden', String(!open));
  document.body.style.overflow = open ? 'hidden' : '';
  if (open) {
    renderDrawerBody();
    el.querySelector('[data-action="close-cart"].icon-btn')?.focus();
  }
}

export const isOpen = () => open;

export function renderDrawerBody() {
  const body = $('[data-drawer-body]');
  const foot = $('[data-drawer-foot]');
  const countEl = $('[data-drawer-count]');
  if (!body || !foot) return;

  const t = totals();
  if (countEl) countEl.textContent = t.count ? `(${t.count} item${t.count === 1 ? '' : 's'})` : '';

  if (t.lines.length === 0) {
    body.innerHTML = `
      <div class="empty-state" style="border:0;padding:40px 8px">
        ${icon('cart', 40)}
        <h3>Your cart is empty.</h3>
        <p>Handmade things are waiting for you.</p>
        <button type="button" class="btn btn-primary" data-action="close-cart-and-shop">Continue Shopping</button>
      </div>`;
    foot.innerHTML = '';
    return;
  }

  body.innerHTML = t.lines
    .map((l) => {
      const p = getProduct(l.id);
      const max = p.stock; // cart clamps already respect stock on add
      return `
      <div class="cart-line">
        <img src="${p.image}" alt="${esc(p.alt)}" loading="lazy">
        <div>
          <p class="cl-name"><a href="#/product/${p.id}" data-action="close-cart-nav">${esc(p.name)}</a></p>
          ${l.variant ? `<p class="cl-variant">${esc(l.variant)}</p>` : ''}
          <p class="cl-price">${formatINR(l.unit)} each</p>
          <div class="stepper" style="margin-top:6px">
            <button type="button" data-action="cart-dec" data-id="${p.id}" data-variant="${esc(l.variant)}" aria-label="Decrease quantity of ${esc(p.name)}" ${l.qty <= 1 ? 'disabled' : ''}>${icon('minus', 15)}</button>
            <output aria-label="Quantity">${l.qty}</output>
            <button type="button" data-action="cart-inc" data-id="${p.id}" data-variant="${esc(l.variant)}" aria-label="Increase quantity of ${esc(p.name)}" ${l.qty >= max ? 'disabled' : ''}>${icon('plus', 15)}</button>
          </div>
        </div>
        <div class="cl-right">
          <span class="cl-total">${formatINR(l.total)}</span>
          <button type="button" class="cl-remove" data-action="cart-remove" data-id="${p.id}" data-variant="${esc(l.variant)}">${icon('trash', 14)} Remove</button>
        </div>
      </div>`;
    })
    .join('');

  foot.innerHTML = `
    <div class="sum-row"><span>Subtotal</span><span>${formatINR(t.subtotal)}</span></div>
    <div class="sum-row"><span>Shipping</span><span>${t.shipping === 0 ? '<span class="free">Free</span>' : formatINR(t.shipping)}</span></div>
    <div class="sum-row total"><span>Total</span><span>${formatINR(t.total)}</span></div>
    <div style="display:flex;gap:10px">
      <a class="btn btn-secondary" style="flex:1" href="#/cart" data-action="close-cart-nav">View Cart</a>
      <a class="btn btn-primary" style="flex:1" href="#/checkout" data-action="close-cart-nav">Checkout ${icon('arrow-right', 16)}</a>
    </div>`;
}
