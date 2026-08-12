/* Brand lockup — the ItsZhop logo image + wordmark.
   The logo (assets/img/brand/logo.png) is used exactly as supplied:
   never cropped, recoloured or masked — only scaled proportionally
   (object-fit: contain) so the full artwork is always visible.

   logo-96/192/512.png are pixel-identical downscales of that same file,
   served via srcset so a 40px header mark doesn't download 3.4 MB.
   If the images ever fail, the <img> removes itself and the original SVG
   yarn mark shows instead, so the header never renders broken. */
import { icon } from './icons.js';

export const LOGO_SRC = 'assets/img/brand/logo.png';

const SRCSET = [
  'assets/img/brand/logo-96.png 96w',
  'assets/img/brand/logo-192.png 192w',
  'assets/img/brand/logo-512.png 512w',
  `${LOGO_SRC} 1254w`,
].join(', ');

/** Logo mark only (square, uncropped). `size` is the rendered box in px. */
export function brandMark(size = 40) {
  return `<span class="brand-mark" style="--mark-size:${size}px">
    <img class="brand-logo-img" src="assets/img/brand/logo-192.png"
         srcset="${SRCSET}" sizes="${size}px"
         alt="" width="${size}" height="${size}" decoding="async" onerror="this.remove()">
    <span class="brand-mark-fallback">${icon('yarn', Math.round(size * 0.58))}</span>
  </span>`;
}

/** Full brand lockup: logo mark + ItsZhop wordmark. */
export function brandLockup({ size = 40, tagline = false } = {}) {
  return `${brandMark(size)}
    <span class="brand-text">
      <span class="brand-word"><span class="its">Its</span><span class="zhop"><b>Z</b>hop</span></span>
      ${tagline ? '<span class="brand-tagline">Style Starts Here</span>' : ''}
    </span>`;
}
