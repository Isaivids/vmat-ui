import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    query: '',
    fromDate: '',
    toDate: '',
    loading : false,
};

const searchSlice = createSlice({
    name: 'search',
    initialState,
    reducers: {
        setSearchQuery: (state, action) => {
            state.query = action.payload.search;
            state.fromDate = action.payload.fromDate;
            state.toDate = action.payload.toDate;
        },
        clearSearchQuery: (state) => {
            state.query = '';
            state.fromDate = '';
            state.toDate = '';
        },
        setLoading : (state:any) =>{
            state.loading = true;
        },
        clearLoading : (state:any) =>{
            state.loading = false;
        }
    },
});

export const { setSearchQuery,clearSearchQuery } = searchSlice.actions;
export default searchSlice.reducer;
