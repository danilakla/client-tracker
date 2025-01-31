import { PayloadAction, createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { appStatusSlice } from "../../app-status-slice";
import { studentApi } from "../../../../api/auth/student-api";
import { ClassGroupInfo } from "./student-subjects-slice";
import { AttendanceCodeType } from "../teacher/class-group-control-slice";

type ErrorType = string | null;

export type GradeInfo = {
    idClass: number,
    idStudentGrate: number,
    grade: number | null,
    idStudent: number,
    description: string | null,
    attendance: AttendanceCodeType
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
    classesIds: HeaderClassType[];
    selectedGrade: GradeInfo;
    selectedClass: HeaderClassType;

    currentStudentId: number;
    gradesIds: number[];

    redisKeyData: RedisKeyDataType | null;
    loadingKey: "idle" | "loading" | "success" | "error";
    loadingReview: "idle" | "loading" | "success" | "error";
    loadingScan: "idle" | "loading" | "success" | "error";
    loadingReloadTable: "idle" | "loading" | "success" | "error";
}

export type HeaderClassType = {
    id: number;
    position: number;
    gradeId: number;
}

const initialState: StudentClassGroupTableState = {
    loading: "idle",
    classGroup: null,
    loadingReloadTable: 'idle',
    currentStudentId: -1,
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

    gradesIds: [],
    redisKeyData: null,
    selectedClass: {
        id: -1,
        position: -1,
        gradeId: -1
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
        setClassesIdsActionCreator(state, action: PayloadAction<HeaderClassType[]>) {
            state.classesIds = action.payload;
        },
        setRedisKeyDataActionCreator(state, action: PayloadAction<RedisKeyDataType | null>) {
            state.redisKeyData = action.payload;
        },
        setGradesIdsActionCreator(state, action: PayloadAction<number[]>) {
            state.gradesIds = action.payload;
        },
        setCurrentStudentIdActionCreator(state, action: PayloadAction<number>) {
            state.currentStudentId = action.payload;
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

            .addCase(checkQrCodeActionCreator.fulfilled, (state) => {
                state.loadingScan = 'success';
            })
            .addCase(checkQrCodeActionCreator.pending, (state) => {
                state.loadingScan = 'loading';
            })
            .addCase(checkQrCodeActionCreator.rejected, (state) => {
                state.loadingScan = "idle";
            })

            .addCase(reloadStudntTableStatisticsActionCreator.fulfilled, (state) => {
                state.loadingReloadTable = 'success';
            })
            .addCase(reloadStudntTableStatisticsActionCreator.pending, (state) => {
                state.loadingReloadTable = 'loading';
            })
            .addCase(reloadStudntTableStatisticsActionCreator.rejected, (state) => {
                state.loadingReloadTable = "idle";
            })
    },
});

export const initStudntTableStatisticsActionCreator = createAsyncThunk('student-class-group-table/init',
    async (data: { authToken: string, accountId : number, idHold: number, idSubgroup: number, role: "ROLE_STUDENT" | "ROLE_PARENTS"}, thunkApi ) => {
        const { authToken, idHold, accountId } = data;
        try {

            const responce = await studentApi.getTableOfSubgroup(authToken, idHold);
            thunkApi.dispatch(studentClassGroupTableSlice.actions.setStudentsStatisticsActionCreator(
                transformAndSortStudentsStatistics(responce)
            ));

            const currentStudent = responce.students.find((student: any) => student.idAccount === accountId);
            
            thunkApi.dispatch(studentClassGroupTableSlice.actions.setCurrentStudentIdActionCreator(currentStudent.idStudent));

            const currentStudentClasses = responce.studentGrades
            .filter((grade: any) => grade.idStudent === currentStudent.idStudent)
            .map((grade: any) => grade.idClass);

            const classesIds = responce.classes
                .filter((cls: any) => currentStudentClasses.includes(cls.idClass))
                .map((cls: any, index: any) => ({
                    id: cls.idClass,
                    position: index + 1,
                    gradeId: currentStudentClasses.includes(cls.idClass) ? cls.idClass : -1,
                }));
            
            thunkApi.dispatch(studentClassGroupTableSlice.actions.setClassesIdsActionCreator(classesIds));
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
        attendance: AttendanceCodeType;
    }[];
}): StatisticOfStudent[] {
    const { students, studentGrades, classes } = input;

    const allClassIds = classes.map(cls => cls.idClass);

    const result: StatisticOfStudent[] = students.map((student) => {
        const [surname, name, lastname] = student.flpName.split("_");
        const idStudent = student.idStudent;
        const idAccount = student.idAccount;

        const grades = allClassIds.map((idClass) => {
            const grade = studentGrades
                .filter((grade) => grade.idStudent === idStudent && grade.idClass === idClass)
                .map((grade) => ({
                    idClass: grade.idClass,
                    idStudentGrate: grade.idStudentGrate,
                    grade: grade.grade,
                    idStudent: idStudent,
                    description: grade.description,
                    attendance: grade.attendance,
                }))[0];

            if (!grade) {
                return {
                    idClass: -1,
                    idStudent: -1,
                    idStudentGrate: -1,
                    grade: null,
                    description: null,
                    attendance: 0 as AttendanceCodeType
                };
            }
            return grade;
        });

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
            authToken: string, selectedClass: HeaderClassType,
            onSuccess: () => void, onError: () => void, closePrewPopup: () => void}, thunkApi ) => {
        const { authToken, selectedClass, onSuccess, onError, closePrewPopup} = data;
        try {

            await studentApi.askReview(authToken, selectedClass.id, selectedClass.gradeId);
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



export const checkQrCodeActionCreator = createAsyncThunk('student-class-group-table/check=qr-code-st',
    async (data: { 
            authToken: string, value: string, keyRedux: number, onSuccess: () => void, onError: () => void}, thunkApi ) => {
        const { authToken, keyRedux, value, onSuccess, onError} = data;
        try {

            let parsedDate: Date | null = null;
            let parsedExpiration: number | null = null;

            const jsonData = JSON.parse(value);
            
            if (typeof jsonData.date === 'string' &&
                typeof jsonData.idClass === 'number' &&
                typeof jsonData.expiration === 'number') {
                    parsedDate = new Date(jsonData.date);
                    parsedExpiration = jsonData.expiration;

                    if (isNaN(parsedDate.getTime()) || jsonData.idClass !== keyRedux) {
                        onError();
                        return;
                    }
            } else {
                onError();
                return;
            }

            if(parsedDate == null || parsedExpiration == null){
                onError();
                return;
            }

            let currentTime = await getAccurateTime();


            const timeDifference = currentTime.getTime() - parsedDate.getTime();

            if (timeDifference / 1000 <= parsedExpiration) {
                await studentApi.acceptAttendance(authToken, jsonData.idClass, 4);
                onSuccess();
                return;
            } else {
                onError();
                return;
            }
        }
        catch (e) {
            if (axios.isAxiosError(e)) {
                if(e.response?.status === 401){
                    thunkApi.dispatch(appStatusSlice.actions.setStatusApp({ status: "no-autorizate" }))
                } else {
                    onError();
                }
            }
            onError();
        }
    }
)


interface WorldTimeApiResponse {
    datetime: string;
    [key: string]: unknown;
}

type AccurateTime = Date;

async function getAccurateTime(): Promise<AccurateTime> {
    const start = Date.now();
    // const response = await fetch('http://worldtimeapi.org/api/timezone/Etc/UTC');
    const response = await fetch('https://cors-anywhere.herokuapp.com/http://worldtimeapi.org/api/timezone/Etc/UTC');
    const end = Date.now();

    const data: WorldTimeApiResponse = await response.json();

    const latency = (end - start) / 2;
    const serverTime = new Date(data.datetime);
    const accurateTime = new Date(serverTime.getTime() + latency);

    return accurateTime;
}

export const reloadStudntTableStatisticsActionCreator = createAsyncThunk('student-class-group-table/reload',
    async (data: { authToken: string, accountId : number, idHold: number, idSubgroup: number, role: "ROLE_STUDENT" | "ROLE_PARENTS"}, thunkApi ) => {
        const { authToken, idHold, accountId } = data;
        try {

            const responce = await studentApi.getTableOfSubgroup(authToken, idHold);
            thunkApi.dispatch(studentClassGroupTableSlice.actions.setStudentsStatisticsActionCreator(
                transformAndSortStudentsStatistics(responce)
            ));

            const currentStudent = responce.students.find((student: any) => student.idAccount === accountId);
            
            thunkApi.dispatch(studentClassGroupTableSlice.actions.setCurrentStudentIdActionCreator(currentStudent.idStudent));

            const currentStudentClasses = responce.studentGrades
            .filter((grade: any) => grade.idStudent === currentStudent.idStudent)
            .map((grade: any) => grade.idClass);

            const classesIds = responce.classes
                .filter((cls: any) => currentStudentClasses.includes(cls.idClass))
                .map((cls: any, index: any) => ({
                    id: cls.idClass,
                    position: index + 1,
                    gradeId: currentStudentClasses.includes(cls.idClass) ? cls.idClass : -1,
                }));
            
            thunkApi.dispatch(studentClassGroupTableSlice.actions.setClassesIdsActionCreator(classesIds));
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