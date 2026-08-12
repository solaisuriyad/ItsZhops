/* Brand lockup — the ItsZhop logo image + wordmark.
   The logo file (assets/img/brand/logo.png) is used exactly as supplied:
   never cropped, recoloured or masked — only scaled proportionally
   (object-fit: contain) so the full artwork is always visible.
   If the file is ever missing, the <img> removes itself and the original
   SVG yarn mark shows instead, so the header never renders broken. */
import { icon } from './icons.js';

export const LOGO_SRC = 'assets/img/brand/logo.png';

/** Logo mark only (square, uncropped). `size` is the rendered box in px. */
export function brandMark(size = 38) {
  return `<span class="brand-mark" style="--mark-size:${size}px">
    <img class="brand-logo-img" src="${LOGO_SRC}" alt="" width="${size}" height="${size}" decoding="async" onerror="this.remove()">
    <span class="brand-mark-fallback">${icon('yarn', Math.round(size * 0.58))}</span>
  </span>`;
}

/** Full brand lockup: logo mark + ItsZhop wordmark. */
export function brandLockup({ size = 38, tagline = false } = {}) {
  return `${brandMark(size)}
    <span class="brand-text">
      <span class="brand-word"><span class="its">Its</span><span class="zhop"><b>Z</b>hop</span></span>
      ${tagline ? '<span class="brand-tagline">Style Starts Here</span>' : ''}
    </span>`;
}
