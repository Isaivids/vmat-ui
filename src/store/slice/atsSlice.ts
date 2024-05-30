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

export const getAts = createAsyncThunk('getats', async (filters:any) => {
    const response:any = await apiCall.get(`/getats?limit=${filters.limit}&offset=${filters.offset}&search=${filters.search}`);
    if (response.data.error) {
        throw new Error("Error message");
    }
    return response.data;
})

export const addAts = createAsyncThunk('addats', async (payload:any) => {
    const response:any = await apiCall.post(`/addats`,payload);
    console.log(response)
    if (response.data.error) {
        throw new Error("Error message");
    }
    return response.data;
})

export const updateats = createAsyncThunk('updateats', async (payload:any) => {
    const response:any = await apiCall.put(`/updateats`,payload);
    if (response.data.error) {
        throw new Error("Error message");
    }
    return response.data;
})

const atsSlice = createSlice({
    initialState,
    name: 'ATS',
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(getAts.pending, (state, _payload) => {
            return { ...state, loading: true }
        })
        builder.addCase(getAts.fulfilled, (state, { payload }) => {
            return { ...state, body: payload, error: false, loading: false }
        })
        builder.addCase(getAts.rejected, (state) => {
            return { ...state, loading: false, error: true }
        })
        builder.addCase(addAts.pending, (state, _payload) => {
            return { ...state, loading: true }
        })
        builder.addCase(addAts.fulfilled, (state, { payload }) => {
            return { ...state,body : payload, error: false, loading: false }
        })
        builder.addCase(addAts.rejected, (state) => {
            return { ...state, loading: false, error: true }
        })
        builder.addCase(updateats.pending, (state, _payload) => {
            return { ...state, loading: true }
        })
        builder.addCase(updateats.fulfilled, (state, { payload }) => {
            return { ...state, error: false, loading: false }
        })
        builder.addCase(updateats.rejected, (state) => {
            return { ...state, loading: false, error: true }
        })
    }
})
export default atsSlice.reducer;