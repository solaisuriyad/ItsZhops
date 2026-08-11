/* Checkout: customer form with validation + order summary. Frontend-only flow. */
import { getProduct, SHIPPING } from '../data/catalog.js';
import { totals as cartTotals, clearCart } from '../state/cart.js';
import { getBuyNow, clearBuyNow } from '../state/session.js';
import { recordSale } from '../state/stock.js';
import { placeOrder } from '../state/orders.js';
import { INDIAN_STATES, STORE } from '../data/content.js';
import * as core from '../state/cart-core.js';
import { validate, required, ruleName, ruleMobile, ruleEmail, rulePincode, ruleAddress, ruleState } from '../lib/validate.js';
import { formatINR } from '../lib/format.js';
import { esc, $, $$ } from '../lib/dom.js';
import { icon } from '../components/icons.js';
import { navigate } from '../router.js';

export const title = 'Checkout — ItsZhop';

function checkoutLines() {
  const bn = getBuyNow();
  if (bn) {
    return core.totals(bn, {
      priceFor: (id) => getProduct(id)?.price ?? 0,
      shipping: (s) => (s >= SHIPPING.freeAbove ? 0 : SHIPPING.flat),
    });
  }
  return cartTotals();
}

export function render() {
  const t = checkoutLines();

  if (t.lines.length === 0) {
    return `
    <section class="section"><div class="container">
      <div class="empty-state">
        ${icon('cart', 44)}
        <h3>Nothing to check out.</h3>
        <p>Your cart is empty — add something lovely first.</p>
        <a class="btn btn-primary" href="#/shop">Continue Shopping</a>
      </div>
    </div></section>`;
  }

  const isBuyNow = !!getBuyNow();

  const linesHtml = t.lines.map((l) => {
    const p = getProduct(l.id);
    return `
    <div class="mini-line">
      <img src="${p.image}" alt="${esc(p.alt)}" loading="lazy">
      <div><div class="t">${esc(p.name)}${l.variant ? ` <span class="s">· ${esc(l.variant)}</span>` : ''}</div>
      <div class="s">Qty ${l.qty} × ${formatINR(l.unit)}</div></div>
      <strong>${formatINR(l.total)}</strong>
    </div>`;
  }).join('');

  return `
  <section class="section" style="padding-top:28px">
    <div class="container">
      <nav class="breadcrumb" aria-label="Breadcrumb">
        <a href="#/">Home</a><span class="sep">/</span><a href="#/cart">Cart</a><span class="sep">/</span><span aria-current="page">Checkout</span>
      </nav>
      <h1 style="margin-bottom:var(--space-5)">Checkout</h1>

      <div class="checkout-layout">
        <form class="checkout-form" data-form="checkout" novalidate>
          <div data-checkout-errors></div>
          <div class="form-grid">
            <h2 class="form-section-title">${icon('user', 18)} Customer Information</h2>

            <div class="field full">
              <label for="co-name">Full Name <span class="req">*</span></label>
              <input class="input" id="co-name" name="name" autocomplete="name" placeholder="e.g. Ananya Sharma">
              <p class="field-error" id="err-name"></p>
            </div>

            <div class="field">
              <label for="co-mobile">Mobile Number <span class="req">*</span></label>
              <input class="input" id="co-mobile" name="mobile" inputmode="numeric" autocomplete="tel" placeholder="10-digit mobile">
              <p class="field-error" id="err-mobile"></p>
            </div>

            <div class="field">
              <label for="co-email">Email <span class="req">*</span></label>
              <input class="input" id="co-email" name="email" type="email" autocomplete="email" placeholder="you@example.com">
              <p class="field-error" id="err-email"></p>
            </div>

            <h2 class="form-section-title">${icon('pin', 18)} Delivery Address</h2>

            <div class="field full">
              <label for="co-address">Address <span class="req">*</span></label>
              <textarea class="input" id="co-address" name="address" autocomplete="street-address" placeholder="House no., street, area"></textarea>
              <p class="field-error" id="err-address"></p>
            </div>

            <div class="field">
              <label for="co-city">City <span class="req">*</span></label>
              <input class="input" id="co-city" name="city" autocomplete="address-level2" placeholder="City">
              <p class="field-error" id="err-city"></p>
            </div>

            <div class="field">
              <label for="co-state">State <span class="req">*</span></label>
              <select class="input" id="co-state" name="state" autocomplete="address-level1">
                <option value="">Select state…</option>
                ${INDIAN_STATES.map((s) => `<option>${s}</option>`).join('')}
              </select>
              <p class="field-error" id="err-state"></p>
            </div>

            <div class="field">
              <label for="co-pin">PIN Code <span class="req">*</span></label>
              <input class="input" id="co-pin" name="pin" inputmode="numeric" autocomplete="postal-code" placeholder="6-digit PIN">
              <p class="field-error" id="err-pin"></p>
            </div>

            <div class="cod-note">${icon('shield', 20)}
              <span><strong>Payment:</strong> Cash on Delivery. This is a demo store — no online payment is collected and no real order is placed. Online payment gateways (UPI / cards) will be integrated here later.</span>
            </div>

            <div class="full" style="display:flex;gap:12px;flex-wrap:wrap">
              <button class="btn btn-primary" type="submit" data-place-order>${icon('check', 18)} Place Order</button>
              <a class="btn btn-ghost" href="#/cart">Back to cart</a>
            </div>
          </div>
        </form>

        <aside class="summary-card" aria-label="Order summary">
          ${isBuyNow ? `<span class="express-pill">${icon('sparkle', 14)} Express order (Buy Now)</span>` : ''}
          <h2>Order Summary</h2>
          ${linesHtml}
          <div style="border-top:1px solid var(--border);margin-top:8px">
            <div class="sum-row"><span>Subtotal (${t.count} item${t.count === 1 ? '' : 's'})</span><span>${formatINR(t.subtotal)}</span></div>
            <div class="sum-row"><span>Shipping</span><span>${t.shipping === 0 ? '<span class="free">Free</span>' : formatINR(t.shipping)}</span></div>
            <div class="sum-row total"><span>Final Total</span><span>${formatINR(t.total)}</span></div>
          </div>
        </aside>
      </div>
    </div>
  </section>`;
}

export function mount() {
  const form = $('[data-form="checkout"]');
  if (!form) return;

  /* live-clear errors as the user fixes fields */
  form.addEventListener('input', (e) => {
    const field = e.target.closest('.field');
    if (field) field.classList.remove('invalid');
    $('[data-checkout-errors]').innerHTML = '';
  });

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(form).entries());

    const rules = {
      name: ruleName(),
      mobile: ruleMobile(),
      email: ruleEmail(),
      address: ruleAddress(),
      city: required('City'),
      state: ruleState(),
      pin: rulePincode(),
    };
    const { valid, errors } = validate(data, rules);

    /* paint field-level errors */
    for (const key of Object.keys(rules)) {
      const field = form.querySelector(`[name="${key}"]`)?.closest('.field');
      const errEl = form.querySelector(`#err-${key}`);
      if (!field || !errEl) continue;
      field.classList.toggle('invalid', !!errors[key]);
      field.querySelector('.input')?.setAttribute('aria-invalid', errors[key] ? 'true' : 'false');
      errEl.textContent = errors[key] || '';
    }

    const summaryEl = $('[data-checkout-errors]');
    if (!valid) {
      const n = Object.keys(errors).length;
      summaryEl.innerHTML = `<div class="error-summary" role="alert">Please fix ${n} highlighted field${n === 1 ? '' : 's'} below.</div>`;
      form.querySelector('.field.invalid .input')?.focus();
      return;
    }
    summaryEl.innerHTML = '';

    /* place the (demo) order */
    const btn = form.querySelector('[data-place-order]');
    btn.disabled = true;
    btn.innerHTML = 'Placing order…';

    setTimeout(() => {
      const t = checkoutLines();
      const order = placeOrder({
        customer: {
          name: data.name.trim(),
          mobile: data.mobile.trim(),
          email: data.email.trim(),
          address: data.address.trim(),
          city: data.city.trim(),
          state: data.state,
          pin: data.pin.trim(),
        },
        lines: t.lines.map((l) => ({ id: l.id, name: getProduct(l.id).name, variant: l.variant, qty: l.qty, unit: l.unit, total: l.total })),
        subtotal: t.subtotal,
        shipping: t.shipping,
        total: t.total,
        mode: getBuyNow() ? 'buynow' : 'cart',
      });

      /* decrement demo stock, clear the right source */
      t.lines.forEach((l) => recordSale(l.id, l.qty));
      if (getBuyNow()) clearBuyNow();
      else clearCart();

      navigate(`#/order-success/${order.id}`);
    }, 650);
  });
}
