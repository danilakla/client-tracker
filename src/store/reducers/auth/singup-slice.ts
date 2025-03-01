import { PayloadAction, createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { authApi } from "../../../api/auth/auth-api";
import axios from "axios";
import { ItemOfSelectType } from "../../../ui-kit/select/select";
import { appStatusSlice } from "../app-status-slice";

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

const MAX_LENGTH = 15;
const RUSSIAN_LETTERS_REGEX = /^[А-Яа-яёЁ]+$/;

export const singupSlice = createSlice({
    name: "sing-up",
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
        setLastnameActionCreater(state, action: PayloadAction<string>) {
            const lastname = action.payload;
            if (lastname === '' || (lastname.length <= MAX_LENGTH && RUSSIAN_LETTERS_REGEX.test(lastname))) {
                state.lastname = lastname;
            }
        },
        setNameActionCreater(state, action: PayloadAction<string>) {
            const name = action.payload;
            if (name === '' || (name.length <= MAX_LENGTH && RUSSIAN_LETTERS_REGEX.test(name))) {
                state.name = name;
            }
        },
        setSurnameActionCreater(state, action: PayloadAction<string>) {
            const surname = action.payload;
            if (surname === '' || (surname.length <= MAX_LENGTH && RUSSIAN_LETTERS_REGEX.test(surname))) {
                state.surname = surname;
            }
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
            })
            .addCase(signUpActionCreator.fulfilled, (state) => {
                state.loading = 'success';
            })
            .addCase(signUpActionCreator.pending, (state) => {
                state.loading = 'loading';
            })
            .addCase(signUpActionCreator.rejected, (state) => {
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
        confirmPassword: string,
        surname: string,
        universityName: string,
        onSuccess?: () => void 
    }, thunkApi) => {
        const { login, role, password, name, confirmPassword, lastname, surname, onSuccess, universityName } = data;
        try {
            thunkApi.dispatch(singupSlice.actions.clearErrors());

            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            let hasError = false;
            
            hasError = !validateField(thunkApi, universityName, 1, "universityNameError", 'Введите название университета') || hasError;
            hasError = !validateField(thunkApi, name, 1, "nameError", 'Введите корректное имя') || hasError;
            hasError = !validateField(thunkApi, lastname, 1, "lastnameError", 'Введите корректную фамилию') || hasError;
            hasError = !validateField(thunkApi, surname, 1, "surnameError", 'Введите корректное отчество') || hasError;
            hasError = !validateField(thunkApi, password, 8, "passwordError", 'Пароль должен содержать не менее 8 символов') || hasError;

            if (password !== confirmPassword) {
                thunkApi.dispatch(singupSlice.actions.setError({
                    key: "confirmPasswordError",
                    error: 'Пароли не совпадают',
                }));

                hasError = true;
            }

            if (!emailRegex.test(login)) {
                thunkApi.dispatch(singupSlice.actions.setError(
                    { key: "loginError", error: 'Введите корректный адрес электронной почты' }
                ));
            }

            if (hasError) return;

            thunkApi.dispatch(singupSlice.actions.clearErrors());

            await authApi.singUpAdmin(login, role, password, name, lastname, surname);
            const responce = await authApi.loginUser(login, password);
            await authApi.createUniversity(universityName, responce.jwt);
            localStorage.setItem('authToken', responce.jwt);
            onSuccess?.();
        }
        catch (e) {
            thunkApi.dispatch(appStatusSlice.actions.setStatusApp({ status: "app-error" }))
        }
    }
)

const validateField = (
    thunkApi: any, 
    value: string, 
    minLength: number, 
    errorKey: string, 
    errorMessage: string
) => {
    if (value.length < minLength) {
        thunkApi.dispatch(singupSlice.actions.setError(
            { key: errorKey, error: errorMessage }
        ));
        return false;
    }
    return true;
};

export const signUpActionCreator = createAsyncThunk('sign-up/user',
    async (data: { 
        key: string,
        login: string, 
        password: string, 
        confirmPassword: string,
        role: string,
        name: string, 
        lastname: string, 
        surname: string,
        onSuccess?: () => void 
    }, thunkApi) => {
        const { login, password, name, key, lastname, confirmPassword,role, surname, onSuccess } = data;
        try {
            thunkApi.dispatch(singupSlice.actions.clearErrors());

            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            let hasError = false;
            
            hasError = !validateField(thunkApi, key, 1, "keyError", 'Введите ключ') || hasError;
            hasError = !validateField(thunkApi, name, 1, "nameError", 'Введите корректное имя') || hasError;
            hasError = !validateField(thunkApi, lastname, 1, "lastnameError", 'Введите корректную фамилию') || hasError;
            hasError = !validateField(thunkApi, surname, 1, "surnameError", 'Введите корректное отчество') || hasError;
            hasError = !validateField(thunkApi, password, 8, "passwordError", 'Пароль должен содержать не менее 8 символов') || hasError;

            if (password !== confirmPassword) {
                thunkApi.dispatch(singupSlice.actions.setError({
                    key: "confirmPasswordError",
                    error: 'Пароли не совпадают',
                }));

                hasError = true;
            }

            if (!emailRegex.test(login)) {
                thunkApi.dispatch(singupSlice.actions.setError(
                    { key: "loginError", error: 'Введите корректный адрес электронной почты' }
                ));
            }

            if (hasError) return;

            thunkApi.dispatch(singupSlice.actions.clearErrors());

            await authApi.singUp(key, login, role, password, name, lastname, surname);

            const responce = await authApi.loginUser(login, password);
            localStorage.setItem('authToken', responce.jwt);
            onSuccess?.();
        }
        catch (e) {
            if (axios.isAxiosError(e)) {
                thunkApi.dispatch(singupSlice.actions.setError(
                    { key: "keyError", error: e.response?.data.message }
                ));
            } else thunkApi.dispatch(appStatusSlice.actions.setStatusApp({ status: "app-error" }))
        }
    }
)

export default singupSlice.reducer;
