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

export const getAck = createAsyncThunk('getack', async () => {
    const response:any = await apiCall.get(`/getack`);
    if (response.error) {
        throw new Error("Error message");
    }
    return response.data;
})

export const updateAck = createAsyncThunk('updateack', async (payload:any) => {
    const response:any = await apiCall.put(`/updateack`,payload);
    if (response.error) {
        throw new Error("Error message");
    }
    return response.data;
})

const atsSlice = createSlice({
    initialState,
    name: 'ACK',
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(getAck.pending, (state, _payload) => {
            return { ...state, loading: true }
        })
        builder.addCase(getAck.fulfilled, (state, { payload }) => {
            return { ...state, body: payload, error: false, loading: false }
        })
        builder.addCase(getAck.rejected, (state) => {
            return { ...state, loading: false, error: true }
        })
        builder.addCase(updateAck.pending, (state, _payload) => {
            return { ...state, loading: true }
        })
        builder.addCase(updateAck.fulfilled, (state, { payload }) => {
            return { ...state, error: false, loading: false }
        })
        builder.addCase(updateAck.rejected, (state) => {
            return { ...state, loading: false, error: true }
        })
    }
})
export default atsSlice.reducer;