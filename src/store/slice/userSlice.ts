import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { apiCall } from '../../api/api';

export interface State {
    body: any,
    loading: boolean,
    error: boolean,
}
const initialState = {
    body: {},
    loading: false,
    error: false,
}

export const login = createAsyncThunk('login', async (payload: any) => {
    const response: any = await apiCall.post(`/login`, payload);
    if (response.data.error) {
        throw new Error(response.data.message);
    }
    return response.data;
})

export const getUserInfo = createAsyncThunk('/getUserInfo', async () => {
    const response:any = await apiCall.get(`/getUserInfo`);
    if (response.data.error) {
        throw new Error(response.data.message);
    }
    return response.data;
})

export const changePassword = createAsyncThunk('/changepassword', async (body:any) => {
    const response:any = await apiCall.post(`/changepassword`,body);
    // if (response.data.error) {
    //     throw new Error(response.data.message);
    // }
    return response.data;
})

const userSlice = createSlice({
    initialState,
    name: 'USER',
    reducers: {
        clearUser: (state) => {
            state.body = {};
        },
    },
    extraReducers: (builder) => {
        builder.addCase(login.pending, (state, _payload) => {
            return { ...state, loading: true }
        })
        builder.addCase(login.fulfilled, (state, { payload }) => {
            sessionStorage.setItem('idToken', payload.data.token)
            return { ...state, body: payload, error: false, loading: false }
        })
        builder.addCase(login.rejected, (state) => {
            return { ...state, loading: false, error: true }
        })
        builder.addCase(getUserInfo.pending, (state, _payload) => {
            return { ...state, loading: true }
        })
        builder.addCase(getUserInfo.fulfilled, (state, { payload }) => {
            return { ...state, loading: false, error: false, body: payload }
        })
        builder.addCase(getUserInfo.rejected, (state, { error }) => {
            return { ...state, loading: false, error: true, }
        })
        builder.addCase(changePassword.pending, (state, _payload) => {
            return { ...state, loading: true }
        })
        builder.addCase(changePassword.fulfilled, (state, { payload }) => {
            return { ...state, loading: false, error: false }
        })
        builder.addCase(changePassword.rejected, (state, { error }) => {
            return { ...state, loading: false, error: true, }
        })
    }
})
export const { clearUser } = userSlice.actions;

export default userSlice.reducer;