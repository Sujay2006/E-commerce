import axios from "axios";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

const initialState = {
    isLoading : false,
    orderList: [],
    orderDetails : null,
}

export const getAllOrdersByUserId = createAsyncThunk(
  "/order/getAllOrdersByUserId",
  async () => {
    const response = await axios.get(
      `${import.meta.env.VITE_API_URL}/api/admin/orders/get`
    );

    return response.data;
  }
);

export const getOrderDetails = createAsyncThunk(
  "/order/getOrderDetails",
  async (id) => {
    const response = await axios.get(
      `${import.meta.env.VITE_API_URL}/api/admin/orders/details/${id}`
    );

    return response.data;
  }
);
export const updateOrderStatus = createAsyncThunk(
  "/order/updateOrderStatus",
  async ({id, updateStatus}) => {
    const response = await axios.put(
      `${import.meta.env.VITE_API_URL}/api/admin/orders/update/${id}`, { orderStatus: updateStatus } 
    );

    return response.data;
  }
);

const adminOrderSlice = createSlice({
    name: "adminOrderSlice",
    initialState,
    reducers: {
      resetOrderDetails: (state) => {
        state.orderDetails = null;
      },
    },
    extraReducers : (builder)=> {
          builder
             .addCase(getAllOrdersByUserId.pending, (state) => {
                state.isLoading = true;
              })
              .addCase(getAllOrdersByUserId.fulfilled, (state, action) => {
                state.isLoading = false;
                state.orderList = action.payload.data;
              })
              .addCase(getAllOrdersByUserId.rejected, (state) => {
                state.isLoading = false;
                state.orderList = [];
              })
              .addCase(getOrderDetails.pending, (state) => {
                state.isLoading = true;
              })
              .addCase(getOrderDetails.fulfilled, (state, action) => {
                state.isLoading = false;
                state.orderDetails = action.payload.data;
              })
              .addCase(getOrderDetails.rejected, (state) => {
                state.isLoading = false;
                state.orderDetails = null;
              });
    },
});

export const { resetOrderDetails } = adminOrderSlice.actions;
export default adminOrderSlice.reducer;
