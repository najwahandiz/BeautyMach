/**
 * userThunks.js
 * 
 * Async thunks for user operations.
 * Thunks are functions that can do async work (like API calls)
 * and then dispatch actions to update the store.
 * 
 * FLOW:
 * Component → dispatch(thunk) → thunk runs → API call → dispatch(action) → reducer updates state
 */

import { createAsyncThunk } from '@reduxjs/toolkit';
import { saveUser, loadUser, clearUser, updateUser } from './userAPI';

/**
 * Login User (fake login - no real authentication)
 * 
 * This simulates a login by saving user data to localStorage.
 * In a real app, you would send credentials to a server.
 * 
 * Usage:
 * dispatch(loginUser({ name: 'John', email: 'john@example.com' }))
 */
export const loginUser = createAsyncThunk(
  'user/login',
  async (profileData, { rejectWithValue }) => {
    try {
      // Create user data object
      const userData = {
        profile: {
          name: profileData.name,
          email: profileData.email || '',
          ageRange: profileData.ageRange || null,
          createdAt: new Date().toISOString()
        },
        quizResult: null,
        recommendations: null
      };

      // Save to localStorage (simulates saving to database)
      saveUser(userData);

      // Return the data (goes to fulfilled action)
      return userData;
    } catch (error) {
      // Return error (goes to rejected action)
      return rejectWithValue(error.message);
    }
  }
);

/**
 * Load User From Storage
 * 
 * Called on app start to restore user session.
 * Checks localStorage for existing user data.
 * 
 * Usage:
 * dispatch(loadUserFromStorage())
 */
export const loadUserFromStorage = createAsyncThunk(
  'user/loadFromStorage',
  async () => {
    // Load from localStorage
    const userData = loadUser();
    
    // Return data (or null if none found)
    return userData;
  }
);

/**
 * Logout User
 * 
 * Clears all user data from localStorage.
 * 
 * Usage:
 * dispatch(logoutUser())
 */
export const logoutUser = createAsyncThunk(
  'user/logout',
  async () => {
    // Clear localStorage
    clearUser();
    return null;
  }
);

/**
 * Save Quiz Result
 * 
 * Saves the skin quiz result to user data.
 * This is called after the user completes the quiz.
 * 
 * Usage:
 * dispatch(saveQuizResultThunk({ skinType: 'oily', concerns: ['acne'] }))
 */
export const saveQuizResultThunk = createAsyncThunk(
  'user/saveQuizResult',
  async (quizResult) => {
    // Update user data with quiz result
    updateUser({ quizResult });
    
    return quizResult;
  }
);

/**
 * Save AI Recommendations
 * 
 * Saves the AI-generated recommendations to user data.
 * This is called after receiving recommendations from AI.
 * 
 * Usage:
 * dispatch(saveRecommendationsThunk({ routine: {...}, summary: '...' }))
 */
export const saveRecommendationsThunk = createAsyncThunk(
  'user/saveRecommendations',
  async (recommendations) => {
    // Update user data with recommendations
    updateUser({ recommendations });
    
    return recommendations;
  }
);

/**
 * Update User Profile
 * 
 * Updates specific fields in user profile.
 * 
 * Usage:
 * dispatch(updateUserProfileThunk({ name: 'New Name' }))
 */
export const updateUserProfileThunk = createAsyncThunk(
  'user/updateProfile',
  async (profileUpdates, { getState }) => {
    // Get current state
    const { user } = getState();
    
    // Merge with existing profile
    const updatedProfile = {
      ...user.profile,
      ...profileUpdates
    };
    
    // Update in localStorage
    updateUser({ profile: updatedProfile });
    
    return updatedProfile;
  }
);

