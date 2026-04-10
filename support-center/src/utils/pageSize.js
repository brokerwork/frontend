const KEY = "PAGE_SIZE";
let cache;
export const set = (k, size) => {
  const s = window.localStorage.getItem(KEY);
  const __obj = s ? JSON.parse(s) : {};
  __obj[k] = size;
  cache = __obj;
  window.localStorage.setItem(KEY, JSON.stringify(cache));
}

export const get = (k) => {
  if (!cache) {
    const s = window.localStorage.getItem(KEY);
    cache = s ? JSON.parse(s) : {};
  }
  return cache[k] || 20;
}
