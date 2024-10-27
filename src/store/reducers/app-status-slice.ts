import { PayloadAction, createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { userSlice } from "./user-slice";
import axios from "axios";
import { userApi } from "../../api/auth/user-api";

export type AppStatus = {
    status: "idle" | "loading" | "no-autorizate" | "success";
}


const initialState : AppStatus = {
    status: 'idle',
}

export const appStatusSlice = createSlice({
    name: 'app-status',
    initialState,
    reducers: {
        setStatusApp(state, action: PayloadAction<{ status: "idle" | "loading" | "no-autorizate" | "success" }>) {
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
            .addCase(getUserInfoActionCreator.pending, (state) => {
                state.status = "loading";
            });
    },
});


export const getUserInfoActionCreator = createAsyncThunk('user/info',
    async (data: { authToken: string }, thunkApi) => {
        const { authToken } = data;
        try {
            const responce = await userApi.getUserInfo(authToken);
            
            thunkApi.dispatch(userSlice.actions.setUserActionCreater(responce));
        }
        catch (e) {
            if (axios.isAxiosError(e)) {
                if (e.response?.status === 401) {
                    thunkApi.dispatch(appStatusSlice.actions.setStatusApp({ status: "no-autorizate" }))
                }
            }
        }
    }
)

export default appStatusSlice.reducer;