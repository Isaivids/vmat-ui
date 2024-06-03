import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    query: '',
    loading : false,
};

const searchSlice = createSlice({
    name: 'search',
    initialState,
    reducers: {
        setSearchQuery: (state, action) => {
            state.query = action.payload;
        },
        clearSearchQuery: (state) => {
            state.query = '';
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
