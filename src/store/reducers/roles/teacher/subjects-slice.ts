import { PayloadAction, createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { appStatusSlice } from "../../app-status-slice";
import { teacherApi } from "../../../../api/auth/teacher-api";

type ErrorType = string | null;


export type ClassGroupInfo = {
    idClassGroup: number,
    description: string,
    formatName: string,
    teacherName: string
}

export type SubjectInfo = {
    subjectName: string,
    classGroups: ClassGroupInfo[]
};

export type SubjectsState = {
    searchText: string;
    subjects: SubjectInfo[];
    loading: "idle" | "loading" | "success" | "error";
    loadingCreate: "idle" | "loading" | "success" | "error";
    errors: Record<string, ErrorType>;
};

const initialState: SubjectsState = {
    subjects: [],
    searchText: '',
    loading: "idle",
    loadingCreate: 'idle',
    errors: {},
};

const setErrorByKey = (state: SubjectsState, key: string, error: ErrorType) => {
    state.errors[key] = error;
};

export const subjectsSlice = createSlice({
    name: "teacher-subjects",
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
            .addCase(initTeacherSubjectsActionCreator.fulfilled, (state) => {
                state.loading = 'success';
            })
            .addCase(initTeacherSubjectsActionCreator.pending, (state) => {
                state.loading = 'loading';
            })
            .addCase(initTeacherSubjectsActionCreator.rejected, (state) => {
                state.loading = "idle";
            })
    },
});

export const initTeacherSubjectsActionCreator = createAsyncThunk('teacher-subjects',
    async (data: { authToken: string}, thunkApi ) => {
        const { authToken } = data;
        try {
            const response = await teacherApi.getSubjects(authToken);

            const groupedSubjects = groupBySubjectName(response);

            thunkApi.dispatch(subjectsSlice.actions.setSubjectsActionCreator(groupedSubjects));
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

function groupBySubjectName(data: any[]): SubjectInfo[] {
    return data.reduce((acc, item) => {
        const subjectGroup = acc.find((group: SubjectInfo) => group.subjectName === item.subjectName);

        if (subjectGroup) {
            subjectGroup.classGroups.push({
                idClassGroup: item.idClassGroup,
                description: item.description,
                formatName: item.formatName,
                teacherName: item.teacherName,
            });
        } else {
            acc.push({
                subjectName: item.subjectName,
                classGroups: [{
                    idClassGroup: item.idClassGroup,
                    description: item.description,
                    formatName: item.formatName,
                    teacherName: item.teacherName,
                }],
            });
        }

        return acc;
    }, [] as SubjectInfo[]); 
}

export default subjectsSlice.reducer;
