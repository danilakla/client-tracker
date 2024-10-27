import { PayloadAction, createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { ItemOfSelectType } from "../../../ui-kit/select/select";
import { authApi } from "../../../api/auth/auth-api";
import axios from "axios";

export type LoginErrors = {
    loginError: string | null;
    parentKeyError: string | null;
    passwordError: string | null;
};

export type LoginState = {
    role: ItemOfSelectType;
    login: string;
    parentKey: string;
    password: string;
    loading: "idle" | "loading" | "success" | "error";
    errors: LoginErrors;
};

const initialState: LoginState = {
    role: {
        name: 'Преподаватель',
        value: 'teacher'
    },
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
        setRoleActionCreater(state, action: PayloadAction<ItemOfSelectType>) {
            state.role = action.payload;
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
            .addCase(loginActionCreator.fulfilled, (state) => {
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
            .addCase(loginActionCreator.pending, (state) => {
                state.loading = 'loading';
            })
            .addCase(loginActionCreator.rejected, (state) => {
                state.loading = "idle";
            });
    },
});

export const loginActionCreator = createAsyncThunk('login',
    async (data: { login: string, password: string, onSuccess?: () => void }) => {
        const { login, password, onSuccess } = data;
        try {
            const responce = await authApi.login(login, password);
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
