/* Minimal hash router: #/path?query */

export function parseHash() {
  const raw = (location.hash || '#/').replace(/^#/, '');
  const [rawPath, query = ''] = raw.split('?');
  const path = rawPath.startsWith('/') ? rawPath : `/${rawPath}`;
  return { path: path === '' ? '/' : path, params: new URLSearchParams(query) };
}

export function navigate(hash) {
  location.hash = hash;
}

export function setQueryParams(params, { replace = true } = {}) {
  const { path } = parseHash();
  const qs = params.toString();
  const url = `#${path}${qs ? `?${qs}` : ''}`;
  if (replace) history.replaceState(null, '', url);
  else location.hash = url;
}
