/* Accessible star rating with fractional fill. */
import { star } from './icons.js';

export function rating(ratingValue, reviews) {
  const pct = Math.max(0, Math.min(100, (ratingValue / 5) * 100));
  const five = star() + star() + star() + star() + star();
  return `
    <span class="rating" role="img" aria-label="Rated ${ratingValue} out of 5${reviews != null ? ` from ${reviews} reviews` : ''}">
      <span class="stars" aria-hidden="true">${five}<span class="fill" style="width:${pct}%">${five}</span></span>
      <span class="val" aria-hidden="true">${ratingValue.toFixed(1)}</span>
      ${reviews != null ? `<span class="count" aria-hidden="true">(${reviews})</span>` : ''}
    </span>`;
}
