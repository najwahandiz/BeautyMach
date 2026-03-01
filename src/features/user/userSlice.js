/*Redux slice for quiz results and AI recommendations. Stored in localStorage via userAPI.*/

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
    setQuizResult: (state, action) => {
      state.quizResult = action.payload;
    },

    /*Set AI recommendations*/
    setRecommendations: (state, action) => {
      state.recommendations = action.payload;
    },

    /*Clear error*/
    clearError: (state) => {
      state.error = null;
    }
  },

  extraReducers: (builder) => {
    builder
      /*LOAD QUIZ DATA FROM STORAGE*/
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

      /*SAVE QUIZ RESULT*/
      .addCase(saveQuizResultThunk.fulfilled, (state, action) => {
        state.quizResult = action.payload;
      })

      /*SAVE RECOMMENDATIONS*/
      .addCase(saveRecommendationsThunk.fulfilled, (state, action) => {
        state.recommendations = action.payload;
      })

      /*CLEAR QUIZ DATA*/
      .addCase(clearQuizDataThunk.fulfilled, (state) => {
        state.quizResult = null;
        state.recommendations = null;
      });
  }
});

export const { setQuizResult, setRecommendations, clearError } = userSlice.actions;
export default userSlice.reducer;

/*SELECTORS*/
export const selectQuizResult = (state) => state.user.quizResult;

export const selectRecommendations = (state) => state.user.recommendations;

export const selectUserLoading = (state) => state.user.loading;

