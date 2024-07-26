import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { apiCall } from '../../api/api';

const initialState = {
    loading : false,
};

export const getSuggestions = createAsyncThunk('getSuggestions', async (payload:any) => {
    const response:any = await apiCall.get(`/getSuggestions?search=${payload}`);
    if (response.data.error) {
        throw new Error("Error message");
    }
    return response.data;
})

const sugSlice = createSlice({
    name: 'suggesstions',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(getSuggestions.pending, (state, _payload) => {
            return { ...state, loading: true }
        })
        builder.addCase(getSuggestions.fulfilled, (state, { payload }) => {
            return { ...state, body: payload, error: false, loading: false }
        })
        builder.addCase(getSuggestions.rejected, (state) => {
            return { ...state, loading: false, error: true }
        })
    }
});

export default sugSlice.reducer;
