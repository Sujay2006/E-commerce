import axios from "axios";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

const initialState = {
    isLoading : false,
    searchResult :[]
}

export const getSearchResult = createAsyncThunk(
    "/order/getSearchResult",
    async (keyword) => {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/shop/search/${keyword}`
      );
  
      return response.data;
    }
  );

const searchSlice = createSlice({
    name: 'searchSlice',
    initialState,
    reducers : {
        resetSearchResult: (state)=>{
            state.searchResult = []
        }
    },
    extraReducers : (builder)=> {
        builder.addCase(getSearchResult.pending , (state)=>{
            state.isLoading =true
        }).addCase(getSearchResult.fulfilled , (state, action)=>{
            state.isLoading =false
            state.searchResult = action.payload.data
        }).addCase(getSearchResult.rejected , (state)=>{
            state.isLoading =false
            state.searchResult = []
        })
    }
})

export const {resetSearchResult} = searchSlice.actions

export default searchSlice.reducer;