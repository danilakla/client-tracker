import { PayloadAction, createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { userApi } from "../../../api/auth/user-api";
import axios from "axios";
import { userSlice } from "../user-slice";
import { appStatusSlice } from "../app-status-slice";

type ErrorType = string | null;

export type ChangeLoginState = {
    oldLogin: string;
    newLogin: string;
    loading: "idle" | "loading" | "success" | "error";
    errors: Record<string, ErrorType>;
};

const initialState: ChangeLoginState = {
    oldLogin: "",
    newLogin: "",
    loading: "idle",
    errors: {},
};

const setErrorByKey = (state: ChangeLoginState, key: string, error: ErrorType) => {
    state.errors[key] = error;
};

export const changeLoginSlice = createSlice({
    name: "change-login",
    initialState: initialState,
    reducers: {
        setOldLoginActionCreater(state, action: PayloadAction<string>) {
            state.oldLogin = action.payload;
        },
        setNewLoginActionCreater(state, action: PayloadAction<string>) {
            state.newLogin = action.payload;
        },
        setError(state, action: PayloadAction<{ key: string; error: ErrorType }>) {
            setErrorByKey(state, action.payload.key, action.payload.error);
        },
        reset(state) {
            Object.assign(state, initialState);
        },
        clearErrors(state) {
            state.errors = {};
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(changeLoginActionCreator.fulfilled, (state) => {
                state.loading = 'success';
            })
            .addCase(changeLoginActionCreator.pending, (state) => {
                state.loading = 'loading';
            })
            .addCase(changeLoginActionCreator.rejected, (state) => {
                state.loading = "idle";
            })
    },
});

export const changeLoginActionCreator = createAsyncThunk('profile/change-login',
    async (data: { authToken: string, newLogin: string, onSuccess?: () => void}, thunkApi ) => {
        const { authToken, newLogin, onSuccess } = data;
        try {
            thunkApi.dispatch(changeLoginSlice.actions.clearErrors());

            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

            if (!emailRegex.test(newLogin)) {
                thunkApi.dispatch(changeLoginSlice.actions.setError(
                    { key: "newLoginError", error: 'Введите корректный адрес электронной почты' }
                ));
                return;
            };

            const responce = await userApi.changeLogin(authToken, newLogin);
            localStorage.setItem('authToken', responce.jwt);

            thunkApi.dispatch(userSlice.actions.setUserActionCreater(responce.userInfoDto));
            thunkApi.dispatch(userSlice.actions.setAuthTockenActionCreater(responce.jwt));

            onSuccess?.();
        }
        catch (e) {
            if (axios.isAxiosError(e)) {
                if(e.response?.status === 401){
                    thunkApi.dispatch(appStatusSlice.actions.setStatusApp({ status: "no-autorizate" }))
                    return;
                }

                thunkApi.dispatch(changeLoginSlice.actions.setError(
                    { key: "newLoginError", error: e.response?.data.message }
                ));
            } else thunkApi.dispatch(appStatusSlice.actions.setStatusApp({ status: "app-error" }))
        }
    }
)

export default changeLoginSlice.reducer;
