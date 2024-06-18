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

export const getbytransporter = createAsyncThunk('getbytransporter', async (payload:any) => {
    const response:any = await apiCall.get(`/getbytransporter?limit=${payload.limit}&offset=${payload.offset}&search=${payload.search.query}&fromDate=${payload.search.fromDate}&toDate=${payload.search.toDate}`);
    if (response.error) {
        throw new Error("Error message");
    }
    return response.data;
})

export const updateByTransporter = createAsyncThunk('updateByTransporter', async (payload:any) => {
    const response:any = await apiCall.put(`/updateByTransporter`,payload);
    if (response.error) {
        throw new Error("Error message");
    }
    return response.data;
})

const atsSlice = createSlice({
    initialState,
    name: 'BYTRANS',
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(getbytransporter.pending, (state, _payload) => {
            return { ...state, loading: true }
        })
        builder.addCase(getbytransporter.fulfilled, (state, { payload }) => {
            return { ...state, body: payload, error: false, loading: false }
        })
        builder.addCase(getbytransporter.rejected, (state) => {
            return { ...state, loading: false, error: true }
        })
        builder.addCase(updateByTransporter.pending, (state, _payload) => {
            return { ...state, loading: true }
        })
        builder.addCase(updateByTransporter.fulfilled, (state, { payload }) => {
            return { ...state, error: false, loading: false }
        })
        builder.addCase(updateByTransporter.rejected, (state) => {
            return { ...state, loading: false, error: true }
        })
    }
})
export default atsSlice.reducer;