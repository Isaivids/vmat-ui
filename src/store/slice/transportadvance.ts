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

export const gettransportadvance = createAsyncThunk('gettransportadvance', async (payload:any) => {
    const response:any = await apiCall.get(`/gettransportadvance?limit=${payload.limit}&offset=${payload.offset}&search=${payload.search.query}&fromDate=${payload.search.fromDate}&toDate=${payload.search.toDate}`);
    if (response.error) {
        throw new Error("Error message");
    }
    return response.data;
})

export const updateTransportAdvance = createAsyncThunk('updateTransportAdvance', async (payload:any) => {
    const response:any = await apiCall.put(`/updateTransportAdvance`,payload);
    if (response.error) {
        throw new Error("Error message");
    }
    return response.data;
})

const transportAdvanceSlice = createSlice({
    initialState,
    name: 'TRANSPORT_ADVANCE',
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(gettransportadvance.pending, (state, _payload) => {
            return { ...state, loading: true }
        })
        builder.addCase(gettransportadvance.fulfilled, (state, { payload }) => {
            return { ...state, body: payload, error: false, loading: false }
        })
        builder.addCase(gettransportadvance.rejected, (state) => {
            return { ...state, loading: false, error: true }
        })
        builder.addCase(updateTransportAdvance.pending, (state, _payload) => {
            return { ...state, loading: true }
        })
        builder.addCase(updateTransportAdvance.fulfilled, (state, { payload }) => {
            return { ...state, error: false, loading: false }
        })
        builder.addCase(updateTransportAdvance.rejected, (state) => {
            return { ...state, loading: false, error: true }
        })
    }
})
export default transportAdvanceSlice.reducer;