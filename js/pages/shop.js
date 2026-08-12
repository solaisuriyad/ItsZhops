/* Shop page: search, category/price/availability filters, sorting.
   All state lives in the URL so views are shareable & back-button friendly. */
import { PRODUCTS, CATEGORIES, PRICE_BUCKETS, SORTS, getCategory } from '../data/catalog.js';
import { availableStock } from '../state/stock.js';
import { productCard, productCardSkeleton } from '../components/product-card.js';
import { esc, $, $$ } from '../lib/dom.js';
import { icon } from '../components/icons.js';
import { setQueryParams, parseHash } from '../router.js';

export const title = 'Shop — ItsZhop';

let loadedOnce = false;

export function render(params) {
  const catOptions = CATEGORIES.map((c) => `
    <label class="filter-option">
      <input type="checkbox" name="cat" value="${c.id}">
      <span>${esc(c.name)}</span>
      <span class="n">${PRODUCTS.filter((p) => p.category === c.id).length}</span>
    </label>`).join('');

  const priceOptions = PRICE_BUCKETS.map((b) => `
    <label class="filter-option"><input type="checkbox" name="price" value="${b.id}"><span>${b.label}</span></label>`).join('');

  return `
  <section class="section" style="padding-top:28px">
    <div class="container">
      <nav class="breadcrumb" aria-label="Breadcrumb">
        <a href="#/">Home</a><span class="sep">/</span><span aria-current="page">Shop</span>
      </nav>

      <div class="shop-head">
        <div>
          <h1 data-shop-title>Shop</h1>
          <span class="result-count" data-result-count role="status"></span>
        </div>
        <div class="shop-tools">
          <button type="button" class="btn btn-secondary btn-sm filters-toggle" data-action="toggle-filters" aria-expanded="false" aria-controls="shop-filters">
            ${icon('filter', 16)} Filters
          </button>
          <div class="sort-wrap">
            <label for="sort-select">Sort by</label>
            <select class="input" id="sort-select" data-shop-sort>
              ${SORTS.map((s) => `<option value="${s.id}">${s.label}</option>`).join('')}
            </select>
          </div>
        </div>
      </div>

      <div class="active-chips" data-active-chips></div>

      <div class="shop-body">
        <aside class="shop-filters" id="shop-filters" aria-label="Product filters">
          <div class="shop-filters-head">
            <h2>Filters</h2>
            <button type="button" class="btn btn-ghost btn-sm" data-action="clear-filters">Clear all</button>
          </div>
          <fieldset class="filter-group"><legend>Category</legend>${catOptions}</fieldset>
          <fieldset class="filter-group"><legend>Price</legend>${priceOptions}</fieldset>
          <fieldset class="filter-group"><legend>Availability</legend>
            <label class="filter-option"><input type="checkbox" name="stock" value="in"><span>In stock</span></label>
            <label class="filter-option"><input type="checkbox" name="stock" value="out"><span>Out of stock</span></label>
          </fieldset>
        </aside>

        <div>
          <div class="product-grid" data-shop-grid aria-live="polite"></div>
        </div>
      </div>
    </div>
  </section>`;
}

export function mount(params) {
  syncInputsFromParams(params);
  apply(params, !loadedOnce);
  loadedOnce = true;
}

/** Apply filter state from a fresh URL (used by chips & back/forward). */
export function applyFromURL(params) {
  setQueryParams(params);
  syncInputsFromParams(params);
  apply(params, false);
}

function listParam(params, key) {
  return (params.get(key) || '').split(',').filter(Boolean);
}

function syncInputsFromParams(params) {
  const cats = listParam(params, 'cat');
  const prices = listParam(params, 'price');
  const stocks = listParam(params, 'stock');
  $$('#shop-filters input[type="checkbox"]').forEach((input) => {
    const list = input.name === 'cat' ? cats : input.name === 'price' ? prices : stocks;
    input.checked = list.includes(input.value);
  });
  const sortSel = $('[data-shop-sort]');
  const sort = params.get('sort');
  if (sortSel) sortSel.value = SORTS.some((s) => s.id === sort) ? sort : 'recommended';
}

function filteredProducts(params) {
  const q = (params.get('q') || '').trim().toLowerCase();
  const cats = listParam(params, 'cat');
  const prices = listParam(params, 'price');
  const stocks = listParam(params, 'stock');

  let list = PRODUCTS.filter((p) => {
    if (cats.length && !cats.includes(p.category)) return false;
    if (prices.length && !prices.some((id) => PRICE_BUCKETS.find((b) => b.id === id)?.test(p))) return false;
    if (stocks.length) {
      const inStock = availableStock(p.id) > 0;
      if (stocks.includes('in') && stocks.includes('out')) { /* both — no filter */ }
      else if (stocks.includes('in') && !inStock) return false;
      else if (stocks.includes('out') && inStock) return false;
    }
    if (q) {
      const hay = `${p.name} ${p.category} ${getCategory(p.category).name} ${p.description} ${(p.badge || '')}`.toLowerCase();
      if (!hay.includes(q)) return false;
    }
    return true;
  });

  switch (params.get('sort')) {
    case 'price-asc': list.sort((a, b) => a.price - b.price); break;
    case 'price-desc': list.sort((a, b) => b.price - a.price); break;
    case 'newest': list.sort((a, b) => b.addedAt.localeCompare(a.addedAt)); break;
    case 'rating': list.sort((a, b) => b.rating - a.rating || b.reviews - a.reviews); break;
    default: list.sort((a, b) => a.featured - b.featured);
  }
  return list;
}

function apply(params, withSkeleton) {
  const grid = $('[data-shop-grid]');
  const countEl = $('[data-result-count]');
  const titleEl = $('[data-shop-title]');
  const chipsEl = $('[data-active-chips]');
  if (!grid) return;

  const q = (params.get('q') || '').trim();
  const cats = listParam(params, 'cat');
  if (titleEl) {
    titleEl.textContent = q
      ? `Results for “${q}”`
      : cats.length === 1
        ? getCategory(cats[0])?.name || 'Shop'
        : cats.length > 1 ? 'Shop' : 'All products';
  }

  const renderList = () => {
    const list = filteredProducts(params);
    if (countEl) countEl.textContent = `${list.length} product${list.length === 1 ? '' : 's'} found`;
    grid.innerHTML = list.length
      ? list.map(productCard).join('')
      : `<div class="empty-state" style="grid-column:1/-1">
           ${icon('search', 40)}
           <h3>No products found.</h3>
           <p>${q ? 'No products found. Try another search.' : 'Try removing a filter or two.'}</p>
           <button type="button" class="btn btn-primary" data-action="clear-filters">Clear all filters</button>
         </div>`;
  };

  if (withSkeleton) {
    grid.innerHTML = Array.from({ length: 8 }, productCardSkeleton).join('');
    countEl.textContent = 'Loading products...';
    setTimeout(renderList, 380);
  } else {
    renderList();
  }

  /* active filter chips */
  const chips = [];
  if (q) chips.push({ label: `“${q}”`, clear: 'q' });
  cats.forEach((c) => chips.push({ label: getCategory(c)?.name || c, clear: 'cat', value: c }));
  listParam(params, 'price').forEach((id) => chips.push({ label: PRICE_BUCKETS.find((b) => b.id === id)?.label || id, clear: 'price', value: id }));
  listParam(params, 'stock').forEach((v) => chips.push({ label: v === 'in' ? 'In stock' : 'Out of stock', clear: 'stock', value: v }));
  if (chipsEl) {
    chipsEl.innerHTML = chips.map((c) => `
      <button type="button" class="chip" data-action="remove-chip" data-key="${c.clear}" data-value="${esc(c.value || '')}" aria-label="Remove filter ${esc(c.label)}">
        ${esc(c.label)} ${icon('close', 13)}
      </button>`).join('');
  }
}

/** Rebuild URL params from the current checkbox/sort state, then re-apply. */
export function syncFromInputs() {
  const params = new URLSearchParams();
  const q = parseHash().params.get('q');
  if (q) params.set('q', q);

  const read = (name) => $$(`#shop-filters input[name="${name}"]:checked`).map((i) => i.value);
  const cats = read('cat'); if (cats.length) params.set('cat', cats.join(','));
  const prices = read('price'); if (prices.length) params.set('price', prices.join(','));
  const stocks = read('stock'); if (stocks.length) params.set('stock', stocks.join(','));
  const sort = $('[data-shop-sort]')?.value;
  if (sort && sort !== 'recommended') params.set('sort', sort);

  setQueryParams(params);
  apply(params, false);
}

export function clearFilters() {
  $$('#shop-filters input[type="checkbox"]').forEach((i) => (i.checked = false));
  const sortSel = $('[data-shop-sort]');
  if (sortSel) sortSel.value = 'recommended';
  syncFromInputs();
}
