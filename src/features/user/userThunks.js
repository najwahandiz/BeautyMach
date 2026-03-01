import { createAsyncThunk } from '@reduxjs/toolkit';
import { loadUser, updateUser } from './userAPI';

/*Load Quiz Data From Storage*/
export const loadUserFromStorage = createAsyncThunk(
  'user/loadFromStorage',
  async () => {
    const data = loadUser();
    return data;
  }
);

/*Save Quiz Result*/
export const saveQuizResultThunk = createAsyncThunk(
  'user/saveQuizResult',
  async (quizResult) => {
    // Update user data with quiz result
    updateUser({ quizResult });
    
    return quizResult;
  }
);

/*Save AI Recommendations*/
export const saveRecommendationsThunk = createAsyncThunk(
  'user/saveRecommendations',
  async (recommendations) => {
    // Update user data with recommendations
    updateUser({ recommendations });
    
    return recommendations;
  }
);

/*Clear Quiz Data*/
export const clearQuizDataThunk = createAsyncThunk(
  'user/clearQuizData',
  async () => {
    // Clear quiz data from localStorage
    updateUser({ quizResult: null, recommendations: null });
    
    return null;
  }
);

