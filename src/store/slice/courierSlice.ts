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

export const getcourierdetail = createAsyncThunk('getcourierdetail', async (payload:any) => {
    const response:any = await apiCall.get(`/getcourierdetail?limit=${payload.limit}&offset=${payload.offset}&search=${payload.search.query}&fromDate=${payload.search.fromDate}&toDate=${payload.search.toDate}`);
    if (response.error) {
        throw new Error("Error message");
    }
    return response.data;
});

export const updatecourierdetails = createAsyncThunk('updatecourierdetails', async (payload: any) => {
    const response:any = await apiCall.put(`/updatecourierdetails`, payload);
    if (response.error) {
        throw new Error("Error message");
    }
    return response.data;
});

export const deletecourierdetails = createAsyncThunk('deletecourierdetails', async (payload: any) => {
    const response:any = await apiCall.delete(`/deletecourierdetails/${payload}`);
    if (response.error) {
        throw new Error("Error message");
    }
    return response.data;
});

const courierSllce = createSlice({
    initialState,
    name: 'COURIERDETAILS',
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(getcourierdetail.pending, (state) => {
                state.loading = true;
                state.error = false;
            })
            .addCase(getcourierdetail.fulfilled, (state, action) => {
                state.body = action.payload;
                state.loading = false;
            })
            .addCase(getcourierdetail.rejected, (state) => {
                state.loading = false;
                state.error = true;
            })
            .addCase(updatecourierdetails.pending, (state) => {
                state.loading = true;
                state.error = false;
            })
            .addCase(updatecourierdetails.fulfilled, (state) => {
                state.loading = false;
                state.error = false;
            })
            .addCase(updatecourierdetails.rejected, (state) => {
                state.loading = false;
                state.error = true;
            })
            .addCase(deletecourierdetails.pending, (state) => {
                state.loading = true;
                state.error = false;
            })
            .addCase(deletecourierdetails.fulfilled, (state) => {
                state.loading = false;
                state.error = false;
            })
            .addCase(deletecourierdetails.rejected, (state) => {
                state.loading = false;
                state.error = true;
            });
    },
});

export default courierSllce.reducer;
