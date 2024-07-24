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

export const updaterecentbill = createAsyncThunk('updaterecentbill', async (payload:any) => {
    const response:any = await apiCall.post(`/updaterecentbill`,payload);
    if (response.error) {
        throw new Error("Error message");
    }
    return response.data;
});

const billSlice = createSlice({
    initialState,
    name: 'BILL',
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(updaterecentbill.pending, (state) => {
                state.loading = true;
                state.error = false;
            })
            .addCase(updaterecentbill.fulfilled, (state, action) => {
                state.body = action.payload;
                state.loading = false;
            })
            .addCase(updaterecentbill.rejected, (state) => {
                state.loading = false;
                state.error = true;
            })
    },
});

export default billSlice.reducer;
