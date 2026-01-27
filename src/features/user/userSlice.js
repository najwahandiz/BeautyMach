/**
 * userSlice.js
 * 
 * Redux slice for managing user state.
 * 
 * STATE STRUCTURE:
 * {
 *   isLoggedIn: boolean,      // Is user logged in?
 *   profile: {                // User's basic info
 *     name: string,
 *     email: string,
 *     ageRange: string
 *   },
 *   quizResult: {             // Skin quiz results
 *     skinType: string,
 *     concerns: array,
 *     ageRange: string
 *   },
 *   recommendations: {        // AI recommendations
 *     routine: object,
 *     summary: string
 *   }
 * }
 */

import { createSlice } from '@reduxjs/toolkit';
import { loginUser, loadUserFromStorage, logoutUser, saveQuizResultThunk, saveRecommendationsThunk } from './userThunks';

// Initial state - what we start with
const initialState = {
  isLoggedIn: false,
  profile: null,
  quizResult: null,
  recommendations: null,
  loading: false,
  error: null
};

// Create the slice
const userSlice = createSlice({
  name: 'user',
  initialState,
  
  // Regular reducers - for synchronous actions
  reducers: {
    /**
     * Set user profile
     * Usage: dispatch(setUserProfile({ name: 'John', email: 'john@example.com' }))
     */
    setUserProfile: (state, action) => {
      state.profile = action.payload;
      state.isLoggedIn = true;
    },

    /**
     * Set quiz result
     * Usage: dispatch(setQuizResult({ skinType: 'oily', concerns: ['acne'] }))
     */
    setQuizResult: (state, action) => {
      state.quizResult = action.payload;
    },

    /**
     * Set AI recommendations
     * Usage: dispatch(setRecommendations({ routine: {...}, summary: '...' }))
     */
    setRecommendations: (state, action) => {
      state.recommendations = action.payload;
    },

    /**
     * Logout user - clear all data
     * Usage: dispatch(logout())
     */
    logout: (state) => {
      state.isLoggedIn = false;
      state.profile = null;
      state.quizResult = null;
      state.recommendations = null;
    },

    /**
     * Clear error
     */
    clearError: (state) => {
      state.error = null;
    }
  },

  // Extra reducers - for async thunks
  extraReducers: (builder) => {
    builder
      // ===== LOGIN USER =====
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.isLoggedIn = true;
        state.profile = action.payload.profile;
        state.quizResult = action.payload.quizResult || null;
        state.recommendations = action.payload.recommendations || null;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // ===== LOAD USER FROM STORAGE =====
      .addCase(loadUserFromStorage.pending, (state) => {
        state.loading = true;
      })
      .addCase(loadUserFromStorage.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload) {
          state.isLoggedIn = true;
          state.profile = action.payload.profile;
          state.quizResult = action.payload.quizResult || null;
          state.recommendations = action.payload.recommendations || null;
        }
      })
      .addCase(loadUserFromStorage.rejected, (state) => {
        state.loading = false;
      })

      // ===== LOGOUT USER =====
      .addCase(logoutUser.fulfilled, (state) => {
        state.isLoggedIn = false;
        state.profile = null;
        state.quizResult = null;
        state.recommendations = null;
      })

      // ===== SAVE QUIZ RESULT =====
      .addCase(saveQuizResultThunk.fulfilled, (state, action) => {
        state.quizResult = action.payload;
      })

      // ===== SAVE RECOMMENDATIONS =====
      .addCase(saveRecommendationsThunk.fulfilled, (state, action) => {
        state.recommendations = action.payload;
      });
  }
});

// Export actions
export const { 
  setUserProfile, 
  setQuizResult, 
  setRecommendations, 
  logout,
  clearError 
} = userSlice.actions;

// Export reducer
export default userSlice.reducer;

// ===== SELECTORS =====
// These help components access state easily

/**
 * Get isLoggedIn status
 * Usage: const isLoggedIn = useSelector(selectIsLoggedIn);
 */
export const selectIsLoggedIn = (state) => state.user.isLoggedIn;

/**
 * Get user profile
 * Usage: const profile = useSelector(selectUserProfile);
 */
export const selectUserProfile = (state) => state.user.profile;

/**
 * Get quiz result
 * Usage: const quizResult = useSelector(selectQuizResult);
 */
export const selectQuizResult = (state) => state.user.quizResult;

/**
 * Get recommendations
 * Usage: const recommendations = useSelector(selectRecommendations);
 */
export const selectRecommendations = (state) => state.user.recommendations;

/**
 * Get loading status
 */
export const selectUserLoading = (state) => state.user.loading;

