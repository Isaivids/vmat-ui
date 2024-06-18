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

export const gettcp = createAsyncThunk('gettcp', async (payload:any) => {
    const response:any = await apiCall.get(`/gettcp?limit=${payload.limit}&offset=${payload.offset}&search=${payload.search.query}&fromDate=${payload.search.fromDate}&toDate=${payload.search.toDate}`);
    if (response.error) {
        throw new Error("Error message");
    }
    return response.data;
})

export const updatetcp = createAsyncThunk('updatetcp', async (payload:any) => {
    const response:any = await apiCall.put(`/updatetcp`,payload);
    if (response.error) {
        throw new Error("Error message");
    }
    return response.data;
})


const tcpSlice = createSlice({
    initialState,
    name: 'TCP',
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(gettcp.pending, (state, _payload) => {
            return { ...state, loading: true }
        })
        builder.addCase(gettcp.fulfilled, (state, { payload }) => {
            return { ...state, body: payload, error: false, loading: false }
        })
        builder.addCase(gettcp.rejected, (state) => {
            return { ...state, loading: false, error: true }
        })
        builder.addCase(updatetcp.pending, (state, _payload) => {
            return { ...state, loading: true }
        })
        builder.addCase(updatetcp.fulfilled, (state, { payload }) => {
            return { ...state, error: false, loading: false }
        })
        builder.addCase(updatetcp.rejected, (state) => {
            return { ...state, loading: false, error: true }
        })
    }
})
export default tcpSlice.reducer;