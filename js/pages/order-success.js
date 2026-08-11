/* Order confirmation page. */
import { getOrder } from '../state/orders.js';
import { formatINR } from '../lib/format.js';
import { esc } from '../lib/dom.js';
import { icon } from '../components/icons.js';

export const title = 'Order placed — ItsZhop';

export function render(params) {
  const order = getOrder(params.get('id'));
  if (!order) {
    return `
    <section class="section"><div class="container">
      <div class="empty-state">
        ${icon('box', 40)}
        <h3>Order not found</h3>
        <p>We couldn’t find that order on this device.</p>
        <a class="btn btn-primary" href="#/shop">Back to shop</a>
      </div>
    </div></section>`;
  }

  const c = order.customer;
  return `
  <section class="section"><div class="container success-wrap">
    <div class="success-badge">${icon('check', 38)}</div>
    <h1>Thank you, ${esc(c.name.split(' ')[0])}! 🎉</h1>
    <p class="muted">Your order has been placed successfully. This is a demo store — no payment was collected and nothing will be shipped.</p>
    <p class="order-id">${order.id}</p>
    <p class="muted" style="font-size:.85rem">${new Date(order.placedAt).toLocaleString('en-IN', { dateStyle: 'long', timeStyle: 'short' })}</p>

    <div class="order-card">
      <h2>Order Summary</h2>
      ${order.lines.map((l) => `
        <div class="mini-line">
          <span></span>
          <div><div class="t">${esc(l.name)}${l.variant ? ` <span class="s">· ${esc(l.variant)}</span>` : ''}</div>
          <div class="s">Qty ${l.qty} × ${formatINR(l.unit)}</div></div>
          <strong>${formatINR(l.total)}</strong>
        </div>`).join('')}
      <div class="sum-row"><span>Subtotal</span><span>${formatINR(order.subtotal)}</span></div>
      <div class="sum-row"><span>Shipping</span><span>${order.shipping === 0 ? 'Free' : formatINR(order.shipping)}</span></div>
      <div class="sum-row total"><span>Total (${order.payment})</span><span>${formatINR(order.total)}</span></div>

      <h2 style="margin-top:var(--space-4)">Delivering to</h2>
      <p class="muted" style="margin:0">
        ${esc(c.name)}<br>
        ${esc(c.address)}<br>
        ${esc(c.city)}, ${esc(c.state)} — ${esc(c.pin)}<br>
        ${esc(c.mobile)} • ${esc(c.email)}
      </p>
    </div>

    <div style="display:flex;gap:12px;justify-content:center;margin-top:var(--space-5);flex-wrap:wrap">
      <a class="btn btn-primary" href="#/shop">Continue Shopping</a>
      <a class="btn btn-secondary" href="#/orders">View My Orders</a>
    </div>
  </div></section>`;
}
