import { PayloadAction, createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { authApi } from "../../../api/auth/auth-api";
import axios from "axios";

type ErrorType = string | null;

export type LoginState = {
    login: string;
    parentKey: string;
    password: string;
    loading: "idle" | "loading" | "success" | "error";
    errors: Record<string, ErrorType>;
};

const initialState: LoginState = {
    login: "",
    parentKey: "",
    password: "",
    loading: "idle",
    errors: {},
};

const setErrorByKey = (state: LoginState, key: string, error: ErrorType) => {
    state.errors[key] = error;
};

export const loginSlice = createSlice({
    name: "login",
    initialState: initialState,
    reducers: {
        setLoginActionCreater(state, action: PayloadAction<string>) {
            state.login = action.payload;
        },
        setParentKeyActionCreater(state, action: PayloadAction<string>) {
            state.parentKey = action.payload;
        },
        setPasswordActionCreater(state, action: PayloadAction<string>) {
            state.password = action.payload;
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
            .addCase(loginUserActionCreator.fulfilled, (state) => {
                state.loading = 'success';
            })
            .addCase(loginUserActionCreator.pending, (state) => {
                state.loading = 'loading';
            })
            .addCase(loginUserActionCreator.rejected, (state) => {
                state.loading = "idle";
            })
            .addCase(loginParentActionCreator.fulfilled, (state) => {
                state.loading = 'success';
            })
            .addCase(loginParentActionCreator.pending, (state) => {
                state.loading = 'loading';
            })
            .addCase(loginParentActionCreator.rejected, (state) => {
                state.loading = "idle";
            });
    },
});

export const loginUserActionCreator = createAsyncThunk('login/user',
    async (data: { login: string, password: string, onSuccess?: () => void}, thunkApi ) => {
        const { login, password, onSuccess } = data;
        try {
            // const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            // if (!emailRegex.test(login)) {
            //     thunkApi.dispatch(loginSlice.actions.setError(
            //         { key: "loginError", error: 'Введите корректный адрес электронной почты' }
            //     ));
            //     return;
            // } else thunkApi.dispatch(loginSlice.actions.clearErrors())

            const responce = await authApi.loginUser(login, password);
            localStorage.setItem('authToken', responce.jwt);
            onSuccess?.();
            thunkApi.dispatch(loginSlice.actions.reset());
        }
        catch (e) {
            if (axios.isAxiosError(e)) {
                thunkApi.dispatch(loginSlice.actions.setError(
                    { key: "passwordError", error: e.response?.data.message }
                ));
            }
        }
    }
)

export const loginParentActionCreator = createAsyncThunk('login/parent',
    async (data: { token: string, onSuccess?: () => void }, thunkApi) => {
        const { token, onSuccess } = data;
        try {
            const responce = await authApi.loginParent(token);
            localStorage.setItem('authToken', responce.jwt);
            onSuccess?.();
            thunkApi.dispatch(loginSlice.actions.reset());
        }
        catch (e) {
            if (axios.isAxiosError(e)) {
                thunkApi.dispatch(loginSlice.actions.setError(
                    { key: "parentKeyError", error: e.response?.data.message }
                ));
            }
        }
    }
)

export default loginSlice.reducer;
