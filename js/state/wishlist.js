/* Wishlist: simple persisted id list. */
import { readJSON, writeJSON } from '../lib/dom.js';
import { emit, Events } from '../lib/bus.js';

const KEY = 'zhop.wishlist.v1';
let ids = readJSON(KEY, []);
if (!Array.isArray(ids)) ids = [];

export const has = (id) => ids.includes(id);
export const all = () => [...ids];
export const count = () => ids.length;

export function toggle(id) {
  if (has(id)) {
    ids = ids.filter((x) => x !== id);
    writeJSON(KEY, ids);
    emit(Events.WISHLIST_CHANGED, { id, added: false });
    return false;
  }
  ids.push(id);
  writeJSON(KEY, ids);
  emit(Events.WISHLIST_CHANGED, { id, added: true });
  return true;
}
