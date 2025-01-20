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
        idStudent: number,
        idAccount: number
    },
    grades: GradeInfo[]
}

export type RedisKeyDataType = {
    classId: number,
    expiration: number,
} 

export type StudentClassGroupTableState = {
    loading: "idle" | "loading" | "success" | "error";
    classGroup: ClassGroupInfo | null;
    studentsStatistics: StatisticOfStudent[];
    errors: Record<string, ErrorType>;
    classesIds: number[];
    selectedGrade: GradeInfo;
    selectedClass: HeaderClassType;

    redisKeyData: RedisKeyDataType | null;
    loadingKey: "idle" | "loading" | "success" | "error";
    loadingReview: "idle" | "loading" | "success" | "error";
    loadingScan: "idle" | "loading" | "success" | "error";
}

export type HeaderClassType = {
    id: number;
    position: number
}

const initialState: StudentClassGroupTableState = {
    loading: "idle",
    classGroup: null,
    studentsStatistics: [],
    selectedGrade: {
        idClass: -1,
        idStudent: -1,
        idStudentGrate: -1,
        grade: null,
        description: null,
        attendance: 0
    },
    errors: {},
    classesIds: [],

    redisKeyData: null,
    selectedClass: {
        id: -1,
        position: -1
    },
    loadingReview: 'idle',
    loadingScan: 'idle',
    loadingKey: 'idle'
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
        setClassGroupInfoActionCreator(state, action: PayloadAction<{classGroupData: ClassGroupInfo, onSuccess?: () => void}>) {
            state.classGroup = action.payload.classGroupData;
            action.payload.onSuccess?.();
        },
        setSelectedGradeActionCreator(state, action: PayloadAction<{gradeInfo: GradeInfo, onSuccess: () => void}>) {
            state.selectedGrade = action.payload.gradeInfo;
            action.payload.onSuccess();
        },
        setSelectedClassActionCreator(state, action: PayloadAction<{value: HeaderClassType, onSuccess: () => void}>) {
            state.selectedClass = action.payload.value;
            action.payload.onSuccess();
        },
        setClassesIdsActionCreator(state, action: PayloadAction<number[]>) {
            state.classesIds = action.payload;
        },
        setRedisKeyDataActionCreator(state, action: PayloadAction<RedisKeyDataType | null>) {
            state.redisKeyData = action.payload;
        },
        reset(state) {
            Object.assign(state, initialState);
        },
        resetSelectedGrade(state) {
            state.selectedGrade = {
                idClass: -1,
                idStudent: -1,
                idStudentGrate: -1,
                grade: null,
                description: null,
                attendance: 0
            };
        },
        clearErrors(state) {
            state.errors = {};
        },
        clearRedisKeyActionCreator(state) {
            state.redisKeyData = null;
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

            .addCase(getKeyForQrActionCreator.fulfilled, (state) => {
                state.loadingKey = 'success';
            })
            .addCase(getKeyForQrActionCreator.pending, (state) => {
                state.loadingKey = 'loading';
            })
            .addCase(getKeyForQrActionCreator.rejected, (state) => {
                state.loadingKey = "idle";
            })

            .addCase(askReviewActionCreator.fulfilled, (state) => {
                state.loadingReview = 'success';
            })
            .addCase(askReviewActionCreator.pending, (state) => {
                state.loadingReview = 'loading';
            })
            .addCase(askReviewActionCreator.rejected, (state) => {
                state.loadingReview = "idle";
            })
    },
});

export const initStudntTableStatisticsActionCreator = createAsyncThunk('student-class-group-table/init',
    async (data: { authToken: string, idHold: number, idSubgroup: number, role: "ROLE_STUDENT" | "ROLE_PARENTS"}, thunkApi ) => {
        const { authToken, idHold } = data;
        try {
            const responce = await studentApi.getTableOfSubgroup(authToken, idHold);
            thunkApi.dispatch(studentClassGroupTableSlice.actions.setStudentsStatisticsActionCreator(
                transformAndSortStudentsStatistics(responce)
            ));
            thunkApi.dispatch(studentClassGroupTableSlice.actions.setClassesIdsActionCreator(responce.classes.map((item: any) => item.idClass)));
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
        const idAccount = student.idAccount;

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
            student: { idAccount, surname, name, lastname, idStudent },
            grades,
        };
    });

    result.sort((a, b) => a.student.surname.localeCompare(b.student.surname));

    return result;
}



export const getKeyForQrActionCreator = createAsyncThunk('student-class-group-table/get-key-for-qr',
    async (data: { authToken: string, id: number, onError: () => void}, thunkApi ) => {
        const { authToken, id, onError } = data;
        try {
            const responce = await studentApi.getKeyForQr(authToken, id);
            thunkApi.dispatch(studentClassGroupTableSlice.actions.setRedisKeyDataActionCreator(
                responce
            ));
        }
        catch (e) {
            if (axios.isAxiosError(e)) {
                if(e.response?.status === 401){
                    thunkApi.dispatch(appStatusSlice.actions.setStatusApp({ status: "no-autorizate" }))
                }
                else onError();
            }
        }
    }
)

export const askReviewActionCreator = createAsyncThunk('student-class-group-table/ask-review',
    async (data: { 
            authToken: string, classId: number, userId: number, studentStatistics: StatisticOfStudent[],
            onSuccess: () => void, onError: () => void, closePrewPopup: () => void}, thunkApi ) => {
        const { authToken, classId, userId, studentStatistics, onSuccess, onError, closePrewPopup} = data;
        try {
            const studentStats = studentStatistics.find(stat => stat.student.idAccount === userId);
            if (!studentStats) return;
        
            const gradeInfo = studentStats.grades.find(grade => grade.idClass === classId);
            if (!gradeInfo) return;

            await studentApi.askReview(authToken, classId, gradeInfo.idStudentGrate);
            closePrewPopup();
            onSuccess();
        }
        catch (e) {
            if (axios.isAxiosError(e)) {
                if(e.response?.status === 401){
                    thunkApi.dispatch(appStatusSlice.actions.setStatusApp({ status: "no-autorizate" }))
                } else {
                    closePrewPopup();
                    onError();
                }
            }
        }
    }
)