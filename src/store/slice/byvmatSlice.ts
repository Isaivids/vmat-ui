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

export const getByVmat = createAsyncThunk('getbyvmat', async () => {
    const response:any = await apiCall.get(`/getbyvmat`);
    if (response.error) {
        throw new Error("Error message");
    }
    return response.data;
})

export const updateByVmat = createAsyncThunk('updateByVmat', async (payload:any) => {
    const response:any = await apiCall.put(`/updateByVmat`,payload);
    if (response.error) {
        throw new Error("Error message");
    }
    return response.data;
})

const atsSlice = createSlice({
    initialState,
    name: 'BYVMAT',
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(getByVmat.pending, (state, _payload) => {
            return { ...state, loading: true }
        })
        builder.addCase(getByVmat.fulfilled, (state, { payload }) => {
            return { ...state, body: payload, error: false, loading: false }
        })
        builder.addCase(getByVmat.rejected, (state) => {
            return { ...state, loading: false, error: true }
        })
        builder.addCase(updateByVmat.pending, (state, _payload) => {
            return { ...state, loading: true }
        })
        builder.addCase(updateByVmat.fulfilled, (state, { payload }) => {
            return { ...state, error: false, loading: false }
        })
        builder.addCase(updateByVmat.rejected, (state) => {
            return { ...state, loading: false, error: true }
        })
    }
})
export default atsSlice.reducer;