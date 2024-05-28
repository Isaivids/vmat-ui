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

export const gettruckdetail = createAsyncThunk('gettruckdetail', async (payload:any) => {
    const response:any = await apiCall.get(`/gettruckdetail?limit=${payload.limit}&offset=${payload.offset}&search=${payload.search}`);
    if (response.error) {
        throw new Error("Error message");
    }
    return response.data;
});

export const updateTruckDetail = createAsyncThunk('updatetruckdetail', async (payload: any) => {
    const response:any = await apiCall.put(`/updatetruckdetail`, payload);
    if (response.error) {
        throw new Error("Error message");
    }
    return response.data;
});

const transportSlice = createSlice({
    initialState,
    name: 'TRUCKDETAIL',
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(gettruckdetail.pending, (state) => {
                state.loading = true;
                state.error = false;
            })
            .addCase(gettruckdetail.fulfilled, (state, action) => {
                state.body = action.payload;
                state.loading = false;
            })
            .addCase(gettruckdetail.rejected, (state) => {
                state.loading = false;
                state.error = true;
            })
            .addCase(updateTruckDetail.pending, (state) => {
                state.loading = true;
                state.error = false;
            })
            .addCase(updateTruckDetail.fulfilled, (state) => {
                state.loading = false;
                state.error = false;
            })
            .addCase(updateTruckDetail.rejected, (state) => {
                state.loading = false;
                state.error = true;
            });
    },
});

export default transportSlice.reducer;
