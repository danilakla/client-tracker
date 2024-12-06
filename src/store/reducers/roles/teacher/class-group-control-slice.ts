import { PayloadAction, createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { teacherApi } from "../../../../api/auth/teacher-api";
import axios from "axios";
import { appStatusSlice } from "../../app-status-slice";
import { ClassGroupData } from "./class-group-subroups-slice";

type ErrorType = string | null;

export type InitScreenData = {
    subgroup: {
        idSubgroup: number,
        subgroupNumber: string,
        admissionDate: string,
        idDean: number,
        idSpecialty: number
    }
    classGroup: ClassGroupData
}

export type StatisticOfStudent = {
    student: {
        surname: string,
        name: string,
        lastname: string,
    }
    grades: {
        idClass: number,
        idStudentGrate: number,
        grade: string | null,
        description: string | null,
        attendance: 0 | 1 | 2
    }[]
}

export type SubjectsState = {
    loading: "idle" | "loading" | "success" | "error";
    initData: InitScreenData | null;
    studentsStatistics: StatisticOfStudent[];
    errors: Record<string, ErrorType>;
    countClasses: number;
};

const initialState: SubjectsState = {
    loading: "idle",
    initData: null,
    studentsStatistics: [],
    errors: {},
    countClasses: 0,
};

const setErrorByKey = (state: SubjectsState, key: string, error: ErrorType) => {
    state.errors[key] = error;
};

export const classGroupControlSlice = createSlice({
    name: "class-group-control-slice",
    initialState: initialState,
    reducers: {
        setError(state, action: PayloadAction<{ key: string; error: ErrorType }>) {
            setErrorByKey(state, action.payload.key, action.payload.error);
        },
        setStudentsStatisticsActionCreator(state, action: PayloadAction<StatisticOfStudent[]>) {
            state.studentsStatistics = action.payload;
        },
        setCountClassesActionCreator(state, action: PayloadAction<number>) {
            state.countClasses = action.payload;
        },
        setClassGroupInfoActionCreator(state, action: PayloadAction<{initData: InitScreenData, onSuccess?: () => void}>) {
            state.initData = action.payload.initData;
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

export const initTableStatisticsActionCreator = createAsyncThunk('class-group-control-init',
    async (data: { authToken: string, idClassGroup: number, idSubgroup: number}, thunkApi ) => {
        const { authToken, idClassGroup, idSubgroup } = data;
        try {
            const responce = await teacherApi.getTableOfSubgroup(authToken, idClassGroup, idSubgroup);
            thunkApi.dispatch(classGroupControlSlice.actions.setStudentsStatisticsActionCreator(
                transformAndSortStudentsStatistics(responce)
            ));
            thunkApi.dispatch(classGroupControlSlice.actions.setCountClassesActionCreator(responce.classes.length));
        }
        catch (e) {
            if (axios.isAxiosError(e)) {
                if(e.response?.status === 401){
                    thunkApi.dispatch(appStatusSlice.actions.setStatusApp({ status: "no-autorizate" }))
                }
            } else {
            }
        }
    }
)

export default classGroupControlSlice.reducer;

function transformAndSortStudentsStatistics(input: {
    students: {
        idStudent: number;
        idSubgroup: number;
        flpName: string;
        keyStudentParents: string;
        idAccount: number;
    }[];
    classes: {
        idClass: number;
        idClassGroupToSubgroup: number;
        dateCreation: string;
    }[];
    studentGrades: {
        idStudentGrate: number;
        idStudent: number;
        idClass: number;
        grade: string | null;
        description: string | null;
        attendance: 0 | 1 | 2;
    }[];
}): StatisticOfStudent[] {
    const { students, studentGrades } = input;

    const result: StatisticOfStudent[] = students.map((student) => {
        const [surname, name, lastname] = student.flpName.split("_");

        const grades = studentGrades
            .filter((grade) => grade.idStudent === student.idStudent)
            .map((grade) => ({
                idClass: grade.idClass,
                idStudentGrate: grade.idStudentGrate,
                grade: grade.grade,
                description: grade.description,
                attendance: grade.attendance,
            }))
            .sort((a, b) => a.idClass - b.idClass); 

        return {
            student: { surname, name, lastname },
            grades,
        };
    });

    result.sort((a, b) => a.student.surname.localeCompare(b.student.surname));

    return result;
}