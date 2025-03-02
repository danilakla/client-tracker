import { PayloadAction, createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { appStatusSlice } from "../../app-status-slice";
import axios from "axios";
import { deanApi } from "../../../../api/auth/dean-api";

type ErrorType = string | null;

export type SpecialtyInfo = {
    idSpecialty: number;
    name: string;
    idDean: number;
}

export type SpecialtyState = {
    searchText: string;
    selectedSpecialty: SpecialtyInfo;
    newNameOfSpecialty: string;
    specialties: SpecialtyInfo[];
    loadingAction: "idle" | "loading" | "success" | "error";
    loading: "idle" | "loading" | "success" | "error";
    loadingDelete: "idle" | "loading" | "success" | "error";
    errors: Record<string, ErrorType>;
};

const initialState: SpecialtyState = {
    selectedSpecialty: {
        idDean: -1,
        idSpecialty: -1,
        name: ''
    },
    specialties: [], 
    newNameOfSpecialty: '',
    searchText: '',
    loadingAction: 'idle',
    loadingDelete: 'idle',
    loading: 'idle',
    errors: {},
};

const setErrorByKey = (state: SpecialtyState, key: string, error: ErrorType) => {
    state.errors[key] = error;
};

export const specialtiesSlice = createSlice({
    name: "dean-specialties",
    initialState: initialState,
    reducers: {
        setError(state, action: PayloadAction<{ key: string; error: ErrorType }>) {
            setErrorByKey(state, action.payload.key, action.payload.error);
        },
        setSearchTextActionCreator(state, action: PayloadAction<string>) {
            state.searchText = action.payload;
        },
        setSelectedSpecialtyActionCreator(state, action: PayloadAction<SpecialtyInfo>) {
            state.selectedSpecialty = action.payload;
        },
        setSpecialtiesActionCreator(state, action: PayloadAction<SpecialtyInfo[]>) {
            state.specialties = action.payload;
        },
        setNewNameOfSpecialtyActionCreator(state, action: PayloadAction<string>) {
            state.newNameOfSpecialty = action.payload;
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
            .addCase(initSpecialtiesDataActionCreator.fulfilled, (state) => {
                state.loading = 'success';
            })
            .addCase(initSpecialtiesDataActionCreator.pending, (state) => {
                state.loading = 'loading';
            })
            .addCase(initSpecialtiesDataActionCreator.rejected, (state) => {
                state.loading = "idle";
            })

            .addCase(addSpecialtyActionCreator.fulfilled, (state) => {
                state.loadingAction = 'success';
            })
            .addCase(addSpecialtyActionCreator.pending, (state) => {
                state.loadingAction = 'loading';
            })
            .addCase(addSpecialtyActionCreator.rejected, (state) => {
                state.loadingAction = "idle";
            })
            .addCase(updateSpecialtyActionCreator.fulfilled, (state) => {
                state.loadingAction = 'success';
            })
            .addCase(updateSpecialtyActionCreator.pending, (state) => {
                state.loadingAction = 'loading';
            })
            .addCase(updateSpecialtyActionCreator.rejected, (state) => {
                state.loadingAction = "idle";
            })
            .addCase(deleteSpecialtyActionCreator.fulfilled, (state) => {
                state.loadingDelete = 'success';
            })
            .addCase(deleteSpecialtyActionCreator.pending, (state) => {
                state.loadingDelete = 'loading';
            })
            .addCase(deleteSpecialtyActionCreator.rejected, (state) => {
                state.loadingDelete = "idle";
            })
    },
});

export const initSpecialtiesDataActionCreator = createAsyncThunk('dean-specialies/initialize',
    async (data: { authToken: string}, thunkApi ) => {
        const { authToken } = data;
        try {
            const responce = await deanApi.getSpecialties(authToken);
            thunkApi.dispatch(specialtiesSlice.actions.setSpecialtiesActionCreator(responce));
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

export const addSpecialtyActionCreator = createAsyncThunk('dean-specialies/add-specialty',
    async (data: { authToken: string, name: string, onSuccess?: () => void}, thunkApi ) => {
        const { authToken, name, onSuccess } = data;
        try {
            thunkApi.dispatch(specialtiesSlice.actions.clearErrors());

            if(name.length < 1){
                thunkApi.dispatch(specialtiesSlice.actions.setError({
                    key: "newNameOfSpecialtyError",
                    error: 'Введите корректное название',
                }));
                
                return;
            }

            await deanApi.createSpecialty(authToken, name);
            const responce = await deanApi.getSpecialties(authToken);
            thunkApi.dispatch(specialtiesSlice.actions.setSpecialtiesActionCreator(responce));
            onSuccess?.();
        }
        catch (e) {
            if (axios.isAxiosError(e)) {
                if(e.response?.status === 401){
                    thunkApi.dispatch(appStatusSlice.actions.setStatusApp({ status: "no-autorizate" }))
                } else {
                    thunkApi.dispatch(specialtiesSlice.actions.setError({
                        key: "newNameOfSpecialtyError",
                        error: e.response?.data.message,
                    }));
                }
            } else thunkApi.dispatch(appStatusSlice.actions.setStatusApp({ status: "app-error" }))
        }
    }
)

export const updateSpecialtyActionCreator = createAsyncThunk('dean-specialies/update-specialty',
    async (data: { authToken: string, id: number, name: string, onSuccess?: () => void}, thunkApi ) => {
        const { authToken, id, name, onSuccess } = data;
        try {
            if(name.length < 1){
                thunkApi.dispatch(specialtiesSlice.actions.setError({
                    key: "newNameOfSpecialtyError",
                    error: 'Введите корректное название',
                }));
                
                return;
            }

            await deanApi.updateSpecialty(authToken, id, name);
            const responce = await deanApi.getSpecialties(authToken);
            thunkApi.dispatch(specialtiesSlice.actions.setSpecialtiesActionCreator(responce));
            onSuccess?.();
        }
        catch (e) {
            if (axios.isAxiosError(e)) {
                if(e.response?.status === 401){
                    thunkApi.dispatch(appStatusSlice.actions.setStatusApp({ status: "no-autorizate" }))
                } else {
                    thunkApi.dispatch(specialtiesSlice.actions.setError({
                        key: "newNameOfSpecialtyError",
                        error: e.response?.data.message,
                    }));
                }
            } else thunkApi.dispatch(appStatusSlice.actions.setStatusApp({ status: "app-error" }))
        }
    }
)

export const deleteSpecialtyActionCreator = createAsyncThunk('dean-specialies/delete-specialty',
    async (data: { authToken: string, id: number, onSuccess?: () => void}, thunkApi ) => {
        const { authToken, id, onSuccess } = data;
        try {
            await deanApi.deleteSpecialty(authToken, id);
            const responce = await deanApi.getSpecialties(authToken);
            thunkApi.dispatch(specialtiesSlice.actions.setSpecialtiesActionCreator(responce));
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

export default specialtiesSlice.reducer;
