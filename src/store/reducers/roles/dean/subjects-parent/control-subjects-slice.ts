import { PayloadAction, createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { appStatusSlice } from "../../../app-status-slice";
import { deanApi } from "../../../../../api/auth/dean-api";

type ErrorType = string | null;

export type SubjectInfo = {
    idSubject: number,
    name: string,
    description: string,
    idDean: number
}

export type ControlSubjectsState = {
    searchText: string;
    name: string;
    subjects: SubjectInfo[];
    description: string;
    loading: "idle" | "loading" | "success" | "error";
    loadingCreate: "idle" | "loading" | "success" | "error";
    errors: Record<string, ErrorType>;
};

const initialState: ControlSubjectsState = {
    name: '',
    subjects: [],
    description: '',
    searchText: '',
    loading: "idle",
    loadingCreate: 'idle',
    errors: {},
};

const setErrorByKey = (state: ControlSubjectsState, key: string, error: ErrorType) => {
    state.errors[key] = error;
};

export const controlSubjectsSlice = createSlice({
    name: "dean-control-subjects",
    initialState: initialState,
    reducers: {
        setError(state, action: PayloadAction<{ key: string; error: ErrorType }>) {
            setErrorByKey(state, action.payload.key, action.payload.error);
        },
        removeSubjectActionCreator(state, action: PayloadAction<number>) {
            state.subjects = state.subjects.filter(
                (subject) => subject.idSubject !== action.payload
            );
        },
        updateSubjectActionCreator(state, action: PayloadAction<SubjectInfo>) {
            const index = state.subjects.findIndex(
                (subject) => subject.idSubject === action.payload.idSubject
            );
            if (index !== -1) {
                state.subjects[index] = action.payload;
            }
        },
        setSearchTextActionCreator(state, action: PayloadAction<string>) {
            state.searchText = action.payload;
        },
        setNameActionCreator(state, action: PayloadAction<string>) {
            state.name = action.payload;
        },
        setDescriptionActionCreator(state, action: PayloadAction<string>) {
            state.description = action.payload;
        },
        setSubjectsActionCreator(state, action: PayloadAction<SubjectInfo[]>) {
            state.subjects = action.payload;
        },
        addSubjectActionCreator(state, action: PayloadAction<SubjectInfo>) {
            state.subjects = [...state.subjects, action.payload];
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
            .addCase(initSubjectsActionCreator.fulfilled, (state) => {
                state.loading = 'success';
            })
            .addCase(initSubjectsActionCreator.pending, (state) => {
                state.loading = 'loading';
            })
            .addCase(initSubjectsActionCreator.rejected, (state) => {
                state.loading = "idle";
            })

            .addCase(createSubjectActionCreator.fulfilled, (state) => {
                state.loadingCreate = 'success';
            })
            .addCase(createSubjectActionCreator.pending, (state) => {
                state.loadingCreate = 'loading';
            })
            .addCase(createSubjectActionCreator.rejected, (state) => {
                state.loadingCreate = "idle";
            })
    },
});

export const initSubjectsActionCreator = createAsyncThunk('dean-control-subjects/initialize',
    async (data: { authToken: string}, thunkApi ) => {
        const { authToken } = data;
        try {
            const responce = await deanApi.getSubjects(authToken);
            thunkApi.dispatch(controlSubjectsSlice.actions.setSubjectsActionCreator(responce));
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

export const createSubjectActionCreator = createAsyncThunk('dean-control-subjects/create',
    async (data: { authToken: string, name: string, description: string ,onSuccess: () => void}, thunkApi ) => {
        const { authToken, name, description, onSuccess } = data;
        try {
            thunkApi.dispatch(controlSubjectsSlice.actions.clearErrors());

            if(name.trim().length < 1){
                thunkApi.dispatch(controlSubjectsSlice.actions.setError({
                    key: "nameError",
                    error: 'Введите корректное название',
                }));
                
                return;
            }

            const responce = await deanApi.createSubject(authToken, name.trim(), description.trim());
            thunkApi.dispatch(controlSubjectsSlice.actions.addSubjectActionCreator(responce));
            onSuccess();
        }
        catch (e) {
            if (axios.isAxiosError(e)) {
                if(e.response?.status === 401){
                    thunkApi.dispatch(appStatusSlice.actions.setStatusApp({ status: "no-autorizate" }))
                } else {
                    thunkApi.dispatch(controlSubjectsSlice.actions.setError({
                        key: "nameError",
                        error: e.response?.data.message
                    }));
                }
            }
        }
    }
)

export default controlSubjectsSlice.reducer;
