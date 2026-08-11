/* Account page: demo order history stored on this device. */
import { readJSON, esc } from '../lib/dom.js';
import { formatINR } from '../lib/format.js';
import { icon } from '../components/icons.js';

export const title = 'Your Orders — ItsZhop';

export function render() {
  const orders = readJSON('zhop.orders.v1', []);

  if (!orders.length) {
    return `
    <section class="section"><div class="container">
      <h1 style="margin-bottom:var(--space-5)">Your Orders</h1>
      <div class="empty-state">
        ${icon('box', 44)}
        <h3>No orders yet.</h3>
        <p>Orders you place on this device will appear here.</p>
        <a class="btn btn-primary" href="#/shop">Start Shopping</a>
      </div>
    </div></section>`;
  }

  return `
  <section class="section" style="padding-top:28px">
    <div class="container">
      <h1 style="margin-bottom:var(--space-5)">Your Orders</h1>
      <div style="display:grid;gap:14px">
        ${orders.map((o) => `
          <a class="order-card" href="#/order-success/${o.id}" style="display:block;margin:0;color:inherit;text-decoration:none">
            <div style="display:flex;justify-content:space-between;gap:12px;flex-wrap:wrap;align-items:baseline">
              <span class="order-id">${o.id}</span>
              <span class="muted" style="font-size:.85rem">${new Date(o.placedAt).toLocaleDateString('en-IN', { dateStyle: 'medium' })}</span>
            </div>
            <p class="muted" style="margin:8px 0 0">${o.lines.map((l) => `${l.qty}× ${esc(l.name)}`).join(' · ')}</p>
            <p style="margin:8px 0 0"><strong>${formatINR(o.total)}</strong> <span class="badge badge-green">Demo • COD</span></p>
          </a>`).join('')}
      </div>
    </div>
  </section>`;
}
