export const GUN_KEYPAIR_KEY = "gun-sea-keypair";

export function getStoredPair() {
  try {
    const raw = window.localStorage.getItem(GUN_KEYPAIR_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch (e) {
    return null;
  }
}

export function storePair(pair) {
  window.localStorage.setItem(GUN_KEYPAIR_KEY, JSON.stringify(pair));
}

export function clearStoredPair() {
  window.localStorage.removeItem(GUN_KEYPAIR_KEY);
}
