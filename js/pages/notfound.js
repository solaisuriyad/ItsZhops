/* 404 page. */
import { icon } from '../components/icons.js';

export const title = 'Page not found — ItsZhop';

export function render() {
  return `
  <section class="section"><div class="container nf-wrap">
    <div class="code">404</div>
    <h1>This shelf is empty.</h1>
    <p class="muted">The page you’re looking for doesn’t exist or has moved.</p>
    <div style="display:flex;gap:12px;justify-content:center;flex-wrap:wrap">
      <a class="btn btn-primary" href="#/">Go home ${icon('arrow-right', 16)}</a>
      <a class="btn btn-secondary" href="#/shop">Browse the shop</a>
    </div>
  </div></section>`;
}
