import { PayloadAction, createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { userApi } from "../../../api/auth/user-api";
import { appStatusSlice } from "../app-status-slice";

type ErrorType = string | null;

export type ChangePasswordState = {
    oldPassword: string;
    newPassword: string;
    confirmPassword: string;
    loading: "idle" | "loading" | "success" | "error";
    errors: Record<string, ErrorType>;
};

const initialState: ChangePasswordState = {
    oldPassword: "",
    newPassword: "",
    confirmPassword: '',
    loading: "idle",
    errors: {},
};

const setErrorByKey = (state: ChangePasswordState, key: string, error: ErrorType) => {
    state.errors[key] = error;
};

export const changePasswordSlice = createSlice({
    name: "change-password",
    initialState: initialState,
    reducers: {
        setOldPasswordActionCreater(state, action: PayloadAction<string>) {
            state.oldPassword = action.payload;
        },
        setNewPasswordActionCreater(state, action: PayloadAction<string>) {
            state.newPassword = action.payload;
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
            .addCase(changePasswordActionCreator.fulfilled, (state) => {
                state.loading = 'success';
            })
            .addCase(changePasswordActionCreator.pending, (state) => {
                state.loading = 'loading';
            })
            .addCase(changePasswordActionCreator.rejected, (state) => {
                state.loading = "idle";
            })
    },
});

export const changePasswordActionCreator = createAsyncThunk('profile/change-password',
    async (data: { 
            authToken: string, 
            oldPassword: string, 
            newPassword: string, 
            confirmPassword: string, 
            onSuccess?: () => void
        }, thunkApi ) => {
        const { authToken, oldPassword, newPassword, confirmPassword, onSuccess } = data;
        try {
            thunkApi.dispatch(changePasswordSlice.actions.clearErrors());

            if(oldPassword.length < 1){
                thunkApi.dispatch(changePasswordSlice.actions.setError({
                    key: "oldPasswordError",
                    error: 'Введите корректный пароль',
                }));
                
                return;
            }

            if(newPassword.length < 8){
                thunkApi.dispatch(changePasswordSlice.actions.setError({
                    key: "newPasswordError",
                    error: 'Пароль должен содержать не менее 8 символов',
                }));
                
                return;
            }

            if (newPassword !== confirmPassword) {
                thunkApi.dispatch(changePasswordSlice.actions.setError({
                    key: "confirmPasswordError",
                    error: 'Пароли не совпадают',
                }));

                return;
            }

            await userApi.changePassword(authToken, oldPassword, newPassword);
            onSuccess?.();
            thunkApi.dispatch(changePasswordSlice.actions.reset());
        }
        catch (e) {
            if (axios.isAxiosError(e)) {
                if(e.response?.status === 401){
                    thunkApi.dispatch(appStatusSlice.actions.setStatusApp({ status: "no-autorizate" }))
                }

                thunkApi.dispatch(changePasswordSlice.actions.setError(
                    { key: "oldPasswordError", error: e.response?.data.message }
                ));
            }
        }
    }
)

export default changePasswordSlice.reducer;
