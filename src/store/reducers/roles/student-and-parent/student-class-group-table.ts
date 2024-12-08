import { PayloadAction, createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { appStatusSlice } from "../../app-status-slice";
import { studentApi } from "../../../../api/auth/student-api";
import { ClassGroupInfo } from "./student-subjects-slice";

type ErrorType = string | null;

export type GradeInfo = {
    idClass: number,
    idStudentGrate: number,
    grade: number | null,
    idStudent: number,
    description: string | null,
    attendance: 0 | 1 | 2 | 3
}

export type StatisticOfStudent = {
    student: {
        surname: string,
        name: string,
        lastname: string,
        idStudent: number
    }
    grades: GradeInfo[]
}

export type StudentClassGroupTableState = {
    loading: "idle" | "loading" | "success" | "error";
    classGroup: ClassGroupInfo | null;
    studentsStatistics: StatisticOfStudent[];
    errors: Record<string, ErrorType>;
    countClasses: number;
}

const initialState: StudentClassGroupTableState = {
    loading: "idle",
    classGroup: null,
    studentsStatistics: [],
    errors: {},
    countClasses: 0
};

const setErrorByKey = (state: StudentClassGroupTableState, key: string, error: ErrorType) => {
    state.errors[key] = error;
};

export const studentClassGroupTableSlice = createSlice({
    name: "student-class-group-table-slice",
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
        setClassGroupInfoActionCreator(state, action: PayloadAction<{classGroupData: ClassGroupInfo, onSuccess?: () => void}>) {
            state.classGroup = action.payload.classGroupData;
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
        builder
            .addCase(initStudntTableStatisticsActionCreator.fulfilled, (state) => {
                state.loading = 'success';
            })
            .addCase(initStudntTableStatisticsActionCreator.pending, (state) => {
                state.loading = 'loading';
            })
            .addCase(initStudntTableStatisticsActionCreator.rejected, (state) => {
                state.loading = "idle";
            })
    },
});

export const initStudntTableStatisticsActionCreator = createAsyncThunk('student-class-group-table/init',
    async (data: { authToken: string, idClassGroupToSubgroup: number, idSubgroup: number}, thunkApi ) => {
        const { authToken, idClassGroupToSubgroup, idSubgroup } = data;
        try {
            const responce = await studentApi.getTableOfSubgroup(authToken, idClassGroupToSubgroup, idSubgroup);
            thunkApi.dispatch(studentClassGroupTableSlice.actions.setStudentsStatisticsActionCreator(
                transformAndSortStudentsStatistics(responce)
            ));
            thunkApi.dispatch(studentClassGroupTableSlice.actions.setCountClassesActionCreator(responce.classes.length));
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

export default studentClassGroupTableSlice.reducer;

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
        grade: number | null;
        description: string | null;
        attendance: 0 | 1 | 2;
    }[];
}): StatisticOfStudent[] {
    const { students, studentGrades } = input;

    const result: StatisticOfStudent[] = students.map((student) => {
        const [surname, name, lastname] = student.flpName.split("_");
        const idStudent = student.idStudent;

        const grades = studentGrades
            .filter((grade) => grade.idStudent === student.idStudent)
            .map((grade) => ({
                idClass: grade.idClass,
                idStudentGrate: grade.idStudentGrate,
                grade: grade.grade,
                idStudent: idStudent,
                description: grade.description,
                attendance: grade.attendance,
            }))
            .sort((a, b) => a.idClass - b.idClass); 

        return {
            student: { surname, name, lastname, idStudent },
            grades,
        };
    });

    result.sort((a, b) => a.student.surname.localeCompare(b.student.surname));

    return result;
}