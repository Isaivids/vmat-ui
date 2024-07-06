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

export const getbankdetail = createAsyncThunk('getbankdetail', async (payload:any) => {
    const response:any = await apiCall.get(`/getbankdetail?limit=${payload.limit}&offset=${payload.offset}&search=${payload.search.query}&fromDate=${payload.search.fromDate}&toDate=${payload.search.toDate}`);
    if (response.error) {
        throw new Error("Error message");
    }
    return response.data;
});

export const updatebankdetail = createAsyncThunk('updatebankdetail', async (payload: any) => {
    const response:any = await apiCall.put(`/updatebankdetail`, payload);
    if (response.error) {
        throw new Error("Error message");
    }
    return response.data;
});

const bankDetailSlice = createSlice({
    initialState,
    name: 'BANKDETAIL',
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(getbankdetail.pending, (state) => {
                state.loading = true;
                state.error = false;
            })
            .addCase(getbankdetail.fulfilled, (state, action) => {
                state.body = action.payload;
                state.loading = false;
            })
            .addCase(getbankdetail.rejected, (state) => {
                state.loading = false;
                state.error = true;
            })
            .addCase(updatebankdetail.pending, (state) => {
                state.loading = true;
                state.error = false;
            })
            .addCase(updatebankdetail.fulfilled, (state) => {
                state.loading = false;
                state.error = false;
            })
            .addCase(updatebankdetail.rejected, (state) => {
                state.loading = false;
                state.error = true;
            });
    },
});

export default bankDetailSlice.reducer;
