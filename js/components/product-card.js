/* Product card used by home rails, shop grid and wishlist. */
import { categoryOf } from '../data/catalog.js';
import { availableStock } from '../state/stock.js';
import { has as isWished } from '../state/wishlist.js';
import { formatINR, discountPct } from '../lib/format.js';
import { esc } from '../lib/dom.js';
import { icon } from './icons.js';
import { rating } from './rating.js';

export function productCard(p) {
  const stock = availableStock(p.id);
  const out = stock <= 0;
  const low = !out && stock <= 5;
  const wished = isWished(p.id);
  const pct = discountPct(p.price, p.mrp);

  return `
  <article class="product-card">
    <a class="pc-media" href="#/product/${p.id}" tabindex="-1" aria-hidden="true">
      ${p.badge ? `<span class="pc-badge badge">${esc(p.badge)}</span>` : ''}
      ${out ? '<span class="pc-oos"><span>Out of stock</span></span>' : ''}
      <img src="${p.image}" alt="${esc(p.alt)}" loading="lazy" decoding="async">
    </a>
    <button type="button" class="pc-wish" data-action="toggle-wishlist" data-id="${p.id}"
      aria-pressed="${wished}" aria-label="${wished ? 'Remove from' : 'Add to'} wishlist: ${esc(p.name)}">
      ${icon('heart', 18)}
    </button>
    <div class="pc-body">
      <span class="pc-cat">${esc(categoryOf(p).name)}</span>
      <h3 class="pc-name"><a href="#/product/${p.id}">${esc(p.name)}</a></h3>
      ${rating(p.rating, p.reviews)}
      <div class="pc-meta">
        <span class="price-line">
          <span class="price">${formatINR(p.price)}</span>
          ${p.mrp ? `<span class="mrp">${formatINR(p.mrp)}</span><span class="discount">${pct}% off</span>` : ''}
        </span>
      </div>
      <span class="avail ${out ? 'out' : low ? 'low' : ''}">${out ? 'Out of stock' : low ? `Only ${stock} left` : 'In stock'}</span>
      <div class="pc-actions">
        <button type="button" class="btn btn-primary btn-sm" data-action="add-to-cart" data-id="${p.id}" ${out ? 'disabled' : ''}>
          ${icon('cart', 16)} Add to Cart
        </button>
      </div>
    </div>
  </article>`;
}

export function productCardSkeleton() {
  return `
  <div class="product-card" aria-hidden="true">
    <div class="skeleton" style="aspect-ratio:1/1;border-radius:0"></div>
    <div class="pc-body">
      <div class="skeleton" style="height:10px;width:40%"></div>
      <div class="skeleton" style="height:14px;width:80%"></div>
      <div class="skeleton" style="height:12px;width:55%"></div>
      <div class="skeleton" style="height:36px;width:100%"></div>
    </div>
  </div>`;
}
