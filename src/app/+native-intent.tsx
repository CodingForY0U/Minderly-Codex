function normalizeExpoGoPath(path: string) {
  const marker = '/--';

  if (path === marker || path === `${marker}/`) {
    return '/';
  }

  if (path.startsWith(`${marker}/`)) {
    return path.slice(marker.length);
  }

  return path;
}

export function redirectSystemPath({ path }: { path: string | null }) {
  if (!path) {
    return '/';
  }

  try {
    const url = new URL(path);
    return `${normalizeExpoGoPath(url.pathname)}${url.search}${url.hash}`;
  } catch {
    return normalizeExpoGoPath(path);
  }
}
