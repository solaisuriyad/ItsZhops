/* Currency & number helpers — Indian Rupee formatting, integer-safe math. */

const inr = new Intl.NumberFormat('en-IN', {
  style: 'currency',
  currency: 'INR',
  maximumFractionDigits: 0,
});

/** Format an integer rupee amount, e.g. 1299 -> "₹1,299" */
export function formatINR(amount) {
  return inr.format(Math.round(Number(amount) || 0));
}

export function clamp(n, min, max) {
  return Math.min(max, Math.max(min, n));
}

/** Whole-number parse that rejects NaN / negatives for quantities. */
export function toSafeQty(value, max = 99) {
  const n = Math.floor(Number(value));
  if (!Number.isFinite(n) || n < 1) return 1;
  return Math.min(n, max);
}

export function discountPct(price, mrp) {
  if (!mrp || mrp <= price) return 0;
  return Math.round(((mrp - price) / mrp) * 100);
}
