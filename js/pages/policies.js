/* Policy pages (shipping, returns, privacy, terms). */
import { POLICIES } from '../data/content.js';
import { esc } from '../lib/dom.js';
import { icon } from '../components/icons.js';

export const title = 'Policies — ItsZhop';

export function render(params) {
  const slug = params.get('slug');
  const doc = POLICIES[slug];
  if (!doc) {
    return `
    <section class="section"><div class="container">
      <div class="empty-state">
        ${icon('box', 40)}<h3>Page not found</h3>
        <p>The page you’re looking for doesn’t exist.</p>
        <a class="btn btn-primary" href="#/">Go home</a>
      </div>
    </div></section>`;
  }
  return `
  <section class="section" style="padding-top:28px">
    <div class="container policy-wrap">
      <nav class="breadcrumb" aria-label="Breadcrumb">
        <a href="#/">Home</a><span class="sep">/</span><span aria-current="page">${esc(doc.title)}</span>
      </nav>
      <h1>${esc(doc.title)}</h1>
      ${doc.body.map((p) => `<p class="muted">${esc(p)}</p>`).join('')}
      <p style="margin-top:var(--space-5)">Questions? <a href="#/contact">Contact us</a> — we’re happy to help.</p>
    </div>
  </section>`;
}
