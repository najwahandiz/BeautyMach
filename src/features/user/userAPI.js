/*Persists quiz result and recommendations in localStorage.*/

const STORAGE_KEY = 'beautymatch_user';

/*Save quiz/recommendations data to localStorage*/
export function saveUser(userData) {
  try {
    // Convert object to JSON string and save
    localStorage.setItem(STORAGE_KEY, JSON.stringify(userData));
    return userData;
  } catch (error) {
    console.error(' Error saving user data:', error);
    throw error;
  }
}

/*Load quiz/recommendations from localStorage*/
export function loadUser() {
  try {
    // Get data from localStorage
    const data = localStorage.getItem(STORAGE_KEY);
    
    if (!data) {
      return null;
    }
    
    // Parse JSON string back to object
    const userData = JSON.parse(data);
    return userData;
  } catch (error) {
    console.error(' Error loading user data:', error);
    return null;
  }
}

/*Update quiz/recommendations in localStorage*/
export function updateUser(updates) {
  try {
    // Load existing data
    const existingData = loadUser() || {};

    // Merge with updates
    const updatedData = { ...existingData, ...updates };

    saveUser(updatedData);

    return updatedData;
  } catch (error) {
    console.error('Error updating user data:', error);
    throw error;
  }
}

