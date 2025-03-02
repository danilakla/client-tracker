import { PayloadAction, createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { universityApi } from "../../../../api/auth/university-api";
import axios from "axios";
import { appStatusSlice } from "../../app-status-slice";

type ErrorType = string | null;

export type UniversityInfoState = {
    name: string,
    description: string,
    idUniversity: number
};

export type UniversityEditorState = {
    university: UniversityInfoState,
    loading: "idle" | "loading" | "success" | "error";
    loadingData: "idle" | "loading" | "success" | "error";
    errors: Record<string, ErrorType>;
};

const initialState: UniversityEditorState = {
    university: {
        name: '',
        description: '',
        idUniversity: 0
    },
    loading: "idle",
    loadingData: 'idle',
    errors: {},
};

const setErrorByKey = (state: UniversityEditorState, key: string, error: ErrorType) => {
    state.errors[key] = error;
};

export const universityEditorSlice = createSlice({
    name: "admin-university-editor",
    initialState: initialState,
    reducers: {
        setError(state, action: PayloadAction<{ key: string; error: ErrorType }>) {
            setErrorByKey(state, action.payload.key, action.payload.error);
        },
        setNameUniversityActionCreater(state, action: PayloadAction<string>){
            state.university.name = action.payload;
        },
        setDescriptionUniversityActionCreater(state, action: PayloadAction<string>){
            state.university.description = action.payload;
        },
        reset(state) {
            Object.assign(state, initialState);
        },
        setUniversityInfoActionCreater(state, action: PayloadAction<UniversityInfoState>){
            state.university = action.payload;
        },
        clearErrors(state) {
            state.errors = {};
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(initializationUniversityInfoActionCreator.fulfilled, (state) => {
                state.loadingData = 'success';
            })
            .addCase(initializationUniversityInfoActionCreator.pending, (state) => {
                state.loadingData = 'loading';
            })
            .addCase(initializationUniversityInfoActionCreator.rejected, (state) => {
                state.loadingData = "idle";
            })
            .addCase(changeUniversityInfoActionCreator.fulfilled, (state) => {
                state.loading = 'success';
            })
            .addCase(changeUniversityInfoActionCreator.pending, (state) => {
                state.loading = 'loading';
            })
            .addCase(changeUniversityInfoActionCreator.rejected, (state) => {
                state.loading = "idle";
            })
    },
});

export const initializationUniversityInfoActionCreator = createAsyncThunk('admin-university-editor/initialize',
    async (data: { authToken: string}, thunkApi ) => {
        const { authToken } = data;
        try {
            const responce = await universityApi.getUniversityInfo(authToken);
            thunkApi.dispatch(universityEditorSlice.actions.setUniversityInfoActionCreater(responce));
        }
        catch (e) {
            if (axios.isAxiosError(e)) {
                if(e.response?.status === 401){
                    thunkApi.dispatch(appStatusSlice.actions.setStatusApp({ status: "no-autorizate" }))
                } else thunkApi.dispatch(appStatusSlice.actions.setStatusApp({ status: "app-error" }))
            } else thunkApi.dispatch(appStatusSlice.actions.setStatusApp({ status: "app-error" }))
        } 
    }
)

export const changeUniversityInfoActionCreator = createAsyncThunk('admin-university-editor/update',
    async (data: { authToken: string,id: number, name: string, description: string, onSuccess?: () => void}, thunkApi ) => {
        const { authToken, name, id, description, onSuccess } = data;
        try {
            thunkApi.dispatch(universityEditorSlice.actions.clearErrors());

            if(name.length < 1){
                thunkApi.dispatch(universityEditorSlice.actions.setError({
                    key: "universityNameError",
                    error: 'Введите корректное название',
                }));
                
                return;
            }

            await universityApi.changeUniversityInfo(authToken,id, name, description);

            onSuccess?.();
        }
        catch (e) {
            if (axios.isAxiosError(e)) {
                if(e.response?.status === 401){
                    thunkApi.dispatch(appStatusSlice.actions.setStatusApp({ status: "no-autorizate" }))
                } else thunkApi.dispatch(appStatusSlice.actions.setStatusApp({ status: "app-error" }))
            } else thunkApi.dispatch(appStatusSlice.actions.setStatusApp({ status: "app-error" }))
        }
    }
)

export default universityEditorSlice.reducer;
