/* Pure cart logic — no browser APIs, fully unit-testable.
   A cart is an array of lines: { id, variant, qty }
   Stock lookups are injected so this module stays data-agnostic. */

export const lineKey = (line) => `${line.id}::${line.variant || ''}`;

function sanitize(items) {
  return (Array.isArray(items) ? items : [])
    .filter((l) => l && typeof l.id === 'string' && Number.isFinite(+l.qty))
    .map((l) => ({ id: l.id, variant: l.variant || '', qty: Math.max(1, Math.floor(+l.qty)) }));
}

/** qtyInCartForProduct: total qty of a product id across variant lines. */
export function qtyForProduct(items, id) {
  return items.reduce((s, l) => (l.id === id ? s + l.qty : s), 0);
}

/**
 * Add to cart. Returns { items, added, message, ok }
 * - merges into an existing line with same id+variant
 * - never exceeds available stock
 */
export function addToCart(items, { id, variant = '', qty = 1 }, availableFor) {
  const clean = sanitize(items);
  const avail = availableFor(id);
  if (avail <= 0) {
    return { items: clean, added: 0, ok: false, message: 'Sorry, this product is out of stock.' };
  }
  const want = Math.max(1, Math.floor(qty) || 1);
  const already = qtyForProduct(clean, id);
  if (already >= avail) {
    return { items: clean, added: 0, ok: false, message: `Only ${avail} in stock — all available units are already in your cart.` };
  }
  const canAdd = Math.min(want, avail - already);
  const key = `${id}::${variant || ''}`;
  const existing = clean.find((l) => lineKey(l) === key);
  if (existing) existing.qty += canAdd;
  else clean.push({ id, variant: variant || '', qty: canAdd });
  const clamped = canAdd < want;
  return {
    items: clean,
    added: canAdd,
    ok: true,
    clamped,
    message: clamped ? `Only ${avail} in stock — added ${canAdd}.` : '',
  };
}

/** Change quantity of a line; clamps to [1, availableFor(id) minus other lines]. */
export function setQty(items, { id, variant = '', qty }, availableFor) {
  const clean = sanitize(items);
  const key = `${id}::${variant || ''}`;
  const line = clean.find((l) => lineKey(l) === key);
  if (!line) return { items: clean, changed: false };
  const others = qtyForProduct(clean, id) - line.qty;
  const max = Math.max(1, availableFor(id) - others);
  const next = Math.min(Math.max(1, Math.floor(qty) || 1), max);
  const changed = next !== line.qty;
  line.qty = next;
  return { items: clean, changed, atMax: next === max && max < qty };
}

export function removeLine(items, { id, variant = '' }) {
  const key = `${id}::${variant || ''}`;
  return sanitize(items).filter((l) => lineKey(l) !== key);
}

export function totals(items, { priceFor, shipping }) {
  const lines = sanitize(items).map((l) => {
    const unit = priceFor(l.id);
    return { ...l, unit, total: unit * l.qty };
  });
  const count = lines.reduce((s, l) => s + l.qty, 0);
  const subtotal = lines.reduce((s, l) => s + l.total, 0); // integer rupees — no float drift
  const ship = lines.length === 0 ? 0 : shipping(subtotal);
  return { lines, count, subtotal, shipping: ship, total: subtotal + ship };
}
