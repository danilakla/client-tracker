import { PayloadAction, createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { controlSubjectsSlice, SubjectInfo } from "./control-subjects-slice";
import { deanApi } from "../../../../../api/auth/dean-api";
import { appStatusSlice } from "../../../app-status-slice";
import axios from "axios";

type ErrorType = string | null;

export type ClassGroupInfo = {
    idClassGroup: number,
    idSubject: number,
    description: string,
    idClassFormat: number,
    idTeacher: number,
    idDean: number
}

export type ClassGroupsState = {
    searchText: string;
    loading: "idle" | "loading" | "success" | "error";
    loadingUpdate: "idle" | "loading" | "success" | "error";
    loadingDelete: "idle" | "loading" | "success" | "error";
    errors: Record<string, ErrorType>;
    selectedSubject: SubjectInfo | null;
    classGroups: ClassGroupInfo[];
    name: string;
    description: string;
};

const initialState: ClassGroupsState = {
    searchText: '',
    classGroups: [],
    loadingUpdate: 'idle',
    loading: "idle",
    loadingDelete: 'idle',
    selectedSubject: null,
    errors: {},
    name: '',
    description: ''
};

const setErrorByKey = (state: ClassGroupsState, key: string, error: ErrorType) => {
    state.errors[key] = error;
};

export const classGroupsSlice = createSlice({
    name: "dean-class-groups-slice",
    initialState: initialState,
    reducers: {
        setError(state, action: PayloadAction<{ key: string; error: ErrorType }>) {
            setErrorByKey(state, action.payload.key, action.payload.error);
        },
        setSearchTextActionCreator(state, action: PayloadAction<string>) {
            state.searchText = action.payload;
        },
        updateSubjectActionCreator(state, action: PayloadAction<SubjectInfo>) {
            if(state.selectedSubject !== null){
                state.selectedSubject.name = action.payload.name;
                state.selectedSubject.description = action.payload.description;
            }
        },
        setNameActionCreator(state, action: PayloadAction<string>) {
            state.name = action.payload;
        },
        setDescriptionActionCreator(state, action: PayloadAction<string>) {
            state.description = action.payload;
        },
        setSelectedSubjectActionCreator(state, action: PayloadAction<{value: SubjectInfo, onSuccess: () => void}>) {
            state.selectedSubject = action.payload.value;
            action.payload.onSuccess();
        },
        setClassGroupsActionCreator(state, action: PayloadAction<ClassGroupInfo[]>) {
            state.classGroups = action.payload;
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
            .addCase(initClassGroupsActionCreator.fulfilled, (state) => {
                state.loading = 'success';
            })
            .addCase(initClassGroupsActionCreator.pending, (state) => {
                state.loading = 'loading';
            })
            .addCase(initClassGroupsActionCreator.rejected, (state) => {
                state.loading = "idle";
            })

            .addCase(updateSubjectActionCreator.fulfilled, (state) => {
                state.loadingUpdate = 'success';
            })
            .addCase(updateSubjectActionCreator.pending, (state) => {
                state.loadingUpdate = 'loading';
            })
            .addCase(updateSubjectActionCreator.rejected, (state) => {
                state.loadingUpdate = "idle";
            })

            .addCase(deleteSubjectActionCreator.fulfilled, (state) => {
                state.loadingDelete = 'success';
            })
            .addCase(deleteSubjectActionCreator.pending, (state) => {
                state.loadingDelete = 'loading';
            })
            .addCase(deleteSubjectActionCreator.rejected, (state) => {
                state.loadingDelete = "idle";
            })
    },
});

export const initClassGroupsActionCreator = createAsyncThunk('dean-class-groups-slice/initialize',
    async (data: { authToken: string, id: number}, thunkApi ) => {
        const { authToken, id } = data;
        try {
            const responce = await deanApi.getClassGroupsBySubject(authToken, id);
            thunkApi.dispatch(classGroupsSlice.actions.setClassGroupsActionCreator(responce));
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

export const updateSubjectActionCreator = createAsyncThunk('dean-control-subjects/update',
    async (data: { authToken: string, id: number, name: string, description: string ,onSuccess: () => void}, thunkApi ) => {
        const { authToken, name, description, id, onSuccess } = data;
        try {
            const responce = await deanApi.updateSubject(authToken, id, name.trim(), description.trim());
            thunkApi.dispatch(controlSubjectsSlice.actions.updateSubjectActionCreator(responce));
            thunkApi.dispatch(classGroupsSlice.actions.updateSubjectActionCreator(responce));
            onSuccess();
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

export const deleteSubjectActionCreator = createAsyncThunk('dean-control-subjects/delete',
    async (data: { authToken: string, id: number, onSuccess: () => void}, thunkApi ) => {
        const { authToken, id, onSuccess } = data;
        try {
            await deanApi.deleteSubject(authToken, id);
            thunkApi.dispatch(controlSubjectsSlice.actions.removeSubjectActionCreator(id));
            onSuccess();
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

export default classGroupsSlice.reducer;
