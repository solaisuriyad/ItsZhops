/* Homepage: hero, trust strip, categories, featured products, about teaser. */
import { CATEGORIES, PRODUCTS, productsInCategory } from '../data/catalog.js';
import { productCard } from '../components/product-card.js';
import { icon } from '../components/icons.js';

export const title = 'ItsZhop — Handmade Toys, Bags & Homemade Pickles';

export function render() {
  const featured = [...PRODUCTS].sort((a, b) => a.featured - b.featured).slice(0, 8);

  const cats = CATEGORIES.map((c) => `
    <a class="category-card" href="#/shop?cat=${c.id}">
      <img src="${c.image}" alt="${c.name}" loading="lazy">
      <span class="cc-count">${productsInCategory(c.id).length} items</span>
      <span class="cc-text">
        <h3>${c.name}</h3>
        <p>${c.tagline}</p>
      </span>
    </a>`).join('');

  return `
  <section class="hero">
    <div class="container hero-inner">
      <div class="hero-copy">
        <span class="eyebrow">${icon('sparkle', 16)} Small-batch • Handmade • Indian</span>
        <h1>Handmade with <em>love</em>,<br>made for you.</h1>
        <p class="lead">Discover beautiful handmade products, stylish bags, and delicious homemade pickles — all in one place.</p>
        <div class="hero-ctas">
          <a class="btn btn-primary" href="#/shop">Shop Now ${icon('arrow-right', 18)}</a>
          <a class="btn btn-secondary" href="#/shop?cat=pickles">Taste the pickles</a>
        </div>
      </div>
      <div class="hero-media">
        <img src="assets/img/brand/hero.jpg" alt="Flat-lay of ItsZhop products: crochet teddy, jute tote, leather handbag, crochet sunflower and a jar of homemade mango pickle" fetchpriority="high">
        <div class="hero-float">${icon('heart', 18)} 4.8 average rating from 2,900+ happy customers</div>
      </div>
    </div>
  </section>

  <section class="section" style="padding-top:0">
    <div class="container">
      <div class="trust-strip">
        <div class="trust-item">${icon('truck', 26)}<div><strong>Free shipping ₹999+</strong><span>Flat ₹50 otherwise, pan-India</span></div></div>
        <div class="trust-item">${icon('yarn', 26)}<div><strong>Truly handmade</strong><span>Crocheted &amp; stitched in small batches</span></div></div>
        <div class="trust-item">${icon('leaf', 26)}<div><strong>No preservatives</strong><span>Pickles made the old way</span></div></div>
        <div class="trust-item">${icon('shield', 26)}<div><strong>7-day easy returns</strong><span>Replacements for damaged items</span></div></div>
      </div>
    </div>
  </section>

  <section class="section" style="padding-top:0">
    <div class="container">
      <div class="section-head">
        <div>
          <span class="eyebrow">Browse the store</span>
          <h2>Shop by category</h2>
        </div>
        <a class="btn btn-ghost" href="#/shop">View all products ${icon('arrow-right', 16)}</a>
      </div>
      <div class="category-grid">${cats}</div>
    </div>
  </section>

  <section class="section" style="background:var(--surface);border-block:1px solid var(--border)">
    <div class="container">
      <div class="section-head">
        <div>
          <span class="eyebrow">Loved by customers</span>
          <h2>Featured products</h2>
        </div>
      </div>
      <div class="product-grid">${featured.map(productCard).join('')}</div>
    </div>
  </section>

  <section class="section">
    <div class="container about-teaser">
      <img src="assets/img/products/about-craft.jpg" alt="Handmade crochet bag with a ball of yarn and crochet hook on a wooden table" loading="lazy">
      <div>
        <span class="eyebrow">About ItsZhop</span>
        <h2>Slow made. Well made.</h2>
        <p class="muted">ItsZhop began at a kitchen table — one crochet hook, one jar of pickle, and the belief that useful things should be made with care. Today a small circle of makers stitches our toys and bags, and our pickles still sun-cure the slow way.</p>
        <p class="muted">No factories, no shortcuts. Just honest things that last.</p>
        <a class="btn btn-secondary" href="#/about">Read our story ${icon('arrow-right', 16)}</a>
      </div>
    </div>
  </section>`;
}
