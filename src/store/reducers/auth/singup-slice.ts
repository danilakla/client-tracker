import { PayloadAction, createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { authApi } from "../../../api/auth/auth-api";
import axios from "axios";
import { ItemOfSelectType } from "../../../ui-kit/select/select";

type error = string | null;

export type SingupErrors = {
    keyError: error;
    nameUniversityError: error;
    loginError: error;
    passwordError: error;
    confirmPasswordError: error;
};

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
    errors: SingupErrors,
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
    errors: {
        keyError: null,
        nameUniversityError: null,
        loginError: null,
        passwordError: null,
        confirmPasswordError: null,
    },
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
        setErrors(state, action: PayloadAction<SingupErrors>) {
            state.errors = action.payload;
        },
        reset(state){
            state.key = "";
            state.nameUniversity = "";
            state.name = "";
            state.lastname = "";
            state.role = {
                name: 'Преподаватель',
                value: 'TEACHER'
            };
            state.surname = "";
            state.login = "";
            state.password = "";
            state.confirmPassword = "";
            state.loading = "idle";
            state.errors = {
                keyError: null,
                nameUniversityError: null,
                loginError: null,
                passwordError: null,
                confirmPasswordError: null,
            };
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(signUpAdminAndCreateUniversityActionCreator.fulfilled, (state) => {
                state.nameUniversity = "";
                state.login = "";
                state.password = "";
                state.name = "";
                state.lastname = "";
                state.surname = "";
                state.role = {
                    name: 'Преподаватель',
                    value: 'TEACHER'
                };
                state.confirmPassword = "";
                state.loading = "idle";
                state.errors = {
                    keyError: null,
                    nameUniversityError: null,
                    loginError: null,
                    passwordError: null,
                    confirmPasswordError: null,
                };
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
    }) => {
        const { login, role, password, name, lastname, surname, onSuccess, universityName } = data;
        try {
            await authApi.singUp(login, role, password, name, lastname, surname);
            const responce = await authApi.loginUser(login, password);
            await authApi.createUniversity(universityName, responce.jwt);
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

export const signUpActionCreator = createAsyncThunk('sign-up/user',
    async (data: { 
        login: string, 
        password: string, 
        role: string,
        name: string, 
        lastname: string, 
        surname: string,
        onSuccess?: () => void 
    }) => {
        const { login, password, name, lastname, role, surname, onSuccess } = data;
        try {
            await authApi.singUp(login, role, password, name, lastname, surname);
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

export default singupSlice.reducer;
