import authenticationSliceReducer from "./Authentication/AuthenticationSlice";
import { configureStore } from "@reduxjs/toolkit";

const store = configureStore({
    reducer : {
        user_authentication : authenticationSliceReducer,
    }
})

export default store

