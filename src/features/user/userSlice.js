/**
 * userSlice.js
 *
 * Redux slice for quiz results and AI recommendations.
 * Stored in localStorage via userAPI (no user profile/login).
 *
 * STATE STRUCTURE:
 * {
 *   quizResult: { skinType, concerns, ageRange },
 *   recommendations: { routine, summary }
 * }
 */

import { createSlice } from '@reduxjs/toolkit';
import {
  loadUserFromStorage,
  saveQuizResultThunk,
  saveRecommendationsThunk,
  clearQuizDataThunk,
} from './userThunks';

const initialState = {
  quizResult: null,
  recommendations: null,
  loading: false,
  error: null
};

// Create the slice
const userSlice = createSlice({
  name: 'user',
  initialState,
  
  reducers: {
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
     * Clear error
     */
    clearError: (state) => {
      state.error = null;
    }
  },

  // Extra reducers - for async thunks
  extraReducers: (builder) => {
    builder
      // ===== LOAD QUIZ DATA FROM STORAGE =====
      .addCase(loadUserFromStorage.pending, (state) => {
        state.loading = true;
      })
      .addCase(loadUserFromStorage.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload) {
          state.quizResult = action.payload.quizResult || null;
          state.recommendations = action.payload.recommendations || null;
        }
      })
      .addCase(loadUserFromStorage.rejected, (state) => {
        state.loading = false;
      })

      // ===== SAVE QUIZ RESULT =====
      .addCase(saveQuizResultThunk.fulfilled, (state, action) => {
        state.quizResult = action.payload;
      })

      // ===== SAVE RECOMMENDATIONS =====
      .addCase(saveRecommendationsThunk.fulfilled, (state, action) => {
        state.recommendations = action.payload;
      })

      // ===== CLEAR QUIZ DATA =====
      .addCase(clearQuizDataThunk.fulfilled, (state) => {
        state.quizResult = null;
        state.recommendations = null;
      });
  }
});

// Export actions
export const { setQuizResult, setRecommendations, clearError } = userSlice.actions;

// Export reducer
export default userSlice.reducer;

// ===== SELECTORS =====
// These help components access state easily

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

