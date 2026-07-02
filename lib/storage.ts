export function getStoredJson<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;

  try {
    const savedValue = window.localStorage.getItem(key);
    return savedValue ? (JSON.parse(savedValue) as T) : fallback;
  } catch {
    return fallback;
  }
}

export function setStoredJson<T>(key: string, value: T) {
  if (typeof window === "undefined") return;

  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Ignore storage quota/private mode failures.
  }
}

export function removeStoredItem(key: string) {
  if (typeof window === "undefined") return;

  try {
    window.localStorage.removeItem(key);
  } catch {
    // Ignore storage quota/private mode failures.
  }
}
