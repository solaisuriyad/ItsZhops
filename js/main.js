/* ItsZhop app bootstrap: routing, global actions, cross-component sync. */
import { $, $$ } from './lib/dom.js';
import { on, Events } from './lib/bus.js';
import { isEmail } from './lib/validate.js';
import { parseHash, navigate } from './router.js';

import { renderHeader, updateHeaderCounts, updateThemeIcon, setActiveNav, toggleCatsDropdown, closeCatsDropdown, setMobileMenu, setMobileSearch } from './components/header.js';
import { renderFooter } from './components/footer.js';
import { renderDrawer, setDrawer, isOpen as drawerOpen, renderDrawerBody } from './components/cart-drawer.js';
import { toast } from './components/toast.js';

import * as theme from './state/theme.js';
import * as cart from './state/cart.js';
import * as wishlist from './state/wishlist.js';
import * as session from './state/session.js';

import * as home from './pages/home.js';
import * as shop from './pages/shop.js';
import * as product from './pages/product.js';
import * as cartPage from './pages/cart.js';
import * as checkout from './pages/checkout.js';
import * as wishlistPage from './pages/wishlist.js';
import * as about from './pages/about.js';
import * as contact from './pages/contact.js';
import * as orders from './pages/orders.js';
import * as orderSuccess from './pages/order-success.js';
import * as policies from './pages/policies.js';
import * as notfound from './pages/notfound.js';

/* ---------------- routing ---------------- */
const ROUTES = [
  { path: '/', page: home },
  { path: '/shop', page: shop },
  { path: '/product/:id', page: product },
  { path: '/cart', page: cartPage },
  { path: '/checkout', page: checkout },
  { path: '/wishlist', page: wishlistPage },
  { path: '/about', page: about },
  { path: '/contact', page: contact },
  { path: '/orders', page: orders },
  { path: '/order-success/:id', page: orderSuccess },
  { path: '/policy/:slug', page: policies },
];

let current = null; // { page, params, path }

function matchRoute(path) {
  for (const r of ROUTES) {
    const rp = r.path.split('/');
    const pp = path.split('/');
    if (rp.length !== pp.length) continue;
    const params = {};
    let ok = true;
    for (let i = 0; i < rp.length; i++) {
      if (rp[i].startsWith(':')) params[rp[i].slice(1)] = decodeURIComponent(pp[i]);
      else if (rp[i] !== pp[i]) { ok = false; break; }
    }
    if (ok) return { page: r.page, routeParams: params };
  }
  return { page: notfound, routeParams: {} };
}

function renderRoute() {
  const { path, params } = parseHash();
  const { page, routeParams } = matchRoute(path);

  /* merge path params (e.g. :id) into query params for pages */
  const merged = new URLSearchParams(params);
  for (const [k, v] of Object.entries(routeParams)) merged.set(k, v);

  current = { page, params: merged, path };

  $('#page').innerHTML = page.render(merged);
  document.title = page.title || 'ItsZhop';

  setActiveNav(path);
  closeCatsDropdown();
  setMobileMenu(false);
  setMobileSearch(false);
  setDrawer(false);
  window.scrollTo({ top: 0, behavior: 'instant' });

  page.mount?.(merged);
}

/* ---------------- global click actions ---------------- */
function handleAction(el) {
  const action = el.dataset.action;
  const id = el.dataset.id || '';
  const variant = el.dataset.variant || '';

  switch (action) {
    case 'toggle-theme':
      theme.toggle();
      break;

    case 'open-cart':
      setDrawer(true);
      break;
    case 'close-cart':
      setDrawer(false);
      break;
    case 'close-cart-and-shop':
      setDrawer(false);
      navigate('#/shop');
      break;
    case 'close-cart-nav':
      setDrawer(false);
      break;

    case 'toggle-menu':
      setMobileMenu(!$('#mobile-nav')?.classList.contains('open'));
      break;
    case 'close-menu':
      setMobileMenu(false);
      break;

    case 'toggle-search': {
      const desktop = window.matchMedia('(min-width: 901px)').matches;
      if (desktop) $('#hdr-search')?.focus();
      else setMobileSearch($('#mobile-search')?.hidden ?? true);
      break;
    }

    case 'toggle-cats':
      toggleCatsDropdown();
      break;

    case 'add-to-cart': {
      const res = cart.addToCart(id, 1, '');
      if (res.ok) {
        toast('Added to cart successfully!');
        if (res.clamped) toast(res.message, 'info');
      } else toast(res.message, 'error');
      break;
    }

    case 'pd-add': {
      const res = cart.addToCart(id, product.currentQty(), product.currentVariant());
      if (res.ok) {
        toast('Added to cart successfully!');
        if (res.clamped) toast(res.message, 'info');
      } else toast(res.message, 'error');
      break;
    }

    case 'pd-buy':
      session.setBuyNow([{ id, qty: product.currentQty(), variant: product.currentVariant() }]);
      navigate('#/checkout');
      break;

    case 'toggle-wishlist': {
      const added = wishlist.toggle(id);
      toast(added ? 'Added to wishlist.' : 'Removed from wishlist.', added ? 'success' : 'info');
      break;
    }

    case 'cart-inc':
      cart.setQty(id, variant, findLineQty(id, variant) + 1);
      break;
    case 'cart-dec':
      cart.setQty(id, variant, findLineQty(id, variant) - 1);
      break;
    case 'cart-remove':
      cart.removeLine(id, variant);
      toast('Product removed from cart.', 'info');
      break;
    case 'cart-clear':
      cart.clearCart();
      toast('Cart cleared.', 'info');
      break;

    case 'toggle-filters': {
      const panel = $('#shop-filters');
      const open = !panel?.classList.contains('open');
      panel?.classList.toggle('open', open);
      el.setAttribute('aria-expanded', String(open));
      break;
    }
    case 'clear-filters':
      shop.clearFilters();
      break;
    case 'remove-chip':
      removeChip(el.dataset.key, el.dataset.value);
      break;
  }
}

function findLineQty(id, variant) {
  const line = cart.getLines().find((l) => l.id === id && (l.variant || '') === variant);
  return line ? line.qty : 0;
}

function removeChip(key, value) {
  const { params } = parseHash();
  if (key === 'q') params.delete('q');
  else {
    const list = (params.get(key) || '').split(',').filter((v) => v && v !== value);
    if (list.length) params.set(key, list.join(','));
    else params.delete(key);
  }
  shop.applyFromURL(params);
}

/* ---------------- global change/submit delegation ---------------- */
document.addEventListener('change', (e) => {
  const t = e.target;
  if (t.matches('#shop-filters input[type="checkbox"]') || t.matches('[data-shop-sort]')) {
    shop.syncFromInputs();
  }
});

document.addEventListener('submit', (e) => {
  const form = e.target.closest('form[data-form]');
  if (!form) return;
  const kind = form.dataset.form;

  if (kind === 'search') {
    e.preventDefault();
    const q = new FormData(form).get('q')?.toString().trim() || '';
    navigate(q ? `#/shop?q=${encodeURIComponent(q)}` : '#/shop');
    setMobileSearch(false);
  }

  if (kind === 'newsletter') {
    e.preventDefault();
    const email = new FormData(form).get('email')?.toString().trim() || '';
    const errEl = $('#news-error');
    if (!isEmail(email)) {
      if (errEl) { errEl.textContent = 'Please enter a valid email address.'; errEl.style.display = 'block'; }
      return;
    }
    if (errEl) { errEl.textContent = ''; errEl.style.display = 'none'; }
    form.reset();
    toast('You’re on the list! We’ll email you when a new batch is ready.');
  }
});

/* ---------------- keyboard ---------------- */
document.addEventListener('keydown', (e) => {
  if (e.key !== 'Escape') return;
  if (drawerOpen()) setDrawer(false);
  else if ($('#mobile-nav')?.classList.contains('open')) setMobileMenu(false);
  else if (!$('#cats-dropdown')?.hidden) closeCatsDropdown();
  else if (!$('#mobile-search')?.hidden) setMobileSearch(false);
});

/* close category dropdown on outside click */
document.addEventListener('click', (e) => {
  const inside = e.target.closest('[data-action="toggle-cats"], #cats-dropdown');
  if (!inside && !$('#cats-dropdown')?.hidden) closeCatsDropdown();

  const actionEl = e.target.closest('[data-action]');
  if (actionEl) handleAction(actionEl);
});

/* ---------------- cross-component sync ---------------- */
function refreshWithFocusRestore(fn) {
  const active = document.activeElement;
  const desc = active?.dataset?.action
    ? { action: active.dataset.action, id: active.dataset.id, variant: active.dataset.variant }
    : null;
  fn();
  if (desc) {
    const sel = `[data-action="${desc.action}"]${desc.id ? `[data-id="${desc.id}"]` : ''}${desc.variant ? `[data-variant="${desc.variant}"]` : ''}`;
    $(sel)?.focus();
  }
}

on(Events.CART_CHANGED, () => {
  updateHeaderCounts();
  if (drawerOpen()) renderDrawerBody();
  if (current?.page === cartPage) refreshWithFocusRestore(renderRoute);
});

on(Events.WISHLIST_CHANGED, (e) => {
  const { id, added } = e.detail || {};
  updateHeaderCounts();
  $$(`[data-action="toggle-wishlist"][data-id="${CSS.escape(id)}"]`).forEach((btn) => {
    btn.setAttribute('aria-pressed', String(added));
    btn.classList.toggle('active', added);
  });
  if (current?.page === wishlistPage) refreshWithFocusRestore(renderRoute);
});

on(Events.THEME_CHANGED, updateThemeIcon);

/* ---------------- boot ---------------- */
$('#header-root').innerHTML = renderHeader();
$('#footer-root').innerHTML = renderFooter();
$('#drawer-root').innerHTML = renderDrawer();
updateHeaderCounts();
updateThemeIcon();

window.addEventListener('hashchange', renderRoute);
renderRoute();
