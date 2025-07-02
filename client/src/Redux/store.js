import { configureStore } from '@reduxjs/toolkit'
import userReducer from '../Redux/userSlice'
import messageReducer from "../Redux/messageSlice"

export const store=configureStore({
    reducer:{
        user:userReducer,
        message:messageReducer,
    }
})