
const ADMIN_SESSION_KEY = 'beautymatch_admin_session';

/** Hardcoded admin credentials  */
export const ADMIN_CREDENTIALS = {
  username: 'admin',
  password: 'admin123',
};

/**
 * Check if the given username/password match admin credentials.
 * @returns {boolean}
 */
export function validateAdminCredentials(username, password) {
  return (
    username === ADMIN_CREDENTIALS.username &&
    password === ADMIN_CREDENTIALS.password
  );
}

/**
 * Mark admin as logged in (call only after validateAdminCredentials returns true).
 */
export function setAdminSession() {
  localStorage.setItem(ADMIN_SESSION_KEY, 'true');
}

export function clearAdminSession() {
  localStorage.removeItem(ADMIN_SESSION_KEY);
}

/**
 * Check if admin is currently logged in.
 * @returns {boolean}
 */
export function isAdminLoggedIn() {
  return localStorage.getItem(ADMIN_SESSION_KEY) === 'true';
}
