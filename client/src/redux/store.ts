// redux/store.ts
import { configureStore } from '@reduxjs/toolkit';
import userReducer from './userslice/UserSlice'; // Import the user slice

const store = configureStore({
    reducer: {
        user: userReducer,
    },
});

export default store;
