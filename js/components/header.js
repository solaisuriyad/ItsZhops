/* Sticky header: brand, nav, search, theme toggle, wishlist/cart counts, mobile menu. */
import { CATEGORIES, PRODUCTS } from '../data/catalog.js';
import { count as cartCount } from '../state/cart.js';
import { count as wishCount } from '../state/wishlist.js';
import { current as theme } from '../state/theme.js';
import { esc, $ } from '../lib/dom.js';
import { icon } from './icons.js';
import { brandLockup } from './brand.js';

export function renderHeader() {
  const catLinks = CATEGORIES.map(
    (c) => `<li><a href="#/shop?cat=${c.id}"><img src="${c.image}" alt="" loading="lazy">${esc(c.name)}</a></li>`
  ).join('');
  const names = PRODUCTS.map((p) => `<option value="${esc(p.name)}">`).join('');

  return `
  <p class="announce">Free shipping on orders above ₹999 &nbsp;•&nbsp; Handmade in small batches across India</p>
  <header class="site-header">
    <div class="container header-row">
      <button type="button" class="icon-btn menu-btn" data-action="toggle-menu" aria-label="Open menu" aria-expanded="false" aria-controls="mobile-nav">${icon('menu', 22)}</button>

      <a class="brand" href="#/" aria-label="ItsZhop — Style Starts Here, home">
        ${brandLockup({ size: 40, tagline: true })}
      </a>

      <nav aria-label="Primary">
        <ul class="header-nav">
          <li><a class="nav-link" data-nav="home" href="#/">Home</a></li>
          <li><a class="nav-link" data-nav="shop" href="#/shop">Shop</a></li>
          <li>
            <button type="button" class="nav-link" data-action="toggle-cats" aria-expanded="false" aria-controls="cats-dropdown">
              Categories ${icon('chevron-down', 16)}
            </button>
            <ul class="dropdown-panel" id="cats-dropdown" hidden>${catLinks}</ul>
          </li>
          <li><a class="nav-link" data-nav="about" href="#/about">About</a></li>
          <li><a class="nav-link" data-nav="contact" href="#/contact">Contact</a></li>
        </ul>
      </nav>

      <form class="header-search" data-form="search" role="search">
        <label class="sr-only" for="hdr-search">Search products</label>
        ${icon('search', 18)}
        <input class="input" id="hdr-search" name="q" type="search" placeholder="Search toys, bags, pickles…" list="product-names" autocomplete="off">
        <datalist id="product-names">${names}</datalist>
      </form>

      <div class="header-actions">
        <button type="button" class="icon-btn" data-action="toggle-search" aria-label="Toggle search">${icon('search', 20)}</button>
        <button type="button" class="icon-btn" data-action="toggle-theme" aria-label="Switch to dark mode">${theme() === 'dark' ? icon('sun', 20) : icon('moon', 20)}</button>
        <a class="icon-btn" href="#/orders" aria-label="Your account and orders">${icon('user', 20)}</a>
        <a class="icon-btn" href="#/wishlist" aria-label="Wishlist">
          ${icon('heart', 20)}
          <span class="count-bubble" data-wish-count hidden>0</span>
        </a>
        <button type="button" class="icon-btn" data-action="open-cart" aria-label="Open cart">
          ${icon('cart', 20)}
          <span class="count-bubble zero" data-cart-count>0</span>
        </button>
      </div>
    </div>
    <div class="mobile-search" id="mobile-search" hidden>
      <form data-form="search" role="search">
        <label class="sr-only" for="mob-search">Search products</label>
        <input class="input" id="mob-search" name="q" type="search" placeholder="Search toys, bags, pickles…" list="product-names" autocomplete="off">
      </form>
    </div>
  </header>

  <div class="mobile-nav" id="mobile-nav" hidden>
    <div class="overlay" data-action="close-menu"></div>
    <div class="panel" role="dialog" aria-modal="true" aria-label="Menu">
      <div class="panel-head">
        <a class="brand" href="#/" aria-label="ItsZhop home">${brandLockup({ size: 34 })}</a>
        <button type="button" class="icon-btn" data-action="close-menu" aria-label="Close menu">${icon('close', 20)}</button>
      </div>
      <a href="#/" data-nav="home">Home</a>
      <a href="#/shop" data-nav="shop">Shop</a>
      <a href="#/about" data-nav="about">About</a>
      <a href="#/contact" data-nav="contact">Contact</a>
      <a href="#/wishlist">Wishlist</a>
      <a href="#/orders">Your Orders</a>
      <div class="cat-sub" style="margin-top:8px">
        <p class="muted" style="font-size:.78rem;font-weight:800;letter-spacing:.1em;text-transform:uppercase;margin:6px 14px;">Categories</p>
        ${CATEGORIES.map((c) => `<a href="#/shop?cat=${c.id}">${esc(c.name)}</a>`).join('')}
      </div>
    </div>
  </div>`;
}

export function updateHeaderCounts() {
  const c = cartCount();
  const cartEl = $('[data-cart-count]');
  if (cartEl) {
    cartEl.textContent = String(c);
    cartEl.classList.toggle('zero', c === 0);
    cartEl.closest('[data-action="open-cart"]')?.setAttribute('aria-label', `Open cart, ${c} item${c === 1 ? '' : 's'}`);
  }
  const w = wishCount();
  const wishEl = $('[data-wish-count]');
  if (wishEl) {
    wishEl.textContent = String(w);
    wishEl.hidden = w === 0;
  }
}

export function updateThemeIcon() {
  const btn = $('[data-action="toggle-theme"]');
  if (!btn) return;
  const dark = theme() === 'dark';
  btn.innerHTML = dark ? icon('sun', 20) : icon('moon', 20);
  btn.setAttribute('aria-label', dark ? 'Switch to light mode' : 'Switch to dark mode');
}

export function setActiveNav(path) {
  const map = { '/': 'home', '/shop': 'shop', '/about': 'about', '/contact': 'contact' };
  const key = map[path] || '';
  document.querySelectorAll('[data-nav]').forEach((el) => {
    if (el.getAttribute('data-nav') === key) el.setAttribute('aria-current', 'page');
    else el.removeAttribute('aria-current');
  });
}

/* --- dropdown / menu helpers (called from global click handler) --- */
export function toggleCatsDropdown(force) {
  const panel = $('#cats-dropdown');
  const btn = $('[data-action="toggle-cats"]');
  if (!panel || !btn) return;
  const show = force ?? panel.hidden;
  panel.hidden = !show;
  btn.setAttribute('aria-expanded', String(show));
}

export function closeCatsDropdown() { toggleCatsDropdown(false); }

export function setMobileMenu(open) {
  const nav = $('#mobile-nav');
  const btn = $('.menu-btn');
  if (!nav) return;
  nav.hidden = !open;
  nav.classList.toggle('open', open);
  btn?.setAttribute('aria-expanded', String(open));
  document.body.style.overflow = open ? 'hidden' : '';
  if (open) nav.querySelector('.panel a')?.focus();
}

export function setMobileSearch(open) {
  const row = $('#mobile-search');
  if (!row) return;
  row.hidden = !open;
  if (open) row.querySelector('input')?.focus();
}
