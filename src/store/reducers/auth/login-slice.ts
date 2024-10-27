import { PayloadAction, createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { authApi } from "../../../api/auth/auth-api";
import axios from "axios";

export type LoginErrors = {
    loginError: string | null;
    parentKeyError: string | null;
    passwordError: string | null;
};

export type LoginState = {
    login: string;
    parentKey: string;
    password: string;
    loading: "idle" | "loading" | "success" | "error";
    errors: LoginErrors;
};

const initialState: LoginState = {
    login: "",
    parentKey: "",
    password: "",
    loading: "idle",
    errors: {
        loginError: null,
        parentKeyError: null,
        passwordError: null
    }
};


export const loginSlice = createSlice({
    name: "login",
    initialState: initialState,
    reducers: {
        setErrorsActionCreater(state, action: PayloadAction<LoginErrors>) {
            state.errors = action.payload;
        },
        setLoginActionCreater(state, action: PayloadAction<string>) {
            state.login = action.payload;
        },
        setParentKeyActionCreater(state, action: PayloadAction<string>) {
            state.parentKey = action.payload;
        },
        setPasswordActionCreater(state, action: PayloadAction<string>) {
            state.password = action.payload;
        },
        reset(state) {
            state.login = "";
            state.parentKey = "";
            state.password = "";
            state.loading = "idle";
            state.errors = {
                loginError: null,
                parentKeyError: null,
                passwordError: null
            }
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(loginUserActionCreator.fulfilled, (state) => {
                state.login = "";
                state.parentKey = "";
                state.password = "";
                state.loading = "idle";
                state.errors = {
                    loginError: null,
                    parentKeyError: null,
                    passwordError: null,
                };
            })
            .addCase(loginUserActionCreator.pending, (state) => {
                state.loading = 'loading';
            })
            .addCase(loginUserActionCreator.rejected, (state) => {
                state.loading = "idle";
            })
            .addCase(loginParentActionCreator.fulfilled, (state) => {
                state.login = "";
                state.parentKey = "";
                state.password = "";
                state.loading = "idle";
                state.errors = {
                    loginError: null,
                    parentKeyError: null,
                    passwordError: null,
                };
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
    async (data: { login: string, password: string, onSuccess?: () => void }) => {
        const { login, password, onSuccess } = data;
        try {
            const responce = await authApi.loginUser(login, password);
            localStorage.setItem('authToken', responce.jwt);
            if(onSuccess !== undefined) onSuccess();
        }
        catch (e) {
            if (axios.isAxiosError(e)) {
                if (e.response?.status === 401) {
                    
                }
            }
        }
    }
)

export const loginParentActionCreator = createAsyncThunk('login/parent',
    async (data: { token: string, onSuccess?: () => void }) => {
        const { token, onSuccess } = data;
        try {
            const responce = await authApi.loginParent(token);
            localStorage.setItem('authToken', responce.jwt);
            if(onSuccess !== undefined) onSuccess();
        }
        catch (e) {
            if (axios.isAxiosError(e)) {
                if (e.response?.status === 401) {
                    
                }
            }
        }
    }
)

export default loginSlice.reducer;
