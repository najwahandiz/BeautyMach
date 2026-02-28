/**
 * userAPI.js
 *
 * Persists quiz result and recommendations in localStorage.
 * No user profile or login.
 */

const STORAGE_KEY = 'beautymatch_user';

/**
 * Save quiz/recommendations data to localStorage
 */
export function saveUser(userData) {
  try {
    // Convert object to JSON string and save
    localStorage.setItem(STORAGE_KEY, JSON.stringify(userData));
    console.log('✅ User data saved to localStorage');
    return userData;
  } catch (error) {
    console.error('❌ Error saving user data:', error);
    throw error;
  }
}

/**
 * Load quiz/recommendations from localStorage
 */
export function loadUser() {
  try {
    // Get data from localStorage
    const data = localStorage.getItem(STORAGE_KEY);
    
    // If no data, return null
    if (!data) {
      console.log('ℹ️ No user data found in localStorage');
      return null;
    }
    
    // Parse JSON string back to object
    const userData = JSON.parse(data);
    console.log('✅ User data loaded from localStorage');
    return userData;
  } catch (error) {
    console.error('❌ Error loading user data:', error);
    return null;
  }
}

/**
 * Update quiz/recommendations in localStorage
 */
export function updateUser(updates) {
  try {
    // Load existing data
    const existingData = loadUser() || {};

    // Merge with updates
    const updatedData = { ...existingData, ...updates };

    // Save back
    saveUser(updatedData);

    return updatedData;
  } catch (error) {
    console.error('❌ Error updating user data:', error);
    throw error;
  }
}

