/* Tiny environment-agnostic event bus for cross-component updates. */

const listeners = new Map();

export function emit(name, detail) {
  for (const fn of listeners.get(name) || []) fn({ detail });
}

export function on(name, fn) {
  if (!listeners.has(name)) listeners.set(name, []);
  listeners.get(name).push(fn);
  return () => {
    const arr = listeners.get(name) || [];
    listeners.set(name, arr.filter((f) => f !== fn));
  };
}

export const Events = {
  CART_CHANGED: 'zhop:cart',
  WISHLIST_CHANGED: 'zhop:wishlist',
  THEME_CHANGED: 'zhop:theme',
  ORDER_PLACED: 'zhop:order',
};
