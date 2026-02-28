/**
 * userThunks.js
 *
 * Async thunks for quiz and recommendations (persisted in localStorage).
 * No user profile or login.
 */

import { createAsyncThunk } from '@reduxjs/toolkit';
import { loadUser, updateUser } from './userAPI';

/**
 * Load Quiz Data From Storage
 * Called on app start to restore quiz result and recommendations.
 */
export const loadUserFromStorage = createAsyncThunk(
  'user/loadFromStorage',
  async () => {
    const data = loadUser();
    return data;
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
 * Clear Quiz Data
 * 
 * Clears quiz result and recommendations from user data.
 * This allows the user to restart the quiz fresh.
 * 
 * Usage:
 * dispatch(clearQuizDataThunk())
 */
export const clearQuizDataThunk = createAsyncThunk(
  'user/clearQuizData',
  async () => {
    // Clear quiz data from localStorage
    updateUser({ quizResult: null, recommendations: null });
    
    return null;
  }
);

