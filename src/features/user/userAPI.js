/**
 * userAPI.js
 * 
 * This file simulates a backend using localStorage.
 * All user data is saved locally in the browser.
 * 
 * Data persists even after closing the browser!
 */

// The key we use to store user data in localStorage
const STORAGE_KEY = 'beautymatch_user';

/**
 * Save user data to localStorage
 * 
 * @param {Object} userData - The user data to save
 * @returns {Object} The saved user data
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
 * Load user data from localStorage
 * 
 * @returns {Object|null} The user data or null if not found
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
 * Clear user data from localStorage (logout)
 * 
 * @returns {boolean} True if successful
 */
export function clearUser() {
  try {
    localStorage.removeItem(STORAGE_KEY);
    console.log('✅ User data cleared from localStorage');
    return true;
  } catch (error) {
    console.error('❌ Error clearing user data:', error);
    return false;
  }
}

/**
 * Update specific fields in user data
 * 
 * @param {Object} updates - The fields to update
 * @returns {Object} The updated user data
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

