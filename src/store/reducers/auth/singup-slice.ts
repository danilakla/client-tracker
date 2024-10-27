import { PayloadAction, createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { authApi } from "../../../api/auth/auth-api";
import axios from "axios";

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
    nameUniversity: string;
    login: string;
    password: string;
    confirmPassword: string;
    loading: "idle" | "loading" | "success" | "error";
    errors: SingupErrors,
};

const initialState: SingupState = {
    key: "",
    nameUniversity: "",
    login: "",
    password: "",
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
    
});



export default singupSlice.reducer;
