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

export const getTransCrossing = createAsyncThunk('gettransadvance', async (payload:any) => {
    const response:any = await apiCall.get(`/gettransadvance?limit=${payload.limit}&offset=${payload.offset}&search=${payload.search.query}&fromDate=${payload.search.fromDate}&toDate=${payload.search.toDate}`);
    if (response.error) {
        throw new Error("Error message");
    }
    return response.data;
})

export const updateTransAdvance = createAsyncThunk('updateTransAdvance', async (payload:any) => {
    const response:any = await apiCall.put(`/updateTransAdvance`,payload);
    if (response.error) {
        throw new Error("Error message");
    }
    return response.data;
})


const transCrossingSlice = createSlice({
    initialState,
    name: 'TRANSCROSSING',
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(getTransCrossing.pending, (state, _payload) => {
            return { ...state, loading: true }
        })
        builder.addCase(getTransCrossing.fulfilled, (state, { payload }) => {
            return { ...state, body: payload, error: false, loading: false }
        })
        builder.addCase(getTransCrossing.rejected, (state) => {
            return { ...state, loading: false, error: true }
        })
        builder.addCase(updateTransAdvance.pending, (state, _payload) => {
            return { ...state, loading: true }
        })
        builder.addCase(updateTransAdvance.fulfilled, (state, { payload }) => {
            return { ...state, error: false, loading: false }
        })
        builder.addCase(updateTransAdvance.rejected, (state) => {
            return { ...state, loading: false, error: true }
        })
    }
})
export default transCrossingSlice.reducer;