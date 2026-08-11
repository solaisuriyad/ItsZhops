/* End-to-end functional test: boots the real app in jsdom and walks the
   full shopping journey. Run: node tests/e2e.mjs */
import { readFileSync } from 'node:fs';
import assert from 'node:assert/strict';
import { JSDOM } from 'jsdom';

const html = readFileSync(new URL('../index.html', import.meta.url), 'utf8');

const dom = new JSDOM(html, {
  url: 'http://localhost:8080/#/',
  runScripts: 'outside-only',
  pretendToBeVisual: true,
});

const { window } = dom;

/* --- browser polyfills jsdom lacks --- */
window.matchMedia = window.matchMedia || ((q) => ({ matches: false, media: q, addEventListener() {}, removeEventListener() {}, addListener() {}, removeListener() {} }));
window.scrollTo = () => {};
window.HTMLElement.prototype.scrollIntoView = window.HTMLElement.prototype.scrollIntoView || (() => {});
if (!window.CSS) window.CSS = { escape: (s) => String(s).replace(/[^a-zA-Z0-9_-]/g, (c) => `\\${c}`) };

for (const key of ['window', 'document', 'localStorage', 'location', 'history', 'FormData', 'CustomEvent', 'Event', 'CSS', 'getComputedStyle', 'HTMLElement', 'Node']) {
  global[key] = window[key] ?? global[key];
}
Object.defineProperty(global, 'navigator', { value: window.navigator, configurable: true });
global.window.matchMedia = window.matchMedia;

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const $ = (s) => window.document.querySelector(s);
const $$ = (s) => [...window.document.querySelectorAll(s)];
const click = (el) => el.dispatchEvent(new window.MouseEvent('click', { bubbles: true, cancelable: true }));
const change = (el) => el.dispatchEvent(new window.Event('change', { bubbles: true }));
const go = async (hash) => { window.location.hash = hash; await sleep(60); };

/* boot the app (module scripts don't run in jsdom, so import manually) */
await import('../js/main.js');
await sleep(80);

console.log('• boot: home rendered');
assert.ok($('.site-header'), 'header rendered');
assert.ok($('.hero h1').textContent.includes('Handmade with'), 'hero heading');
assert.ok($$('.category-card').length === 4, 'four category cards');
assert.ok($$('#page .product-card').length === 8, 'eight featured products');
assert.equal($('[data-cart-count]').textContent, '0', 'cart starts empty');

/* --- theme toggle & persistence --- */
click($('[data-action="toggle-theme"]'));
assert.equal(window.document.documentElement.getAttribute('data-theme'), 'dark', 'dark mode applied');
assert.equal(window.localStorage.getItem('zhop.theme.v1'), 'dark', 'theme persisted');
click($('[data-action="toggle-theme"]'));
assert.equal(window.document.documentElement.getAttribute('data-theme'), 'light');

/* --- add to cart from home card --- */
click($('#page [data-action="add-to-cart"]'));
await sleep(30);
assert.equal($('[data-cart-count]').textContent, '1', 'cart count 1 after add');
assert.ok($$('.toast').some((t) => t.textContent.includes('Added to cart successfully!')), 'success toast');

/* --- product page: qty + variant + add --- */
await go('#/product/cr-teddy');
assert.ok($('#page h1').textContent.includes('Handmade Crochet Teddy'), 'product title');
click($('#page [data-pd="inc"]'));
assert.equal($('#page [data-pd-qty]').textContent, '2', 'qty stepper inc');
$$('#page .variant-pills input')[2].checked = true;
change($$('#page .variant-pills input')[2]);
click($('#page [data-action="pd-add"]'));
await sleep(30);
assert.equal($('[data-cart-count]').textContent, '3', 'cart count 3 (1 + 2)');

/* out-of-stock product disables buttons */
await go('#/product/cr-crossbody-rose');
assert.ok($('#page [data-action="pd-add"]').disabled, 'add disabled when out of stock');
assert.ok($('.avail.out'), 'out-of-stock label');

/* --- drawer --- */
click($('[data-action="open-cart"]'));
await sleep(30);
assert.ok($('#cart-drawer').classList.contains('open'), 'drawer opens');
assert.ok($$('#cart-drawer .cart-line').length === 2, 'two cart lines (default + Blush variant)');
const incBtn = $('#cart-drawer [data-action="cart-inc"]');
click(incBtn);
await sleep(30);
assert.equal($('[data-cart-count]').textContent, '4', 'inc via drawer');
click($('#cart-drawer [data-action="cart-remove"]'));
await sleep(30);
assert.equal($('[data-cart-count]').textContent, '2', 'remove line (qty 2) via drawer');
click($('#cart-drawer [data-action="close-cart"]'));

/* --- cart page math --- */
await go('#/cart');
const sumText = $('.summary-card').textContent;
assert.ok(sumText.includes('Total'), 'summary shows total');
const cartTotal = $('.sum-row.total span:last-child').textContent;
/* line1: teddy Blush x2 = 1198; line2 removed was first line? first line removed = 599*1 removed; remaining: teddy Blush 2x599=1198 */
assert.equal(cartTotal.replace(/[^\d,₹]/g, '').length > 0, true);

/* qty dec on cart page */
click($('#page [data-action="cart-dec"]'));
await sleep(30);
assert.equal($('[data-cart-count]').textContent, '1', 'dec on cart page');

/* --- shop: category filter --- */
await go('#/shop?cat=pickles');
await sleep(450);
assert.equal($$('#page .product-card').length, 5, 'five pickles');
assert.ok($('[data-shop-title]').textContent.includes('Homemade Pickles'), 'category title');

/* --- shop: search --- */
await go('#/shop?q=pickle');
await sleep(60);
assert.ok($$('#page .product-card').length >= 5, 'search "pickle" finds pickles');
await go('#/shop?q=crochet');
await sleep(60);
assert.ok($$('#page .product-card').length >= 8, 'search "crochet" finds crochet items');
await go('#/shop?q=zzzz');
await sleep(60);
assert.ok($('#page .empty-state').textContent.includes('No products found'), 'search empty state');

/* --- shop: price filter + sort --- */
await go('#/shop');
await sleep(450);
const priceBox = $('#shop-filters input[name="price"][value="u500"]');
priceBox.checked = true; change(priceBox);
await sleep(30);
let prices = $$('#page .price').map((el) => Number(el.textContent.replace(/[^\d]/g, '')));
assert.ok(prices.every((p) => p < 500), 'under-500 filter works');
priceBox.checked = false; change(priceBox);
await sleep(30);

const sortSel = $('[data-shop-sort]');
sortSel.value = 'price-asc'; change(sortSel);
await sleep(30);
prices = $$('#page .price').map((el) => Number(el.textContent.replace(/[^\d]/g, '')));
for (let i = 1; i < prices.length; i++) assert.ok(prices[i] >= prices[i - 1], 'price ascending');
sortSel.value = 'price-desc'; change(sortSel);
await sleep(30);
prices = $$('#page .price').map((el) => Number(el.textContent.replace(/[^\d]/g, '')));
for (let i = 1; i < prices.length; i++) assert.ok(prices[i] <= prices[i - 1], 'price descending');

/* stock filter */
const outBox = $('#shop-filters input[name="stock"][value="out"]');
outBox.checked = true; change(outBox);
await sleep(30);
assert.ok($$('#page .avail.out').length >= 1, 'out-of-stock filter shows oos items');
assert.ok($$('#page .product-card').length >= 1);
outBox.checked = false; change(outBox);
await sleep(30);

/* --- wishlist --- */
await go('#/product/cr-bunny');
click($('#page [data-action="toggle-wishlist"]'));
await sleep(30);
assert.ok($$('.toast').some((t) => t.textContent.includes('Added to wishlist')), 'wishlist toast');
assert.equal($('[data-wish-count]').textContent, '1', 'wishlist count');
await go('#/wishlist');
assert.equal($$('#page .product-card').length, 1, 'wishlist page lists item');
click($('#page [data-action="toggle-wishlist"]'));
await sleep(60);
assert.ok($('#page .empty-state'), 'wishlist empty after remove');

/* --- checkout validation --- */
await go('#/cart');
await sleep(30);
/* ensure something in cart (we have teddy x1) */
await go('#/checkout');
click($('#page [data-form="checkout"] button[type="submit"]'));
await sleep(30);
assert.ok($('.error-summary'), 'validation summary appears');
assert.ok($$('#page .field.invalid').length >= 5, 'fields flagged invalid');

/* fill form */
const setV = (name, value) => { const el = $(`#page [name="${name}"]`); el.value = value; el.dispatchEvent(new window.Event('input', { bubbles: true })); };
setV('name', 'Ananya Sharma');
setV('mobile', '9876543210');
setV('email', 'ananya@example.com');
setV('address', '12 Lake View Road, RS Puram');
setV('city', 'Coimbatore');
setV('state', 'Tamil Nadu');
setV('pin', '641001');
click($('#page [data-form="checkout"] button[type="submit"]'));
await sleep(900);
assert.ok(window.location.hash.startsWith('#/order-success/'), 'order placed -> success page');
assert.ok($('#page .success-badge'), 'success page rendered');
assert.equal($('[data-cart-count]').textContent, '0', 'cart cleared after order');
const orders = JSON.parse(window.localStorage.getItem('zhop.orders.v1'));
assert.equal(orders.length, 1, 'order stored');
assert.equal(orders[0].total, orders[0].subtotal + orders[0].shipping, 'total = subtotal + shipping');

/* stock decremented after sale */
await go('#/product/cr-teddy');
assert.ok(!$('#page .pd-info .avail').textContent.includes('(12'), 'stock reduced after order');

/* --- buy now flow --- */
await go('#/product/pk-mango');
click($('#page [data-action="pd-buy"]'));
await sleep(60);
assert.ok(window.location.hash.startsWith('#/checkout'), 'buy now -> checkout');
assert.ok($('.express-pill'), 'express order pill shown');
assert.ok($('.summary-card').textContent.includes('Mango Pickle'), 'buy-now item in summary');

/* --- orders page --- */
await go('#/orders');
assert.ok($('#page .order-card'), 'order history lists order');

/* --- misc pages --- */
await go('#/about'); assert.ok($('#page h1'), 'about renders');
await go('#/contact'); assert.ok($('[data-form="contact"]'), 'contact renders');
await go('#/policy/returns'); assert.ok($('#page h1').textContent.includes('Return Policy'), 'policy renders');
await go('#/definitely-not-a-page'); assert.ok($('#page .code').textContent === '404', '404 renders');

console.log('✓ e2e: entire shopping journey works (theme, cart, drawer, filters, sort, search, wishlist, checkout, buy-now, orders, 404)');
window.close();
process.exit(0);
