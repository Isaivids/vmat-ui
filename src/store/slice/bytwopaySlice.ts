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

export const getbytwopay = createAsyncThunk('getbytwopay', async () => {
    const response:any = await apiCall.get(`/getbytwopay`);
    if (response.error) {
        throw new Error("Error message");
    }
    return response.data;
})

export const updateByTwoPay = createAsyncThunk('updateByTwoPay', async (payload:any) => {
    const response:any = await apiCall.put(`/updateByTwoPay`,payload);
    if (response.error) {
        throw new Error("Error message");
    }
    return response.data;
})

const byTwoPaySlice = createSlice({
    initialState,
    name: 'BYTWOPAY',
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(getbytwopay.pending, (state, _payload) => {
            return { ...state, loading: true }
        })
        builder.addCase(getbytwopay.fulfilled, (state, { payload }) => {
            return { ...state, body: payload, error: false, loading: false }
        })
        builder.addCase(getbytwopay.rejected, (state) => {
            return { ...state, loading: false, error: true }
        })
        builder.addCase(updateByTwoPay.pending, (state, _payload) => {
            return { ...state, loading: true }
        })
        builder.addCase(updateByTwoPay.fulfilled, (state, { payload }) => {
            return { ...state, error: false, loading: false }
        })
        builder.addCase(updateByTwoPay.rejected, (state) => {
            return { ...state, loading: false, error: true }
        })
    }
})
export default byTwoPaySlice.reducer;