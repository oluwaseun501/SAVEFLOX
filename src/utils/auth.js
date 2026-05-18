const TOKEN_KEY = "sf_admin_token";

export function setToken(token) {
  if (token) {
    // Use localStorage so the token persists across tabs and sessions
    localStorage.setItem(TOKEN_KEY, token);
  }
}

export function getToken() {
  return localStorage.getItem(TOKEN_KEY);
}

export function removeToken() {
  localStorage.removeItem(TOKEN_KEY);
}

export function login(token) {
  setToken(token);
}

export function logout() {
  removeToken();
}

export function isAuthenticated() {
  return Boolean(getToken());
}