/* Smoke test: render every page server-side-style (no DOM needed) to catch runtime errors. */
import assert from 'node:assert/strict';

const P = (params = {}) => new URLSearchParams(params);

const home = await import('../js/pages/home.js');
const shop = await import('../js/pages/shop.js');
const product = await import('../js/pages/product.js');
const cartPage = await import('../js/pages/cart.js');
const checkout = await import('../js/pages/checkout.js');
const wishlist = await import('../js/pages/wishlist.js');
const about = await import('../js/pages/about.js');
const contact = await import('../js/pages/contact.js');
const orders = await import('../js/pages/orders.js');
const orderSuccess = await import('../js/pages/order-success.js');
const policies = await import('../js/pages/policies.js');
const notfound = await import('../js/pages/notfound.js');
const header = await import('../js/components/header.js');
const footer = await import('../js/components/footer.js');
const drawer = await import('../js/components/cart-drawer.js');

const cases = [
  ['home', home.render(P()), 'Shop Now'],
  ['shop', shop.render(P()), 'Filters'],
  ['product', product.render(P({ id: 'cr-teddy' })), 'Add to Cart'],
  ['product-missing', product.render(P({ id: 'nope' })), 'Product not found'],
  ['cart-empty', cartPage.render(P()), 'Your cart is empty.'],
  ['checkout-empty', checkout.render(P()), 'Nothing to check out'],
  ['wishlist-empty', wishlist.render(P()), 'Your wishlist is empty.'],
  ['about', about.render(P()), 'Our story'],
  ['contact', contact.render(P()), 'Send Message'],
  ['orders-empty', orders.render(P()), 'No orders yet.'],
  ['order-missing', orderSuccess.render(P({ id: 'ZHP-XXX' })), 'Order not found'],
  ['policy', policies.render(P({ slug: 'shipping' })), 'Shipping Information'],
  ['policy-missing', policies.render(P({ slug: 'nope' })), 'Page not found'],
  ['notfound', notfound.render(P()), '404'],
  ['header', header.renderHeader(), 'ItsZhop'],
  ['footer', footer.renderFooter(), 'Customer Support'],
  ['drawer', drawer.renderDrawer(), 'Shopping cart'],
];

for (const [name, html, marker] of cases) {
  assert.ok(typeof html === 'string' && html.includes(marker), `${name} render missing "${marker}"`);
  assert.ok(!html.includes('undefined'), `${name} contains literal "undefined"`);
  assert.ok(!html.includes('NaN'), `${name} contains literal "NaN"`);
}

/* Branding must use the replaceable master directly, never a stale derivative. */
const headerHtml = header.renderHeader();
const footerHtml = footer.renderFooter();
for (const html of [headerHtml, footerHtml]) {
  assert.ok(html.includes('assets/img/brand/logo.png'), 'brand is not using logo.png');
  assert.ok(!html.includes('assets/img/brand/mark-'), 'brand still references a generated mark');
}

/* INR formatting sanity */
const { formatINR } = await import('../js/lib/format.js');
assert.equal(formatINR(1299), '₹1,299');
assert.equal(formatINR(199), '₹199');

console.log('✓ render smoke: all pages render cleanly');
