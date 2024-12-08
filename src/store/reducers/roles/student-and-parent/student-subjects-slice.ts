import { PayloadAction, createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { appStatusSlice } from "../../app-status-slice";
import { studentApi } from "../../../../api/auth/student-api";

type ErrorType = string | null;

export type ClassGroupInfo = {
    idClassGroup: number;
    idClassGroupToSubgroup: number;
    idSubgroup: number;
    subjectName: string;
    description: string;
    formatName: string;
    teacherName: string;
};

export type SubjectInfo = {
    subjectName: string;
    classGroups: ClassGroupInfo[];
};

export type StudentSubjectsState = {
    searchText: string;
    subjects: SubjectInfo[];
    loading: "idle" | "loading" | "success" | "error";
    errors: Record<string, ErrorType>;
};

const initialState: StudentSubjectsState = {
    subjects: [],
    searchText: '',
    loading: "idle",
    errors: {},
};

const setErrorByKey = (state: StudentSubjectsState, key: string, error: ErrorType) => {
    state.errors[key] = error;
};

export const studentSubjectsSlice = createSlice({
    name: "student-subjects-slice",
    initialState: initialState,
    reducers: {
        setError(state, action: PayloadAction<{ key: string; error: ErrorType }>) {
            setErrorByKey(state, action.payload.key, action.payload.error);
        },
        setSearchTextActionCreator(state, action: PayloadAction<string>) {
            state.searchText = action.payload;
        },
        setSubjectsActionCreator(state, action: PayloadAction<SubjectInfo[]>) {
            state.subjects = action.payload;
        },
        reset(state) {
            Object.assign(state, initialState);
        },
        resetStatus(state) {
            state.loading = 'idle';
        },
        clearErrors(state) {
            state.errors = {};
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(initStudentSubjectsActionCreator.fulfilled, (state) => {
                state.loading = 'success';
            })
            .addCase(initStudentSubjectsActionCreator.pending, (state) => {
                state.loading = 'loading';
            })
            .addCase(initStudentSubjectsActionCreator.rejected, (state) => {
                state.loading = "idle";
            })
    },
});

export const initStudentSubjectsActionCreator = createAsyncThunk('student-subjects-slice/init',
    async (data: { authToken: string}, thunkApi ) => {
        const { authToken } = data;
        try {
            const response = await studentApi.getSubjects(authToken);

            const groupedSubjects = groupBySubjectName(response);
            thunkApi.dispatch(studentSubjectsSlice.actions.setSubjectsActionCreator(groupedSubjects));
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

function groupBySubjectName(data: Array<any>): SubjectInfo[] {
    const subjectsMap: Record<string, SubjectInfo> = {};

    data.forEach(item => {
        if (!subjectsMap[item.subjectName]) {
            subjectsMap[item.subjectName] = {
                subjectName: item.subjectName,
                classGroups: []
            };
        }

        subjectsMap[item.subjectName].classGroups.push(item);
    });

    return Object.values(subjectsMap);
}


export default studentSubjectsSlice.reducer;