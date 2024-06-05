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

export const getvmataccount = createAsyncThunk('getvmataccount', async (payload:any) => {
    const response:any = await apiCall.get(`/getvmataccount?limit=${payload.limit}&offset=${payload.offset}&search=${payload.search}`);
    if (response.error) {
        throw new Error("Error message");
    }
    return response.data;
})

export const updatevmataccount = createAsyncThunk('updatevmataccount', async (payload:any) => {
    const response:any = await apiCall.put(`/updatevmataccount`,payload);
    if (response.error) {
        throw new Error("Error message");
    }
    return response.data;
})

const vmatAccountSLice = createSlice({
    initialState,
    name: 'VMAT_ACCOUNT',
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(getvmataccount.pending, (state, _payload) => {
            return { ...state, loading: true }
        })
        builder.addCase(getvmataccount.fulfilled, (state, { payload }) => {
            return { ...state, body: payload, error: false, loading: false }
        })
        builder.addCase(getvmataccount.rejected, (state) => {
            return { ...state, loading: false, error: true }
        })
        builder.addCase(updatevmataccount.pending, (state, _payload) => {
            return { ...state, loading: true }
        })
        builder.addCase(updatevmataccount.fulfilled, (state, { payload }) => {
            return { ...state, error: false, loading: false }
        })
        builder.addCase(updatevmataccount.rejected, (state) => {
            return { ...state, loading: false, error: true }
        })
    }
})
export default vmatAccountSLice.reducer;