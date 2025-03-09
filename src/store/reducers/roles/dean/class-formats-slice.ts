import { PayloadAction, createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { appStatusSlice } from "../../app-status-slice";
import axios from "axios";
import { deanApi } from "../../../../api/auth/dean-api";

type ErrorType = string | null;

export type ClassFormatInfo = {
    idClassFormat: number,
    formatName: string,
    description: string,
    idDean: number
}

export type ClassFormatsState = {
    searchText: string;
    selectedClassFormat: ClassFormatInfo;
    newNameOfClassFormat: string;
    newInfoOfClassFormat: string;
    classFormats: ClassFormatInfo[];
    loadingAction: "idle" | "loading" | "success" | "error";
    loading: "idle" | "loading" | "success" | "error";
    loadingDelete: "idle" | "loading" | "success" | "error";
    errors: Record<string, ErrorType>;
};

const initialState: ClassFormatsState = {
    selectedClassFormat: {
        idClassFormat: -1,
        formatName: '',
        description: '',
        idDean: 1
    },
    classFormats: [], 
    newNameOfClassFormat: '',
    newInfoOfClassFormat: '',
    searchText: '',
    loadingAction: 'idle',
    loadingDelete: 'idle',
    loading: 'idle',
    errors: {},
};

const setErrorByKey = (state: ClassFormatsState, key: string, error: ErrorType) => {
    state.errors[key] = error;
};

export const classFormatsSlice = createSlice({
    name: "dean-class-formats",
    initialState: initialState,
    reducers: {
        setError(state, action: PayloadAction<{ key: string; error: ErrorType }>) {
            setErrorByKey(state, action.payload.key, action.payload.error);
        },
        setSearchTextActionCreator(state, action: PayloadAction<string>) {
            state.searchText = action.payload;
        },
        setSelectedClassFormatActionCreator(state, action: PayloadAction<ClassFormatInfo>) {
            state.selectedClassFormat = action.payload;
        },
        setClassFormatsActionCreator(state, action: PayloadAction<ClassFormatInfo[]>) {
            state.classFormats = action.payload;
        },
        setNewInfoOfClassFormatActionCreator(state, action: PayloadAction<string>) {
            state.newInfoOfClassFormat = action.payload;
        },
        setNewNameOfClassFormatActionCreator(state, action: PayloadAction<string>) {
            state.newNameOfClassFormat = action.payload;
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
            .addCase(initClassFormatsDataActionCreator.fulfilled, (state) => {
                state.loading = 'success';
            })
            .addCase(initClassFormatsDataActionCreator.pending, (state) => {
                state.loading = 'loading';
            })
            .addCase(initClassFormatsDataActionCreator.rejected, (state) => {
                state.loading = "idle";
            })

            .addCase(addClassFormatActionCreator.fulfilled, (state) => {
                state.loadingAction = 'success';
            })
            .addCase(addClassFormatActionCreator.pending, (state) => {
                state.loadingAction = 'loading';
            })
            .addCase(addClassFormatActionCreator.rejected, (state) => {
                state.loadingAction = "idle";
            })
            .addCase(updateClassFormatActionCreator.fulfilled, (state) => {
                state.loadingAction = 'success';
            })
            .addCase(updateClassFormatActionCreator.pending, (state) => {
                state.loadingAction = 'loading';
            })
            .addCase(updateClassFormatActionCreator.rejected, (state) => {
                state.loadingAction = "idle";
            })
            .addCase(deleteClassFormatActionCreator.fulfilled, (state) => {
                state.loadingDelete = 'success';
            })
            .addCase(deleteClassFormatActionCreator.pending, (state) => {
                state.loadingDelete = 'loading';
            })
            .addCase(deleteClassFormatActionCreator.rejected, (state) => {
                state.loadingDelete = "idle";
            })
    },
});

export const initClassFormatsDataActionCreator = createAsyncThunk('dean-class-formats/initialize',
    async (data: { authToken: string}, thunkApi ) => {
        const { authToken } = data;
        try {
            const responce = await deanApi.getClassFormats(authToken);
            thunkApi.dispatch(classFormatsSlice.actions.setClassFormatsActionCreator(responce));
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

export const addClassFormatActionCreator = createAsyncThunk('dean-class-formats/add-class-format',
    async (data: { authToken: string, formatName: string, description: string,onSuccess?: () => void}, thunkApi ) => {
        const { authToken, formatName, description, onSuccess } = data;
        try {
            thunkApi.dispatch(classFormatsSlice.actions.clearErrors());

            if(formatName.trim().length < 1){
                thunkApi.dispatch(classFormatsSlice.actions.setError({
                    key: "newNameOfClassFormatError",
                    error: 'Введите корректное название',
                }));
                
                return;
            }

            await deanApi.createClassFormat(authToken, formatName.trim(), description.trim());
            const responce = await deanApi.getClassFormats(authToken);
            thunkApi.dispatch(classFormatsSlice.actions.setClassFormatsActionCreator(responce));
            onSuccess?.();
        }
        catch (e) {
            if (axios.isAxiosError(e)) {
                if(e.response?.status === 401){
                    thunkApi.dispatch(appStatusSlice.actions.setStatusApp({ status: "no-autorizate" }))
                } else {
                    thunkApi.dispatch(classFormatsSlice.actions.setError({
                        key: "newNameOfClassFormatError",
                        error: e.response?.data.message,
                    }));
                }
            } else thunkApi.dispatch(appStatusSlice.actions.setStatusApp({ status: "app-error" }))
        }
    }
)

export const updateClassFormatActionCreator = createAsyncThunk('dean-class-formats/update-class-format',
    async (data: { authToken: string, id: number, formatName: string, description: string, onSuccess?: () => void}, thunkApi ) => {
        const { authToken, id, formatName, description, onSuccess } = data;
        try {
            if(formatName.trim().length < 1){
                thunkApi.dispatch(classFormatsSlice.actions.setError({
                    key: "newNameOfClassFormatError",
                    error: 'Введите корректное название',
                }));
                
                return;
            }

            await deanApi.updateClassFormat(authToken, id, formatName.trim(), description.trim());
            const responce = await deanApi.getClassFormats(authToken);
            thunkApi.dispatch(classFormatsSlice.actions.setClassFormatsActionCreator(responce));
            onSuccess?.();
        }
        catch (e) {
            if (axios.isAxiosError(e)) {
                if(e.response?.status === 401){
                    thunkApi.dispatch(appStatusSlice.actions.setStatusApp({ status: "no-autorizate" }))
                } else {
                    thunkApi.dispatch(classFormatsSlice.actions.setError({
                        key: "newNameOfClassFormatError",
                        error: e.response?.data.message,
                    }));
                }
            } else thunkApi.dispatch(appStatusSlice.actions.setStatusApp({ status: "app-error" }))
        }
    }
)

export const deleteClassFormatActionCreator = createAsyncThunk('dean-class-formats/delete-class-format',
    async (data: { authToken: string, id: number, onSuccess?: () => void}, thunkApi ) => {
        const { authToken, id, onSuccess } = data;
        try {
            await deanApi.deleteClassFormats(authToken, id);
            const responce = await deanApi.getClassFormats(authToken);
            thunkApi.dispatch(classFormatsSlice.actions.setClassFormatsActionCreator(responce));
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

export default classFormatsSlice.reducer;
