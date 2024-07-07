import { configureStore } from '@reduxjs/toolkit';
import travelReducer from '../slices/travelSlice';

const store = configureStore({
  reducer: {
    travel: travelReducer
  }
});

export default store;
