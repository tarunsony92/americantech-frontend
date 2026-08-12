import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import uiReducer from "./slices/uiSlice";
import couponReducer from "../features/coupons/couponSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    ui: uiReducer,
    coupons: couponReducer,
  },
});

export default store;