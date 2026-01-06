/**
 * Authentication service
 * Simple authentication using localStorage
 */

const AUTH_KEY = "real_state_auth";
const CREDENTIALS_KEY = "real_state_credentials";

// Initialize default credentials only if none exist
function initializeCredentials() {
  const stored = localStorage.getItem(CREDENTIALS_KEY);
  if (!stored) {
    const defaultCredentials = {
      username: "admin",
      password: "admin123",
      email: "",
      phone: "",
    };
    localStorage.setItem(CREDENTIALS_KEY, JSON.stringify(defaultCredentials));
    return defaultCredentials;
  }
  try {
    const credentials = JSON.parse(stored);
    // Ensure email and phone fields exist (for backward compatibility)
    if (typeof credentials.email === "undefined") {
      credentials.email = "";
    }
    if (typeof credentials.phone === "undefined") {
      credentials.phone = "";
    }
    return credentials;
  } catch {
    // If corrupted, reset to default
    const defaultCredentials = {
      username: "admin",
      password: "admin123",
      email: "",
      phone: "",
    };
    localStorage.setItem(CREDENTIALS_KEY, JSON.stringify(defaultCredentials));
    return defaultCredentials;
  }
}

/**
 * Get stored credentials
 * @returns {Object} - Credentials object with username, password, email, and phone
 */
export function getCredentials() {
  return initializeCredentials();
}

/**
 * Set/Update password
 * @param {string} currentPassword - Current password for verification
 * @param {string} newPassword - New password to set
 * @returns {boolean} - True if password updated successfully
 */
export function changePassword(currentPassword, newPassword) {
  const credentials = getCredentials();

  if (credentials.password !== currentPassword) {
    return false;
  }

  credentials.password = newPassword;
  localStorage.setItem(CREDENTIALS_KEY, JSON.stringify(credentials));
  return true;
}

/**
 * Set/Update username
 * @param {string} currentPassword - Current password for verification
 * @param {string} newUsername - New username to set
 * @returns {boolean} - True if username updated successfully
 */
export function changeUsername(currentPassword, newUsername) {
  const credentials = getCredentials();

  if (credentials.password !== currentPassword) {
    return false;
  }

  credentials.username = newUsername;
  localStorage.setItem(CREDENTIALS_KEY, JSON.stringify(credentials));
  return true;
}

/**
 * Login function
 * @param {string} username - Username
 * @param {string} password - Password
 * @returns {boolean} - True if login successful
 */
export function login(username, password) {
  const credentials = getCredentials();

  if (username === credentials.username && password === credentials.password) {
    const authData = {
      username: username,
      isAuthenticated: true,
      loginTime: new Date().toISOString(),
    };
    localStorage.setItem(AUTH_KEY, JSON.stringify(authData));
    return true;
  }
  return false;
}

/**
 * Logout function
 */
export function logout() {
  localStorage.removeItem(AUTH_KEY);
}

/**
 * Check if user is authenticated
 * @returns {boolean} - True if user is authenticated
 */
export function isAuthenticated() {
  const authData = localStorage.getItem(AUTH_KEY);
  if (!authData) return false;

  try {
    const parsed = JSON.parse(authData);
    return parsed.isAuthenticated === true;
  } catch {
    return false;
  }
}

/**
 * Update email and phone
 * @param {string} currentPassword - Current password for verification
 * @param {string} email - Email address
 * @param {string} phone - Phone number
 * @returns {boolean} - True if updated successfully
 */
export function updateEmailAndPhone(currentPassword, email, phone) {
  const credentials = getCredentials();

  if (credentials.password !== currentPassword) {
    return false;
  }

  credentials.email = email;
  credentials.phone = phone;
  localStorage.setItem(CREDENTIALS_KEY, JSON.stringify(credentials));
  return true;
}

/**
 * Get stored credentials (for dashboard use)
 * @returns {Object} - Credentials object
 */
export function getStoredCredentials() {
  return getCredentials();
}

/**
 * Check if email exists in credentials
 * @param {string} email - Email to check
 * @returns {boolean} - True if email exists and is not empty
 */
export function emailExists(email) {
  const credentials = getCredentials();
  return (
    credentials.email &&
    credentials.email.trim() !== "" &&
    credentials.email.toLowerCase() === email.toLowerCase()
  );
}

/**
 * Reset password (for forgot password feature) - validates by email
 * @param {string} email - Email to verify
 * @param {string} newPassword - New password to set
 * @returns {boolean} - True if password reset successfully
 */
export function resetPassword(email, newPassword) {
  const credentials = getCredentials();

  // Verify email exists and matches
  if (!emailExists(email)) {
    return false;
  }

  // Update password
  credentials.password = newPassword;
  localStorage.setItem(CREDENTIALS_KEY, JSON.stringify(credentials));
  return true;
}

/**
 * Get current user info
 * @returns {Object|null} - User info or null
 */
export function getCurrentUser() {
  const authData = localStorage.getItem(AUTH_KEY);
  if (!authData) return null;

  try {
    return JSON.parse(authData);
  } catch {
    return null;
  }
}
