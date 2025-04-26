import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { apiCall } from '../../api/api';

export interface State {
    body: any,
    loading: boolean,
    error: boolean,
}
const initialState = {
    body: [],
    loading: false,
    error: false,
}

export const bulkupdate = createAsyncThunk(
    'bulkupdate',
    async ({ type, body }: { type: any; body: any }) => {
        const response: any = await apiCall.post(`/bulkUpdate/${type}`,body);
        if (response.error) {
            throw new Error("Error message");
        }
        return response.data;
    }
);

const bulkSlice = createSlice({
    initialState,
    name: 'BULKUPDATE',
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(bulkupdate.pending, (state, _payload) => {
            return { ...state, loading: true }
        })
        builder.addCase(bulkupdate.fulfilled, (state, { payload }) => {
            return { ...state, body: payload, error: false, loading: false }
        })
        builder.addCase(bulkupdate.rejected, (state) => {
            return { ...state, loading: false, error: true }
        })
    }
})
export default bulkSlice.reducer;