/* About page. */
import { icon } from '../components/icons.js';

export const title = 'About — ItsZhop';

export function render() {
  return `
  <section class="section">
    <div class="container">
      <div class="about-teaser">
        <img src="assets/img/products/about-craft.jpg" alt="Crochet bag in progress with yarn and crochet hook" loading="lazy">
        <div>
          <span class="eyebrow">Our story</span>
          <h1>Made slowly, by hand, for people we’ll probably never meet — and still care about.</h1>
          <p class="muted">ItsZhop started in 2023 at a kitchen table in Coimbatore: one crochet hook, a jar of amma’s mango pickle, and a market bag stitched from an old saree. Neighbours asked for one, then ten, then a hundred.</p>
          <p class="muted">Today we are a small circle of makers — three crochet artists, two tailors and one very serious pickle auntie. We don’t do factories or deadlines. A teddy is done when it’s done; a pickle is ready when the sun says so.</p>
          <p class="muted">What we promise is simple: honest materials, fair prices in rupees, and things that arrive wrapped like a gift — because they are.</p>
        </div>
      </div>
    </div>
  </section>

  <section class="section" style="background:var(--surface);border-block:1px solid var(--border)">
    <div class="container">
      <div class="section-head"><div><span class="eyebrow">What we stand for</span><h2>Quality, simplicity, satisfaction</h2></div></div>
      <div class="values-grid">
        <div class="value-card">
          ${icon('yarn', 30)}
          <h3>Handmade, always</h3>
          <p>Every toy is crocheted stitch by stitch, every bag sewn on a single-needle machine, every pickle sun-cured in glass. Machines are for washing dishes.</p>
        </div>
        <div class="value-card">
          ${icon('leaf', 30)}
          <h3>Honest materials</h3>
          <p>Cotton yarn, natural jute, cold-pressed oils and vegetables from the local market. If we wouldn’t give it to our own kids, we won’t sell it to you.</p>
        </div>
        <div class="value-card">
          ${icon('heart', 30)}
          <h3>People over profit</h3>
          <p>Fair pay for our makers, simple prices for you, and a returns policy written in plain language. If something’s wrong, we make it right — quickly.</p>
        </div>
      </div>
      <div style="text-align:center;margin-top:var(--space-6)">
        <a class="btn btn-primary" href="#/shop">Shop the collection ${icon('arrow-right', 17)}</a>
      </div>
    </div>
  </section>`;
}
