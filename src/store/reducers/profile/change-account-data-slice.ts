import { PayloadAction, createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { userApi } from "../../../api/auth/user-api";
import axios from "axios";
import { userSlice } from "../user-slice";
import { appStatusSlice } from "../app-status-slice";

type ErrorType = string | null;

export type ChangeAccountDataState = {
    lastname: string;
    name: string;
    surname: string;
    loading: "idle" | "loading" | "success" | "error";
    errors: Record<string, ErrorType>;
};

const initialState: ChangeAccountDataState = {
    lastname: "",
    name: "",
    surname: '',
    loading: "idle",
    errors: {},
};

const setErrorByKey = (state: ChangeAccountDataState, key: string, error: ErrorType) => {
    state.errors[key] = error;
};

const MAX_LENGTH = 15;
const RUSSIAN_LETTERS_REGEX = /^[А-Яа-яёЁ]+$/;

export const changeAccountDataSlice = createSlice({
    name: "change-account-data",
    initialState: initialState,
    reducers: {
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
            .addCase(changeAccountDataActionCreator.fulfilled, (state) => {
                state.loading = 'success';
            })
            .addCase(changeAccountDataActionCreator.pending, (state) => {
                state.loading = 'loading';
            })
            .addCase(changeAccountDataActionCreator.rejected, (state) => {
                state.loading = "idle";
            })
    },
});

const validateField = (
    thunkApi: any, 
    value: string, 
    minLength: number, 
    errorKey: string, 
    errorMessage: string
) => {
    if (value.length < minLength) {
        thunkApi.dispatch(changeAccountDataSlice.actions.setError(
            { key: errorKey, error: errorMessage }
        ));
        return false;
    }
    return true;
};

export const changeAccountDataActionCreator = createAsyncThunk('/profile/change-account-data',
    async (data: { authToken: string, lastname: string, name: string, surname: string, onSuccess?: () => void}, thunkApi ) => {
        const { authToken, lastname, name, surname, onSuccess } = data;
        try {
            thunkApi.dispatch(changeAccountDataSlice.actions.clearErrors());
            
            let hasError = false;
            
            hasError = !validateField(thunkApi, name, 1, "nameError", 'Введите корректное имя') || hasError;
            hasError = !validateField(thunkApi, lastname, 1, "lastnameError", 'Введите корректную фамилию') || hasError;
            hasError = !validateField(thunkApi, surname, 1, "surnameError", 'Введите корректное отчество') || hasError;
            
            if (hasError) return;
            
            const responce = await userApi.changeAccountData(authToken, lastname, name, surname);
            
            thunkApi.dispatch(userSlice.actions.setUserActionCreater(responce));
            onSuccess?.();
            thunkApi.dispatch(changeAccountDataSlice.actions.reset());
        }
        catch (e) {
            if (axios.isAxiosError(e)) {
                if(e.response?.status === 401){
                    thunkApi.dispatch(appStatusSlice.actions.setStatusApp({ status: "no-autorizate" }))
                }
            }
        }
    }
)

export default changeAccountDataSlice.reducer;
