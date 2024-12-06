import { PayloadAction, createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { appStatusSlice } from "../../app-status-slice";
import { teacherApi } from "../../../../api/auth/teacher-api";
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
    extraReducers: (builder) => {
        // builder
        //     .addCase(initTeacherSubjectsActionCreator.fulfilled, (state) => {
        //         state.loading = 'success';
        //     })
        //     .addCase(initTeacherSubjectsActionCreator.pending, (state) => {
        //         state.loading = 'loading';
        //     })
        //     .addCase(initTeacherSubjectsActionCreator.rejected, (state) => {
        //         state.loading = "idle";
        //     })
    },
});

// export const initTeacherSubjectsActionCreator = createAsyncThunk('teacher-subjects',
//     async (data: { authToken: string}, thunkApi ) => {
//         const { authToken } = data;
//         try {
//             const responce = await teacherApi.getSubjects(authToken);
//             thunkApi.dispatch(classGroupsSlice.actions.setSubjectsActionCreator(responce));
//         }
//         catch (e) {
//             if (axios.isAxiosError(e)) {
//                 if(e.response?.status === 401){
//                     thunkApi.dispatch(appStatusSlice.actions.setStatusApp({ status: "no-autorizate" }))
//                 }
//             }
//         }
//     }
// )

export default classGroupsSlice.reducer;
