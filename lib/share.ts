export function encodeState(state: {
  original: string;
  modified: string;
  language: string;
}): string {
  const json = JSON.stringify(state);
  if (typeof window !== 'undefined') {
    return btoa(encodeURIComponent(json));
  }
  return Buffer.from(encodeURIComponent(json)).toString('base64');
}

export function decodeState(encoded: string): {
  original: string;
  modified: string;
  language: string;
} | null {
  try {
    let json: string;
    if (typeof window !== 'undefined') {
      json = decodeURIComponent(atob(encoded));
    } else {
      json = decodeURIComponent(Buffer.from(encoded, 'base64').toString());
    }
    return JSON.parse(json);
  } catch {
    return null;
  }
}
