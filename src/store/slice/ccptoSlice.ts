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

export const getccpto = createAsyncThunk('getccpto', async (payload:any) => {
    const response:any = await apiCall.get(`/getccpto?limit=${payload.limit}&offset=${payload.offset}&search=${payload.search.query}&fromDate=${payload.search.fromDate}&toDate=${payload.search.toDate}`);
    if (response.data.error) {
        throw new Error("Error message");
    }
    return response.data;
})

export const updateccpto = createAsyncThunk('updateccpto', async (payload:any) => {
    const response:any = await apiCall.put(`/updateccpto`,payload);
    if (response.data.error) {
        throw new Error("Error message");
    }
    return response.data;
})

const ccptoSlice = createSlice({
    initialState,
    name: 'CCPTO',
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(getccpto.pending, (state, _payload) => {
            return { ...state, loading: true }
        })
        builder.addCase(getccpto.fulfilled, (state, { payload }) => {
            return { ...state, body: payload, error: false, loading: false }
        })
        builder.addCase(getccpto.rejected, (state) => {
            return { ...state, loading: false, error: true }
        })
        builder.addCase(updateccpto.pending, (state, _payload) => {
            return { ...state, loading: true }
        })
        builder.addCase(updateccpto.fulfilled, (state, { payload }) => {
            return { ...state, error: false, loading: false }
        })
        builder.addCase(updateccpto.rejected, (state) => {
            return { ...state, loading: false, error: true }
        })
    }
})
export default ccptoSlice.reducer;