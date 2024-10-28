import { PayloadAction, createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { authApi } from "../../../api/auth/auth-api";
import axios from "axios";
import { ItemOfSelectType } from "../../../ui-kit/select/select";

type ErrorType = string | null;

export type SingupState = {
    key: string;
    role: ItemOfSelectType;
    nameUniversity: string;
    login: string;
    password: string;
    name: string;
    lastname: string;
    surname: string;
    confirmPassword: string;
    loading: "idle" | "loading" | "success" | "error";
    errors: Record<string, ErrorType>;
};

const initialState: SingupState = {
    role: {
        name: 'Преподаватель',
        value: 'TEACHER'
    },
    key: "",
    nameUniversity: "",
    login: "",
    password: "",
    name: '',
    lastname: '',
    surname: '',
    confirmPassword: "",
    loading: "idle",
    errors: {},
};

const setErrorByKey = (state: SingupState, key: string, error: ErrorType) => {
    state.errors[key] = error;
};

export const singupSlice = createSlice({
    name: "singup",
    initialState: initialState,
    reducers: {
        setNameUniversityActionCreater(state, action: PayloadAction<string>) {
            state.nameUniversity = action.payload;
        },
        setKeyActionCreater(state, action: PayloadAction<string>) {
            state.key = action.payload;
        },
        setLoginActionCreater(state, action: PayloadAction<string>) {
            state.login = action.payload;
        },
        setNameActionCreater(state, action: PayloadAction<string>) {
            state.name = action.payload;
        },
        setLastnameActionCreater(state, action: PayloadAction<string>) {
            state.lastname = action.payload;
        },
        setSurnameActionCreater(state, action: PayloadAction<string>) {
            state.surname = action.payload;
        },
        setRoleActionCreater(state, action: PayloadAction<ItemOfSelectType>) {
            state.role = action.payload;
        },
        setPasswordActionCreater(state, action: PayloadAction<string>) {
            state.password = action.payload;
        },
        setConfirmPasswordActionCreater(state, action: PayloadAction<string>) {
            state.confirmPassword = action.payload;
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
            .addCase(signUpAdminAndCreateUniversityActionCreator.fulfilled, (state) => {
                state.loading = 'success';
            })
            .addCase(signUpAdminAndCreateUniversityActionCreator.pending, (state) => {
                state.loading = 'loading';
            })
            .addCase(signUpAdminAndCreateUniversityActionCreator.rejected, (state) => {
                state.loading = "idle";
            });
    }
});

export const signUpAdminAndCreateUniversityActionCreator = createAsyncThunk('sign-up/admin',
    async (data: { 
        login: string, 
        password: string, 
        role: string,
        name: string, 
        lastname: string, 
        surname: string,
        universityName: string,
        onSuccess?: () => void 
    }, thunkApi) => {
        const { login, role, password, name, lastname, surname, onSuccess, universityName } = data;
        try {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(login)) {
                thunkApi.dispatch(singupSlice.actions.setError(
                    { key: "loginError", error: 'Введите корректный адрес электронной почты' }
                ));
                return;
            } thunkApi.dispatch(singupSlice.actions.clearErrors())

            await authApi.singUp(login, role, password, name, lastname, surname);
            const responce = await authApi.loginUser(login, password);
            await authApi.createUniversity(universityName, responce.jwt);
            localStorage.setItem('authToken', responce.jwt);
            onSuccess?.();
        }
        catch (e) {
            if (axios.isAxiosError(e)) {
                if (e.response?.status === 401) {
                    
                }
            }
        }
    }
)

export const signUpActionCreator = createAsyncThunk('sign-up/user',
    async (data: { 
        login: string, 
        password: string, 
        role: string,
        name: string, 
        lastname: string, 
        surname: string,
        onSuccess?: () => void 
    }, thunkApi) => {
        const { login, password, name, lastname, role, surname, onSuccess } = data;
        try {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(login)) {
                thunkApi.dispatch(singupSlice.actions.setError(
                    { key: "loginError", error: 'Введите корректный адрес электронной почты' }
                ));
                return;
            } thunkApi.dispatch(singupSlice.actions.clearErrors())

            await authApi.singUp(login, role, password, name, lastname, surname);
            const responce = await authApi.loginUser(login, password);
            localStorage.setItem('authToken', responce.jwt);
            onSuccess?.();
        }
        catch (e) {
            if (axios.isAxiosError(e)) {
                if (e.response?.status === 401) {
                    
                }
            }
        }
    }
)

export default singupSlice.reducer;
