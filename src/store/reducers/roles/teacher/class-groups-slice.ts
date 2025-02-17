import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { ClassGroupInfo } from "./subjects-slice";

type ErrorType = string | null;


export type ClassGroupsState = {
    subjectName: string | null,
    searchText: string;
    classGroups: ClassGroupInfo[];
    loading: "idle" | "loading" | "success" | "error";
    errors: Record<string, ErrorType>;
};

const initialState: ClassGroupsState = {
    subjectName: null,
    classGroups: [],
    searchText: '',
    loading: "idle",
    errors: {},
};

const setErrorByKey = (state: ClassGroupsState, key: string, error: ErrorType) => {
    state.errors[key] = error;
};

export const classGroupsSlice = createSlice({
    name: "teacher-class-groups",
    initialState: initialState,
    reducers: {
        setError(state, action: PayloadAction<{ key: string; error: ErrorType }>) {
            setErrorByKey(state, action.payload.key, action.payload.error);
        },
        setSearchTextActionCreator(state, action: PayloadAction<string>) {
            state.searchText = action.payload;
        },
        setClassGroupsActionCreator(state, action: PayloadAction<{ classGroups: ClassGroupInfo[], subjectName: string, onSuccess?: () => void}>) {
            state.classGroups = action.payload.classGroups;
            state.subjectName = action.payload.subjectName;
            action.payload.onSuccess?.();
        },
        reset(state) {
            Object.assign(state, initialState);
        },
        clearErrors(state) {
            state.errors = {};
        },
    },
});

export default classGroupsSlice.reducer;
