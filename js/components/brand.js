/* Brand lockup — the ItsZhop logo.

   `assets/img/brand/logo.png` is the single source of truth for every logo
   shown by the site. The header and footer deliberately load that file
   directly, rather than a generated copy, so replacing logo.png on GitHub is
   enough to update the live site after GitHub Pages finishes deploying.

   The compact square in the navigation focuses the upper, pictorial part of
   the supplied artwork. The store name and optional tagline remain live text
   beside it so they stay crisp and accessible at small sizes.

   If the image fails to load the <img> removes itself and the SVG yarn mark
   shows instead, so the header never renders broken. */
import { icon } from './icons.js';

export const LOGO_MASTER = 'assets/img/brand/logo.png';
export const LOGO_LOCKUP = LOGO_MASTER;

/** Square logo mark. `size` is the rendered box in px. */
export function brandMark(size = 40) {
  return `<span class="brand-mark" style="--mark-size:${size}px">
    <img class="brand-logo-img" src="${LOGO_MASTER}"
         alt="" width="1624" height="968" decoding="async" onerror="this.remove()">
    <span class="brand-mark-fallback">${icon('yarn', Math.round(size * 0.58))}</span>
  </span>`;
}

/** Logo mark + live ItsZhop wordmark (+ optional tagline). */
export function brandLockup({ size = 40, tagline = false } = {}) {
  return `${brandMark(size)}
    <span class="brand-text">
      <span class="brand-word"><span class="its">Its</span><span class="zhop"><b>Z</b>hop</span></span>
      ${tagline ? '<span class="brand-tagline">Shop More. Smile More.</span>' : ''}
    </span>`;
}

/** Main header logo spanning both header rows without cropping. */
export function headerBrandLogo() {
  return `<a class="header-logo-link" href="#/" aria-label="ItsZhop &amp; A-Akh home">
    <span class="header-logo-box">
      <img class="header-logo-img" src="${LOGO_MASTER}"
           alt="ItsZhop and A-Akh logo" width="1624" height="968" decoding="async" onerror="this.remove()">
      <span class="brand-mark-fallback">${icon('yarn', 40)}</span>
    </span>
  </a>`;
}
