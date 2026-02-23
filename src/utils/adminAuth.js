/**
 * adminAuth.js
 *
 * Simple client-side admin authentication. Not related to user profile.
 * - Admin dashboard is only accessible after logging in with admin username/password.
 * - Uses its own localStorage key; never reads or writes user profile (Redux/beautymatch_user).
 */

const ADMIN_SESSION_KEY = 'beautymatch_admin_session';

/** Hardcoded admin credentials (no backend) */
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
 * Does not touch user profile storage.
 */
export function setAdminSession() {
  localStorage.setItem(ADMIN_SESSION_KEY, 'true');
}

/**
 * Clear admin session (logout). Does not touch user profile.
 */
export function clearAdminSession() {
  localStorage.removeItem(ADMIN_SESSION_KEY);
}

/**
 * Check if admin is currently logged in.
 * Based only on admin session; does not use user profile state.
 * @returns {boolean}
 */
export function isAdminLoggedIn() {
  return localStorage.getItem(ADMIN_SESSION_KEY) === 'true';
}
