/* Footer: brand, quick links, categories, support, socials, newsletter. */
import { CATEGORIES } from '../data/catalog.js';
import { STORE } from '../data/content.js';
import { icon } from './icons.js';
import { brandLockup } from './brand.js';

export function renderFooter() {
  return `
  <footer class="site-footer">
    <div class="container">
      <div class="footer-grid">
        <div class="footer-brand">
          <a class="brand" href="#/" aria-label="ItsZhop — Shop More. Smile More., home">
            ${brandLockup({ size: 46, tagline: true })}
          </a>
          <p>A small Indian store for handmade crochet treasures, honest bags and pickles that taste like home. Everything is made slowly, in small batches, by people who care.</p>
          <div class="social-row" aria-label="Social media">
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" aria-label="ItsZhop on Instagram (placeholder)">${icon('instagram', 18)}</a>
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" aria-label="ItsZhop on Facebook (placeholder)">${icon('facebook', 18)}</a>
            <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" aria-label="ItsZhop on YouTube (placeholder)">${icon('youtube', 18)}</a>
            <a href="https://wa.me/919876543210" target="_blank" rel="noopener noreferrer" aria-label="Chat on WhatsApp (placeholder)">${icon('whatsapp', 18)}</a>
          </div>
        </div>

        <nav aria-label="Quick links">
          <h4>Quick Links</h4>
          <ul>
            <li><a href="#/">Home</a></li>
            <li><a href="#/shop">Shop</a></li>
            <li><a href="#/about">About</a></li>
            <li><a href="#/contact">Contact</a></li>
            <li><a href="#/wishlist">Wishlist</a></li>
          </ul>
        </nav>

        <nav aria-label="Categories">
          <h4>Categories</h4>
          <ul>
            ${CATEGORIES.map((c) => `<li><a href="#/shop?cat=${c.id}">${c.name}</a></li>`).join('')}
          </ul>
        </nav>

        <div>
          <h4>Customer Support</h4>
          <ul>
            <li><a href="#/contact">Contact Us</a></li>
            <li><a href="#/policy/shipping">Shipping Information</a></li>
            <li><a href="#/policy/returns">Return Policy</a></li>
            <li><a href="#/policy/privacy">Privacy Policy</a></li>
            <li><a href="#/policy/terms">Terms &amp; Conditions</a></li>
          </ul>
          <h4 style="margin-top:20px">Get batch updates</h4>
          <form class="newsletter" data-form="newsletter">
            <label class="sr-only" for="news-email">Email address</label>
            <input class="input" id="news-email" type="email" name="email" placeholder="you@example.com" autocomplete="email">
            <button class="btn btn-primary" type="submit">Join</button>
          </form>
          <p class="field-error" id="news-error" style="margin-top:6px"></p>
        </div>
      </div>

      <div class="footer-note">
        <span>© ${new Date().getFullYear()} ${STORE.name}. Handmade with love in India.</span>
        <span>Prices in Indian Rupees (₹) • Demo store — no real payments are processed.</span>
      </div>
    </div>
  </footer>`;
}
