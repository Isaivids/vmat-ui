import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { apiCall } from '../../api/api';

export interface State {
    body: any[];
    loading: boolean;
    error: boolean;
}

const initialState: State = {
    body: [],
    loading: false,
    error: false,
};

export const getTransportDetail = createAsyncThunk('getTransportDetail', async (payload:any) => {
    const response:any = await apiCall.get(`/getTransportDetail?limit=${payload.limit}&offset=${payload.offset}&search=${payload.search}`);
    if (response.error) {
        throw new Error("Error message");
    }
    return response.data;
});

export const updateTransportDetail = createAsyncThunk('updateTransportDetail', async (payload: any) => {
    const response:any = await apiCall.put(`/updateTransportDetail`, payload);
    if (response.error) {
        throw new Error("Error message");
    }
    return response.data;
});

const transportSlice = createSlice({
    initialState,
    name: 'TRANSPORTDETAIL',
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(getTransportDetail.pending, (state) => {
                state.loading = true;
                state.error = false;
            })
            .addCase(getTransportDetail.fulfilled, (state, action) => {
                state.body = action.payload;
                state.loading = false;
            })
            .addCase(getTransportDetail.rejected, (state) => {
                state.loading = false;
                state.error = true;
            })
            .addCase(updateTransportDetail.pending, (state) => {
                state.loading = true;
                state.error = false;
            })
            .addCase(updateTransportDetail.fulfilled, (state) => {
                state.loading = false;
                state.error = false;
            })
            .addCase(updateTransportDetail.rejected, (state) => {
                state.loading = false;
                state.error = true;
            });
    },
});

export default transportSlice.reducer;
