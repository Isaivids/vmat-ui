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

export const fetchCompletedBills = createAsyncThunk('fetchCompletedBills', async () => {
    const response:any = await apiCall.get(`/fetchCompletedBills`);
    if (response.error) {
        throw new Error("Error message");
    }
    return response.data;
});

export const updateInvestAmount = createAsyncThunk('updateInvestAmount', async (payload: any) => {
    const response:any = await apiCall.post(`/updateInvestAmount`, payload);
    if (response.error) {
        throw new Error("Error message");
    }
    return response.data;
});


const invetsDetailSlice = createSlice({
    initialState,
    name: 'INVEST',
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchCompletedBills.pending, (state) => {
                state.loading = true;
                state.error = false;
            })
            .addCase(fetchCompletedBills.fulfilled, (state, action) => {
                state.body = action.payload;
                state.loading = false;
            })
            .addCase(fetchCompletedBills.rejected, (state) => {
                state.loading = false;
                state.error = true;
            })
            .addCase(updateInvestAmount.pending, (state) => {
                state.loading = true;
                state.error = false;
            })
            .addCase(updateInvestAmount.fulfilled, (state) => {
                state.loading = false;
                state.error = false;
            })
            .addCase(updateInvestAmount.rejected, (state) => {
                state.loading = false;
                state.error = true;
            })
    },
});

export default invetsDetailSlice.reducer;
