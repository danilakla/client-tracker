import { PayloadAction, createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { userSlice } from "./user-slice";
import axios from "axios";
import { userApi } from "../../api/auth/user-api";

export type AppStatus = {
    status: "idle" | "loading" | "no-autorizate" | "success" | "app-error";
}


const initialState : AppStatus = {
    status: 'idle',
}

export const appStatusSlice = createSlice({
    name: 'app-status',
    initialState,
    reducers: {
        setStatusApp(state, action: PayloadAction<{ status: "idle" | "loading" | "no-autorizate" | "success" | "app-error"}>) {
            state.status = action.payload.status;
        },
        clearStatus(state) {
            state.status = "idle";
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(getUserInfoActionCreator.fulfilled, (state) => {
                state.status = 'success';
            })
            .addCase(getUserInfoActionCreator.rejected, (state) => {
                state.status = 'no-autorizate';
            })
            .addCase(getUserInfoActionCreator.pending, (state) => {
                state.status = "loading";
            });
    },
});


export const getUserInfoActionCreator = createAsyncThunk('user/info',
    async (data: { authToken: string}, thunkApi) => {
        const { authToken } = data;
        const responce = await userApi.getUserInfo(authToken);
            thunkApi.dispatch(userSlice.actions.setAuthTockenActionCreater(authToken));
            thunkApi.dispatch(userSlice.actions.setUserActionCreater(responce));

            if(localStorage.getItem('role') === 'ROLE_PARENTS'){
                thunkApi.dispatch(userSlice.actions.setUserRoleActionCreater('ROLE_PARENTS'));
            }
    }
)

export default appStatusSlice.reducer;