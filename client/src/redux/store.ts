import { configureStore } from '@reduxjs/toolkit';
import userReducer from './userslice/UserSlice'; // Import the user slice

// Configure the Redux store
const store = configureStore({
    reducer: {
        user: userReducer, // Add your user reducer here
    },
});

// Define RootState type based on the store itself
export type RootState = ReturnType<typeof store.getState>;

// Optionally, define AppDispatch type as well
export type AppDispatch = typeof store.dispatch;

export default store;
