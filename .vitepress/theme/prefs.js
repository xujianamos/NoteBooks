const STORAGE_KEY = "vp-notes-preferences";

export function readPrefs() {
  if (typeof localStorage === "undefined") return {};
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

export function writePrefs(nextPrefs) {
  if (typeof localStorage === "undefined") return;
  const merged = { ...readPrefs(), ...nextPrefs };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(merged));
}

export function getPref(key, fallback) {
  const prefs = readPrefs();
  return Object.prototype.hasOwnProperty.call(prefs, key)
    ? prefs[key]
    : fallback;
}

export function setPref(key, value) {
  writePrefs({ [key]: value });
}
