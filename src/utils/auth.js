const KEY = "sf_admin_session";
const SESSION_HOURS = 2; // session expires after 2 hours of inactivity

export function login() {
  const expiresAt = Date.now() + SESSION_HOURS * 60 * 60 * 1000;
  sessionStorage.setItem(KEY, JSON.stringify({ ok: true, expiresAt }));
}

export function logout() {
  sessionStorage.removeItem(KEY);
}

export function isAuthenticated() {
  try {
    const raw = sessionStorage.getItem(KEY);
    if (!raw) return false;
    const { ok, expiresAt } = JSON.parse(raw);
    if (!ok || Date.now() > expiresAt) {
      sessionStorage.removeItem(KEY);
      return false;
    }
    return true;
  } catch {
    return false;
  }
}