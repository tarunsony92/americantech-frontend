import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  getCoupons,
  createCoupon as createCouponApi,
  updateCoupon as updateCouponApi,
  deleteCoupon as deleteCouponApi,
} from "./couponService";

export const fetchCoupons = createAsyncThunk(
  "coupons/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
      return await getCoupons();
    } catch (err) {
      return rejectWithValue(err?.response?.data?.message || "Failed to load coupons");
    }
  }
);

export const addCoupon = createAsyncThunk(
  "coupons/create",
  async (payload, { rejectWithValue }) => {
    try {
      return await createCouponApi(payload);
    } catch (err) {
      return rejectWithValue(err?.response?.data?.message || "Failed to create coupon");
    }
  }
);

export const editCoupon = createAsyncThunk(
  "coupons/update",
  async ({ id, payload }, { rejectWithValue }) => {
    try {
      return await updateCouponApi(id, payload);
    } catch (err) {
      return rejectWithValue(err?.response?.data?.message || "Failed to update coupon");
    }
  }
);

export const removeCoupon = createAsyncThunk(
  "coupons/delete",
  async (id, { rejectWithValue }) => {
    try {
      await deleteCouponApi(id);
      return id;
    } catch (err) {
      return rejectWithValue(err?.response?.data?.message || "Failed to delete coupon");
    }
  }
);

const couponSlice = createSlice({
  name: "coupons",
  initialState: {
    items: [],
    status: "idle", // idle | loading | succeeded | failed
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // fetch
      .addCase(fetchCoupons.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchCoupons.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.items = action.payload;
      })
      .addCase(fetchCoupons.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      // create
      .addCase(addCoupon.fulfilled, (state, action) => {
        state.items.unshift(action.payload);
      })
      // update
      .addCase(editCoupon.fulfilled, (state, action) => {
        const idx = state.items.findIndex((c) => c.id === action.payload.id);
        if (idx !== -1) state.items[idx] = action.payload;
      })
      // delete
      .addCase(removeCoupon.fulfilled, (state, action) => {
        state.items = state.items.filter((c) => c.id !== action.payload);
      });
  },
});

export default couponSlice.reducer;