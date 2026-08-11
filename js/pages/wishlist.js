/* Wishlist page. */
import { all } from '../state/wishlist.js';
import { getProduct } from '../data/catalog.js';
import { productCard } from '../components/product-card.js';
import { icon } from '../components/icons.js';

export const title = 'Wishlist — ItsZhop';

export function render() {
  const items = all().map(getProduct).filter(Boolean);

  if (items.length === 0) {
    return `
    <section class="section"><div class="container">
      <h1 style="margin-bottom:var(--space-5)">Wishlist</h1>
      <div class="empty-state">
        ${icon('heart', 44)}
        <h3>Your wishlist is empty.</h3>
        <p>Tap the heart on any product to save it here for later.</p>
        <a class="btn btn-primary" href="#/shop">Continue Shopping</a>
      </div>
    </div></section>`;
  }

  return `
  <section class="section" style="padding-top:28px">
    <div class="container">
      <h1 style="margin-bottom:var(--space-5)">Wishlist <span class="muted" style="font-size:1rem">(${items.length} item${items.length === 1 ? '' : 's'})</span></h1>
      <div class="product-grid">${items.map(productCard).join('')}</div>
    </div>
  </section>`;
}
