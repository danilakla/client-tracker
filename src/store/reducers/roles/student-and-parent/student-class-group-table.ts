import { PayloadAction, createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { appStatusSlice } from "../../app-status-slice";
import { studentApi } from "../../../../api/auth/student-api";
import { ClassGroupInfo } from "./student-subjects-slice";
import { AttendanceCodeType } from "../teacher/class-group-control-slice";
import { parentApi } from "../../../../api/auth/parent-api";
import AES from 'aes-js';

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

function isGradeInfo(grade: GradeInfo | AttestationGradeInfo): grade is GradeInfo {
    return (grade as GradeInfo).idStudentGrate !== undefined;
}

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
        updateGradeAttendance(state, action: PayloadAction<{ gradeId: number, newAttendance: AttendanceCodeType }>) {
            const { gradeId, newAttendance } = action.payload;

            state.studentsStatistics.forEach(studentStat => {
                studentStat.grades.forEach(grade => {
                    if (isGradeInfo(grade) && grade.idStudentGrate === gradeId) {
                        grade.attendance = newAttendance;
                    }
                });
            });
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
            authToken: string, classes: ClassHeaderType[],value: string, keyRedux: number, onSuccess: () => void, onError: () => void}, thunkApi ) => {
        const { authToken, keyRedux, classes, value, onSuccess, onError} = data;
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

            let currentTime = await getAccurateTime(authToken);

            const timeDifference = currentTime.getTime() - parsedDate.getTime();
            const classItem = classes.find(classHeader => classHeader.idClass === jsonData.idClass);

            if (timeDifference / 1000 <= parsedExpiration) {
                if(classItem === undefined) return;

                await studentApi.acceptAttendance(authToken, classItem.gradeId || -1, 3);

                thunkApi.dispatch(studentClassGroupTableSlice.actions.updateGradeAttendance({
                    gradeId:classItem.gradeId,
                    newAttendance: 3 as AttendanceCodeType
                }));

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

type AccurateTime = Date;

async function getAccurateTime(authToken: string): Promise<AccurateTime> {
    const start = Date.now();
    const response = await studentApi.getTimeFromServer(authToken);
    const end = Date.now();

    const latency = (end - start) / 2;
    const serverTime = new Date(response.currentTime);
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


// Генерация ключа из строки (обрезаем/дополняем до 16 байт)
function getKeyFromPassword(password: string): Uint8Array {
  const padded = password.padEnd(16, '0').slice(0, 16);
  return AES.utils.utf8.toBytes(padded);
}

// Синхронное шифрование
export function encryptAES(text: string, password: string): string {
  const key = getKeyFromPassword(password);
  const textBytes = AES.utils.utf8.toBytes(text);

  const iv = new Uint8Array(16); // Можешь заменить на random, если хочешь
  for (let i = 0; i < iv.length; i++) iv[i] = i * 3 + 1; // простая IV

  const aesCtr = new AES.ModeOfOperation.ctr(key, new AES.Counter(iv));
  const encryptedBytes = aesCtr.encrypt(textBytes);

  const encryptedHex = AES.utils.hex.fromBytes(iv) + AES.utils.hex.fromBytes(encryptedBytes);
  return encryptedHex;
}

// Синхронная дешифровка
export function decryptAES(encryptedHex: string, password: string): string {
  const key = getKeyFromPassword(password);

  const ivHex = encryptedHex.slice(0, 32);
  const cipherHex = encryptedHex.slice(32);

  const iv = AES.utils.hex.toBytes(ivHex);
  const encryptedBytes = AES.utils.hex.toBytes(cipherHex);

  const aesCtr = new AES.ModeOfOperation.ctr(key, new AES.Counter(iv));
  const decryptedBytes = aesCtr.decrypt(encryptedBytes);

  return AES.utils.utf8.fromBytes(decryptedBytes);
}
