import { PayloadAction, createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { appStatusSlice } from "../../app-status-slice";
import { studentApi } from "../../../../api/auth/student-api";
import { ClassGroupInfo } from "./student-subjects-slice";
import { AttendanceCodeType } from "../teacher/class-group-control-slice";
import { parentApi } from "../../../../api/auth/parent-api";

type ErrorType = string | null;
export type AttendanceOption = {
  id: AttendanceCodeType;
  name: string;
  color: string;
}

export type ClassHeaderType = {
    idClass: number,
    gradeId: number,
    dateCreation: string,
    isAttestation: boolean,
    position: number;
    className: string | null;
}

export type GradeInfo = {
    idClass: number;
    idStudentGrate: number;
    grade: number | null;
    idStudent: number;
    description: string | null;
    attendance: AttendanceCodeType;
    isReview: boolean;
    isPassLab: boolean;
};

export type AttestationGradeInfo = {
    idClass: number;
    idAttestationStudentGrades: number;
    idStudent: number;
    avgGrade: number | null;
    hour: number | null;
    currentCountLab: number | null;
    maxCountLab: number | null;
    isAttested: boolean;
};

export type StatisticOfStudent = {
    student: {
        surname: string;
        name: string;
        lastname: string;
        idStudent: number;
    };
    grades: (GradeInfo | AttestationGradeInfo)[];
};

export type RedisKeyDataType = {
    classId: number,
    expiration: number,
} 

export type StudentClassGroupTableState = {
    loading: "idle" | "loading" | "success" | "error";
    classGroup: ClassGroupInfo | null;
    studentsStatistics: StatisticOfStudent[];
    errors: Record<string, ErrorType>;
    classesIds: ClassHeaderType[];
    selectedGrade: GradeInfo;
    selectedClass: ClassHeaderType;

    currentStudentId: number;
    gradesIds: number[];

    redisKeyData: RedisKeyDataType | null;
    loadingKey: "idle" | "loading" | "success" | "error";
    loadingReview: "idle" | "loading" | "success" | "error";
    loadingScan: "idle" | "loading" | "success" | "error";
    loadingReloadTable: "idle" | "loading" | "success" | "error";
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
        attendance: 0,
        isReview: false,
        isPassLab: false
    },
    errors: {},
    classesIds: [],

    gradesIds: [],
    redisKeyData: null,
    selectedClass: {
        idClass: -1,
        position: -1,
        className: null,
        gradeId: -1,
        dateCreation: 'undefined',
        isAttestation: false
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
        setSelectedClassActionCreator(state, action: PayloadAction<{value: ClassHeaderType, onSuccess: () => void}>) {
            state.selectedClass = action.payload.value;
            action.payload.onSuccess();
        },
        setClassesIdsActionCreator(state, action: PayloadAction<ClassHeaderType[]>) {
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
                attendance: 0,
                isReview: false,
                isPassLab: false
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
        const { authToken, idHold, accountId, role } = data;
        try {

            const responce = role === 'ROLE_STUDENT' ? 
            await studentApi.getTableOfSubgroup(authToken, idHold) :
            await parentApi.getTableOfSubgroup(authToken, idHold);

            const sortedResponse = {
                ...responce,
                classes: responce.classes.sort((a: any, b: any) => a.idClass - b.idClass)
            };

            thunkApi.dispatch(studentClassGroupTableSlice.actions.setStudentsStatisticsActionCreator(
                transformAndSortStudentsStatistics(sortedResponse)
            ));

            const currentStudent = sortedResponse.students.find((student: any) => student.idAccount === accountId);
            
            thunkApi.dispatch(studentClassGroupTableSlice.actions.setCurrentStudentIdActionCreator(currentStudent.idStudent));

            const currentStudentClasses = sortedResponse.studentGrades
            .filter((grade: any) => grade.idStudent === currentStudent.idStudent);

            let positionCounter = 1;

            const classesIds: ClassHeaderType[] = sortedResponse.classes
                .map((cls: any) => ({
                    idClass: cls.idClass,
                    gradeId: currentStudentClasses.some((studentClass: any) => studentClass.idClass === cls.idClass) 
                        ? currentStudentClasses.find((studentClass: any) => studentClass.idClass === cls.idClass)?.idStudentGrate 
                        : -1, 
                    dateCreation: cls.dateCreation,
                    isAttestation: cls.isAttestation,
                    className: cls.className,
                    position: cls.isAttestation ? -1 : positionCounter++,
                }));

            thunkApi.dispatch(studentClassGroupTableSlice.actions.setClassesIdsActionCreator(classesIds));
        }
        catch (e) {
            if (axios.isAxiosError(e)) {
                if(e.response?.status === 401){
                    thunkApi.dispatch(appStatusSlice.actions.setStatusApp({ status: "no-autorizate" }))
                } else thunkApi.dispatch(appStatusSlice.actions.setStatusApp({ status: "app-error" }))
            } else thunkApi.dispatch(appStatusSlice.actions.setStatusApp({ status: "app-error" }))
        }
    }
)

export default studentClassGroupTableSlice.reducer;

export const transformAndSortStudentsStatistics = (input: {
    students: {
        idStudent: number;
        idSubgroup: number;
        flpName: string;
        keyStudentParents: string;
        idAccount: number;
    }[];
    classes: {
        idClass: number;
        idClassHold: number;
        dateCreation: string;
        isAttestation: boolean;
        className: string | null;
    }[];
    studentGrades: {
        idStudentGrate: number;
        idStudent: number;
        idClass: number;
        grade: number | null;
        description: string | null;
        attendance: AttendanceCodeType;
        isPassLab: boolean;
    }[];
    attestationStudentGrades: {
        idAttestationStudentGrades: number;
        idStudent: number;
        idClass: number;
        avgGrade: number | null;
        hour: number | null;
        currentCountLab: number | null;
        maxCountLab: number | null;
        isAttested: boolean;
    }[];
}): StatisticOfStudent[] => {
    const { students, studentGrades, classes, attestationStudentGrades } = input;
    const allClassIds = classes.map(cls => cls.idClass).sort((a, b) => a - b);

    const transformedStudents = students.map(student => {
        const [surname, name, lastname] = student.flpName.split("_");
        const idStudent = student.idStudent;
        
        const gradesMap = new Map<number, GradeInfo | AttestationGradeInfo>();

        studentGrades.filter(grade => grade.idStudent === idStudent)
            .forEach(grade => gradesMap.set(grade.idClass, {
                idClass: grade.idClass,
                idStudentGrate: grade.idStudentGrate,
                grade: grade.grade,
                idStudent: idStudent,
                description: grade.description,
                attendance: grade.attendance,
                isReview: false,
                isPassLab: grade.isPassLab
            }));

        attestationStudentGrades.filter(att => att.idStudent === idStudent)
            .forEach(att => gradesMap.set(att.idClass, {
                idClass: att.idClass,
                idAttestationStudentGrades: att.idAttestationStudentGrades,
                idStudent: idStudent,
                avgGrade: att.avgGrade,
                hour: att.hour,
                currentCountLab: att.currentCountLab,
                maxCountLab: att.maxCountLab,
                isAttested: att.isAttested
            }));

        const grades = allClassIds.map(idClass => {
            return gradesMap.get(idClass) ?? {
                idClass,
                idStudent,
                idStudentGrate: -1,
                grade: null,
                description: null,
                attendance: 0 as AttendanceCodeType,
                isReview: false,
                isPassLab: false
            };
        });

        return {
            student: { surname, name, lastname, idStudent },
            grades,
        };
    });

    return transformedStudents.sort((a, b) => a.student.surname.localeCompare(b.student.surname));
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
            } else thunkApi.dispatch(appStatusSlice.actions.setStatusApp({ status: "app-error" }))
        }
    }
)

export const askReviewActionCreator = createAsyncThunk('student-class-group-table/ask-review',
    async (data: { 
            authToken: string, selectedClass: ClassHeaderType,
            onSuccess: () => void, onError: () => void, closePrewPopup: () => void}, thunkApi ) => {
        const { authToken, selectedClass, onSuccess, onError, closePrewPopup} = data;
        try {

            await studentApi.askReview(authToken, selectedClass.idClass, selectedClass.gradeId);
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
            } else thunkApi.dispatch(appStatusSlice.actions.setStatusApp({ status: "app-error" }))
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
                await studentApi.acceptAttendance(authToken, jsonData.idClass, 3);
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
    const response = await fetch('http://worldtimeapi.org/api/timezone/Etc/UTC');
    const end = Date.now();

    const data: WorldTimeApiResponse = await response.json();

    const latency = (end - start) / 2;
    const serverTime = new Date(data.datetime);
    const accurateTime = new Date(serverTime.getTime() + latency);

    return accurateTime;
}

export const reloadStudntTableStatisticsActionCreator = createAsyncThunk('student-class-group-table/reload',
    async (data: { authToken: string, accountId : number, idHold: number, idSubgroup: number, role: "ROLE_STUDENT" | "ROLE_PARENTS"}, thunkApi ) => {
        const { authToken, idHold, role, accountId } = data;
        try {
            const responce = role === 'ROLE_STUDENT' ? 
            await studentApi.getTableOfSubgroup(authToken, idHold) :
            await parentApi.getTableOfSubgroup(authToken, idHold);

            const sortedResponse = {
                ...responce,
                classes: responce.classes.sort((a: any, b: any) => a.idClass - b.idClass)
            };

            thunkApi.dispatch(studentClassGroupTableSlice.actions.setStudentsStatisticsActionCreator(
                transformAndSortStudentsStatistics(sortedResponse)
            ));

            const currentStudent = sortedResponse.students.find((student: any) => student.idAccount === accountId);
            
            thunkApi.dispatch(studentClassGroupTableSlice.actions.setCurrentStudentIdActionCreator(currentStudent.idStudent));

            const currentStudentClasses = sortedResponse.studentGrades
            .filter((grade: any) => grade.idStudent === currentStudent.idStudent);

            let positionCounter = 1;

            const classesIds: ClassHeaderType[] = sortedResponse.classes
                .map((cls: any) => ({
                    idClass: cls.idClass,
                    gradeId: currentStudentClasses.some((studentClass: any) => studentClass.idClass === cls.idClass) 
                        ? currentStudentClasses.find((studentClass: any) => studentClass.idClass === cls.idClass)?.idStudentGrate 
                        : -1, 
                    dateCreation: cls.dateCreation,
                    isAttestation: cls.isAttestation,
                    className: cls.className,
                    position: cls.isAttestation ? -1 : positionCounter++,
                }));

            thunkApi.dispatch(studentClassGroupTableSlice.actions.setClassesIdsActionCreator(classesIds));
        }
        catch (e) {
            if (axios.isAxiosError(e)) {
                if(e.response?.status === 401){
                    thunkApi.dispatch(appStatusSlice.actions.setStatusApp({ status: "no-autorizate" }))
                } else thunkApi.dispatch(appStatusSlice.actions.setStatusApp({ status: "app-error" }))
            } else thunkApi.dispatch(appStatusSlice.actions.setStatusApp({ status: "app-error" }))
        }
    }
)