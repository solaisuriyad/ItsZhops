/* Product details page. */
import { getProduct, getCategory, PRODUCTS } from '../data/catalog.js';
import { availableStock } from '../state/stock.js';
import { has as isWished } from '../state/wishlist.js';
import { formatINR, discountPct, toSafeQty } from '../lib/format.js';
import { esc, $ } from '../lib/dom.js';
import { icon } from '../components/icons.js';
import { rating } from '../components/rating.js';
import { productCard } from '../components/product-card.js';

export let title = 'Product — ItsZhop';

export function render(params) {
  const p = getProduct(params.get('id'));
  if (!p) {
    return `
    <section class="section"><div class="container">
      <div class="empty-state">
        ${icon('box', 40)}
        <h3>Product not found</h3>
        <p>This product may have been renamed or retired.</p>
        <a class="btn btn-primary" href="#/shop">Back to shop</a>
      </div>
    </div></section>`;
  }

  title = `${p.name} — ItsZhop`;
  const cat = getCategory(p.category);
  const stock = availableStock(p.id);
  const out = stock <= 0;
  const low = !out && stock <= 5;
  const pct = discountPct(p.price, p.mrp);
  const wished = isWished(p.id);

  const variants = p.variants
    ? `<p class="pd-variant-label">${esc(p.variants.label)}: <strong data-variant-name>${esc(p.variants.options[0])}</strong></p>
       <div class="variant-pills" role="radiogroup" aria-label="${esc(p.variants.label)}">
         ${p.variants.options.map((opt, i) => `
           <input type="radio" id="var-${i}" name="pd-variant" value="${esc(opt)}" ${i === 0 ? 'checked' : ''}>
           <label for="var-${i}">${esc(opt)}</label>`).join('')}
       </div>`
    : '';

  const related = PRODUCTS.filter((x) => x.category === p.category && x.id !== p.id).slice(0, 4);

  return `
  <section class="section" style="padding-top:28px">
    <div class="container">
      <nav class="breadcrumb" aria-label="Breadcrumb">
        <a href="#/">Home</a><span class="sep">/</span>
        <a href="#/shop">Shop</a><span class="sep">/</span>
        <a href="#/shop?cat=${cat.id}">${esc(cat.name)}</a><span class="sep">/</span>
        <span aria-current="page">${esc(p.name)}</span>
      </nav>

      <div class="pd-grid">
        <div class="pd-media">
          <img src="${p.image}" alt="${esc(p.alt)}">
        </div>

        <div class="pd-info">
          <span class="pd-cat">${p.badge ? `<span class="badge">${esc(p.badge)}</span> ` : ''}<span class="badge badge-green">${esc(cat.name)}</span></span>
          <h1>${esc(p.name)}</h1>
          ${rating(p.rating, p.reviews)}

          <div class="pd-price-row">
            <span class="price-line">
              <span class="price price-lg">${formatINR(p.price)}</span>
              ${p.mrp ? `<span class="mrp">${formatINR(p.mrp)}</span><span class="discount">${pct}% off</span>` : ''}
            </span>
            <p class="muted" style="font-size:.82rem;margin:6px 0 0">Inclusive of all taxes</p>
          </div>

          <p class="muted">${esc(p.description)}</p>

          ${variants}

          <span class="avail ${out ? 'out' : low ? 'low' : ''}">${out ? 'Out of stock' : low ? `Hurry — only ${stock} left` : `In stock (${stock} available)`}</span>

          <div class="pd-buy-row">
            <div class="stepper" data-pd-stepper>
              <button type="button" data-pd="dec" aria-label="Decrease quantity" ${out ? 'disabled' : ''}>${icon('minus', 16)}</button>
              <output data-pd-qty aria-label="Quantity" aria-live="polite">1</output>
              <button type="button" data-pd="inc" aria-label="Increase quantity" ${out ? 'disabled' : ''}>${icon('plus', 16)}</button>
            </div>
            <button type="button" class="btn btn-primary" data-action="pd-add" data-id="${p.id}" ${out ? 'disabled' : ''}>${icon('cart', 18)} Add to Cart</button>
            <button type="button" class="btn btn-secondary" data-action="pd-buy" data-id="${p.id}" ${out ? 'disabled' : ''}>Buy Now</button>
            <button type="button" class="icon-btn" data-action="toggle-wishlist" data-id="${p.id}" aria-pressed="${wished}" aria-label="${wished ? 'Remove from' : 'Add to'} wishlist" style="border:1px solid var(--border-strong)">
              ${icon('heart', 20)}
            </button>
          </div>
          ${out ? '<p class="field-error" style="display:block">This item is currently out of stock — add it to your wishlist and we’ll keep it safe for you.</p>' : ''}

          <div class="pd-meta-icons">
            <div>${icon('truck', 20)} Free shipping on orders above ₹999 — flat ₹50 otherwise</div>
            <div>${icon('shield', 20)} 7-day replacement for damaged or wrong items</div>
            <div>${icon('leaf', 20)} Handmade in small batches — slight variations are natural</div>
          </div>

          <div class="pd-desc">
            <h2>Product information</h2>
            <ul>${(p.details || []).map((d) => `<li>${esc(d)}</li>`).join('')}</ul>
          </div>
        </div>
      </div>

      ${related.length ? `
      <div style="margin-top:var(--space-8)">
        <div class="section-head"><div><span class="eyebrow">Keep browsing</span><h2>You may also like</h2></div></div>
        <div class="product-grid">${related.map(productCard).join('')}</div>
      </div>` : ''}
    </div>
  </section>`;
}

export function mount(params) {
  const p = getProduct(params.get('id'));
  if (!p) return;
  const root = $('#page');
  let qty = 1;
  const max = () => availableStock(p.id);

  const qtyEl = root.querySelector('[data-pd-qty]');
  const refresh = () => {
    if (qtyEl) qtyEl.textContent = String(qty);
    const [dec, inc] = [root.querySelector('[data-pd="dec"]'), root.querySelector('[data-pd="inc"]')];
    if (dec) dec.disabled = qty <= 1;
    if (inc) inc.disabled = qty >= max();
  };
  refresh();

  root.querySelector('[data-pd-stepper]')?.addEventListener('click', (e) => {
    const btn = e.target.closest('[data-pd]');
    if (!btn || btn.disabled) return;
    qty = toSafeQty(qty + (btn.dataset.pd === 'inc' ? 1 : -1), max());
    refresh();
  });

  /* attach to the (freshly rendered) pills container to avoid listener buildup */
  root.querySelector('.variant-pills')?.addEventListener('change', (e) => {
    if (e.target.name === 'pd-variant') {
      const el = root.querySelector('[data-variant-name]');
      if (el) el.textContent = e.target.value;
    }
  });
}

export const currentVariant = () => document.querySelector('#page input[name="pd-variant"]:checked')?.value || '';
export const currentQty = () => Number(document.querySelector('#page [data-pd-qty]')?.textContent || 1);
