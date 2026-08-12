/* Brand lockup — the ItsZhop logo.

   Assets (all generated from the supplied assets/img/brand/logo.png,
   pixels untouched — no recolouring, no redrawing, only crop + scale):

     mark-96/192.png        the bag + IZ monogram, squared up, artwork
                            filling ~92% of the frame. Used wherever the
                            logo appears small (header, footer, favicon),
                            because the wordmark baked into the full logo
                            is illegible below ~120px.
     lockup-512.jpg         the complete logo incl. "ItsZhop" and the
                            "Style Starts Here" tagline, natural ratio.
                            Used for social share previews.
     logo.png               the original master file, kept as-is.

   The site's own live text renders the wordmark next to the mark, so the
   name stays crisp and selectable at every size.

   If an image fails to load the <img> removes itself and the SVG yarn
   mark shows instead, so the header never renders broken. */
import { icon } from './icons.js';

export const LOGO_MASTER = 'assets/img/brand/logo.png';
export const LOGO_LOCKUP = 'assets/img/brand/lockup-512.jpg';

const MARK_SRCSET = [
  'assets/img/brand/mark-96.png 96w',
  'assets/img/brand/mark-192.png 192w',
].join(', ');

/** Square logo mark (bag + monogram). `size` is the rendered box in px. */
export function brandMark(size = 40) {
  return `<span class="brand-mark" style="--mark-size:${size}px">
    <img class="brand-logo-img" src="assets/img/brand/mark-192.png"
         srcset="${MARK_SRCSET}" sizes="${size}px"
         alt="" width="${size}" height="${size}" decoding="async" onerror="this.remove()">
    <span class="brand-mark-fallback">${icon('yarn', Math.round(size * 0.58))}</span>
  </span>`;
}

/** Full brand lockup: logo mark + ItsZhop wordmark (+ optional tagline). */
export function brandLockup({ size = 40, tagline = false } = {}) {
  return `${brandMark(size)}
    <span class="brand-text">
      <span class="brand-word"><span class="its">Its</span><span class="zhop"><b>Z</b>hop</span></span>
      ${tagline ? '<span class="brand-tagline">Style Starts Here</span>' : ''}
    </span>`;
}
