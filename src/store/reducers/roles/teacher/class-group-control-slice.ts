import { PayloadAction, createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { teacherApi } from "../../../../api/auth/teacher-api";
import axios from "axios";
import { appStatusSlice } from "../../app-status-slice";
import { ClassGroupData } from "./class-group-subroups-slice";
import { theme } from "../../../../ui-kit/themes/theme";

export type AttendanceCodeType = 0 | 1 | 2 | 3 | 4 | 7 | 8;

export type AttendanceOption = {
  id: AttendanceCodeType;
  name: string;
  color: string;
}

export type ClassHeaderType = {
    idClass: number,
    idClassHold: number,
    dateCreation: string,
    isAttestation: boolean,
    position: number;
}

export const attendanceOptions: AttendanceOption[] = [
  { id: 0, name: 'Не указано', color: '#0000003e' },
  { id: 1, name: 'Пропуск', color: theme.colors.attentive},
  { id: 2, name: 'Уважительно', color: theme.colors.neutral },
  { id: 3, name: 'Посещено', color: theme.colors.success },
];

export const attendanceColorsForStudents: Record<number, string> = {
    0: 'transparent',
    1: theme.colors.attentive,
    2: theme.colors.neutral,
    3: theme.colors.success,
    7: `linear-gradient(to right, ${theme.colors.success} 50%,  ${theme.colors.attentive} 50%)`,
    8: `linear-gradient(to right, ${theme.colors.success} 50%,  ${theme.colors.neutral} 50%)`
  };

type ErrorType = string | null;

export type InitScreenData = {
    subgroup: {
        idSubgroup: number,
        subgroupNumber: string,
        admissionDate: string,
        idDean: number,
        idSpecialty: number,
        idClassGroupToSubgroup: number
    },
    idHold: number | null,
    classGroup: ClassGroupData
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

export type QrCodeDataType = {
    date: string,
    idClass: number,
    expiration: number
}

export type СlassGroupControlState = {
    loading: "idle" | "loading" | "success" | "error";
    initData: InitScreenData | null;
    studentsStatistics: StatisticOfStudent[];
    errors: Record<string, ErrorType>;
    countClasses: number;
    idHold: number | null,
    classesIds: ClassHeaderType[];
    selectedGrade: GradeInfo;
    loadingDelete: "idle" | "loading" | "success" | "error";
    loadingUpdate: "idle" | "loading" | "success" | "error";
    loadingAdd: "idle" | "loading" | "success" | "error";
    loadingReview: "idle" | "loading" | "success" | "error";

    loadingReloadTable: "idle" | "loading" | "success" | "error";

    isCompleted: boolean; 
    isShowCompleted: boolean; 

    selectedClass: ClassHeaderType;
    qrCodePopup: {
        loadingQrCode: "idle" | "loading" | "success" | "error";
        loadingStart: "idle" | "loading" | "success" | "error";
        loadingStop: "idle" | "loading" | "success" | "error";

        expirationOfReview: number;
        expirationOfRefresh: number;

        qrCodeData: QrCodeDataType | null;
    };
    generateKeyPopup: {
        loadingActivate: "idle" | "loading" | "success" | "error";
    };
};

const initialState: СlassGroupControlState = {
    loading: "idle",
    initData: null,
    idHold: null,
    studentsStatistics: [],
    errors: {},
    classesIds: [],
    loadingUpdate: 'idle',
    isCompleted: false,
    isShowCompleted: false,
    loadingReloadTable: 'idle',
    countClasses: 0,
    selectedGrade: {
        idClass: -1,
        idStudent: -1,
        idStudentGrate: -1,
        grade: null,
        description: null,
        attendance: 0,
        isPassLab: false,
        isReview: false
    },
    loadingAdd: 'idle',
    loadingDelete: 'idle',
    loadingReview: 'idle',

    selectedClass: {
        idClass: -1,
        idClassHold: -1,
        dateCreation: 'undefined',
        isAttestation: false,
        position: -1
    },
    qrCodePopup: {
        expirationOfRefresh: 5,
        expirationOfReview: 90,
        loadingStart: "idle",
        loadingQrCode: 'idle',
        loadingStop: "idle",

        qrCodeData: null
    },
    generateKeyPopup: {
        loadingActivate: "idle"
    }
};

const setErrorByKey = (state: СlassGroupControlState, key: string, error: ErrorType) => {
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
        removeLastClassActionCreator(state) {
            const lastClassIndex = state.classesIds
                .map((classItem, index) => ({ ...classItem, index }))
                .reverse()
                .find((classItem) => !classItem.isAttestation)?.index;

            if (lastClassIndex !== undefined) {
                const [removedClass] = state.classesIds.splice(lastClassIndex, 1);
            
                state.studentsStatistics = state.studentsStatistics.map((studentStatistic) => ({
                    ...studentStatistic,
                    grades: studentStatistic.grades.filter((grade) => grade.idClass !== removedClass.idClass),
                }));
            
                state.countClasses--;
            }
        },
        setClassesIdsActionCreator(state, action: PayloadAction<{
            idClass: number,
            idClassHold: number,
            dateCreation: string,
            isAttestation: boolean,
        }[]>) {
            let positionCounter = 1;

            state.classesIds = action.payload.map((classItem) => {
                const position = classItem.isAttestation ? -1 : positionCounter++;
            
                return {
                    ...classItem,
                    position
                };
            });
        },
        updateGradeActionCreator(state, action: PayloadAction<GradeInfo | AttestationGradeInfo>) {
            const updatedGrade = action.payload;
        
            state.studentsStatistics = state.studentsStatistics.map((studentStatistic) => ({
                ...studentStatistic,
                grades: studentStatistic.grades.map((grade) => {
                    if (grade !== null && "idStudentGrate" in grade && "idStudentGrate" in updatedGrade) {
                        return grade.idStudentGrate === updatedGrade.idStudentGrate ? { ...grade, ...updatedGrade } : grade;
                    }
                    return grade;
                }),
            }));
        },
        setGradeNumberActionCreator(state, action: PayloadAction<string>) {
            const parsedGrade = action.payload.trim();

            if (parsedGrade === "") {
                state.selectedGrade.grade = null;
            } else {
                const numericGrade = Number(parsedGrade);

                if (!isNaN(numericGrade)){
                    if(numericGrade > 1000) return;
                    state.selectedGrade.grade = numericGrade;
                }
                else
                    state.selectedGrade.grade = null;
            }
        },
        setDescriptionActionCreator(state, action: PayloadAction<string>) {
            state.selectedGrade.description = action.payload;
        },
        setAttendanceActionCreator(state, action: PayloadAction<AttendanceCodeType>) {
            state.selectedGrade.attendance = action.payload;
            switch(action.payload){
                case 1:
                case 2:
                    state.isShowCompleted = true;
                    break;
                default:
                    state.isShowCompleted = false;
            }
        },
        setIsCompletedActionCreator(state, action: PayloadAction<boolean>) {
            state.isCompleted = action.payload;
        },
        toggleIsCompletedActionCreator(state) {
            state.isCompleted = !state.isCompleted;
        },
        addClassToStudentsStatisticsActionCreator(state, action: PayloadAction<{ idClass: number; idClassHold: number; studentGrades: GradeInfo[] }>
        ) {
            const { idClass, studentGrades, idClassHold } = action.payload;
        
            state.studentsStatistics = state.studentsStatistics.map((statistic) => {
                const gradeForStudent = studentGrades.find(
                    (grade) => grade.idStudent === statistic.student.idStudent
                );
        
                if (gradeForStudent) {
                    const newGrade: GradeInfo = {
                        idClass: idClass,
                        idStudentGrate: gradeForStudent.idStudentGrate,
                        grade: gradeForStudent.grade,
                        idStudent: gradeForStudent.idStudent,
                        description: gradeForStudent.description,
                        attendance: gradeForStudent.attendance,
                        isReview: false,
                        isPassLab: gradeForStudent.isPassLab
                    };
        
                    return {
                        ...statistic,
                        grades: [...statistic.grades, newGrade].sort((a, b) => a.idClass - b.idClass),
                    };
                }
        
                return statistic;
            });
            const lastPosition = state.classesIds.filter(classItem => !classItem.isAttestation).length;

            state.classesIds.push({
                idClass: idClass,
                idClassHold: idClassHold,
                dateCreation: new Date().toISOString().split('T')[0],
                isAttestation: false,
                position: lastPosition + 1 
            });

            state.countClasses++;
        },
        setCountClassesActionCreator(state, action: PayloadAction<number>) {
            state.countClasses = action.payload;
        },
        setSelectedGradeActionCreator(state, action: PayloadAction<{gradeInfo: GradeInfo, onSuccess: () => void}>) {
            switch(action.payload.gradeInfo.attendance){
                case 7:
                    state.selectedGrade = {...action.payload.gradeInfo, attendance: 1};
                    state.isCompleted = true;
                    state.isShowCompleted = true;
                    break;
                case 8:
                    state.selectedGrade = {...action.payload.gradeInfo, attendance: 2};
                    state.isCompleted = true;
                    state.isShowCompleted = true;
                    break;
                default:
                    state.selectedGrade = action.payload.gradeInfo;
                    state.isShowCompleted = false;
            }
            action.payload.onSuccess();
        },
        setClassGroupInfoActionCreator(state, action: PayloadAction<{initData: InitScreenData}>) {
            state.initData = action.payload.initData;
        },
        setIdHoldActionCreator(state, action: PayloadAction<number>) {
            state.idHold = action.payload;
        },
        reset(state) {
            Object.assign(state, initialState);
        },
        clearErrors(state) {
            state.errors = {};
        },
        setExpirationOfRefreshActionCreator(state, action: PayloadAction<number>) {
            state.qrCodePopup.expirationOfRefresh = action.payload;
        },
        setExpirationOfReviewActionCreator(state, action: PayloadAction<number>) {
            state.qrCodePopup.expirationOfReview = action.payload;
        },
        setSelectedClassActionCreator(state, action: PayloadAction<{value: ClassHeaderType, onSuccess: () => void}>) {
            state.selectedClass = action.payload.value;
            action.payload.onSuccess();
        },
        clearQrCodeDataActionCreator(state){
            state.qrCodePopup.qrCodeData = null;
            state.qrCodePopup.loadingQrCode = 'idle';
        },
        setQrCodeDataActionCreator(state, action: PayloadAction<QrCodeDataType | null>) {
            state.qrCodePopup.qrCodeData = action.payload;
        },
        getReviewStudents(state, action: PayloadAction<{ studentGradeId: number, classId: number }[]>) {
            action.payload.forEach(({ studentGradeId, classId }) => {
                state.studentsStatistics.forEach((studentStat) => {
                    studentStat.grades.forEach((grade) => {
                        if (grade !== null && "idStudentGrate" in grade && grade.idStudentGrate === studentGradeId && grade.idClass === classId) {
                            grade.isReview = true;
                        }
                    });
                });
            });
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(initTableStatisticsActionCreator.fulfilled, (state) => {
                state.loading = 'success';
            })
            .addCase(initTableStatisticsActionCreator.pending, (state) => {
                state.loading = 'loading';
            })
            .addCase(initTableStatisticsActionCreator.rejected, (state) => {
                state.loading = "idle";
            })

            .addCase(addClassActionCreator.fulfilled, (state) => {
                state.loadingAdd = 'success';
            })
            .addCase(addClassActionCreator.pending, (state) => {
                state.loadingAdd = 'loading';
            })
            .addCase(addClassActionCreator.rejected, (state) => {
                state.loadingAdd = "idle";
            })

            .addCase(deleteClassActionCreator.fulfilled, (state) => {
                state.loadingDelete = 'success';
            })
            .addCase(deleteClassActionCreator.pending, (state) => {
                state.loadingDelete = 'loading';
            })
            .addCase(deleteClassActionCreator.rejected, (state) => {
                state.loadingDelete = "idle";
            })

            .addCase(updateGradeActionCreator.fulfilled, (state) => {
                state.loadingUpdate = 'success';
            })
            .addCase(updateGradeActionCreator.pending, (state) => {
                state.loadingUpdate = 'loading';
            })
            .addCase(updateGradeActionCreator.rejected, (state) => {
                state.loadingUpdate = "idle";
            })

            .addCase(activateKeyForClassActionCreator.fulfilled, (state) => {
                state.generateKeyPopup.loadingActivate = 'success';
            })
            .addCase(activateKeyForClassActionCreator.pending, (state) => {
                state.generateKeyPopup.loadingActivate = 'loading';
            })
            .addCase(activateKeyForClassActionCreator.rejected, (state) => {
                state.generateKeyPopup.loadingActivate = "idle";
            })

            .addCase(createQrCodeActionCreator.fulfilled, (state) => {
                state.qrCodePopup.loadingQrCode = 'success';
            })
            .addCase(createQrCodeActionCreator.pending, (state) => {
                state.qrCodePopup.loadingQrCode = 'loading';
            })
            .addCase(createQrCodeActionCreator.rejected, (state) => {
                state.qrCodePopup.loadingQrCode = "idle";
            })

            .addCase(startReviewForClassActionCreator.fulfilled, (state) => {
                state.loadingReview = 'success';
            })
            .addCase(startReviewForClassActionCreator.pending, (state) => {
                state.loadingReview = 'loading';
            })
            .addCase(startReviewForClassActionCreator.rejected, (state) => {
                state.loadingReview = "idle";
            })

            .addCase(reloadTableStatisticsActionCreator.fulfilled, (state) => {
                state.loadingReloadTable = 'success';
            })
            .addCase(reloadTableStatisticsActionCreator.pending, (state) => {
                state.loadingReloadTable = 'loading';
            })
            .addCase(reloadTableStatisticsActionCreator.rejected, (state) => {
                state.loadingReloadTable = "idle";
            })
    },
});

export const initTableStatisticsActionCreator = createAsyncThunk('teacher-class-group-control-init',
    async (data: { authToken: string, holdId: number, initData: InitScreenData}, thunkApi ) => {
        const { authToken, holdId, initData } = data;
        try {
            thunkApi.dispatch(classGroupControlSlice.actions.setIdHoldActionCreator(holdId))
            thunkApi.dispatch(classGroupControlSlice.actions.setClassGroupInfoActionCreator({initData}))

            const responce = await teacherApi.getTableOfSubgroup(authToken, holdId);

            console.log(transformAndSortStudentsStatistics(responce));

            thunkApi.dispatch(classGroupControlSlice.actions.setStudentsStatisticsActionCreator(
                transformAndSortStudentsStatistics(responce)
            ));
            thunkApi.dispatch(classGroupControlSlice.actions.setCountClassesActionCreator(responce.classes.length));
            thunkApi.dispatch(classGroupControlSlice.actions.setClassesIdsActionCreator(responce.classes));
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



export const deleteClassActionCreator = createAsyncThunk('teacher-class-delete',
    async (data: { authToken: string, idClass: number, onSuccess: () => void}, thunkApi ) => {
        const { authToken, idClass, onSuccess } = data;
        try {
            await teacherApi.deleteClass(authToken, idClass);
            thunkApi.dispatch(classGroupControlSlice.actions.removeLastClassActionCreator());
            onSuccess();
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

export const addClassActionCreator = createAsyncThunk('teacher-class-add',
    async (data: { authToken: string, holdId: number, studentsStatistics: StatisticOfStudent[], onSuccess: () => void}, thunkApi ) => {
        const { authToken, holdId, studentsStatistics, onSuccess } = data;
        try {
            const studentIds = studentsStatistics.map((statistic) => statistic.student.idStudent);


            const responce = await teacherApi.createClass(authToken,holdId, studentIds);

            thunkApi.dispatch(classGroupControlSlice.actions.addClassToStudentsStatisticsActionCreator({
                studentGrades: responce.studentGrades,
                idClass: responce.classes.idClass,
                idClassHold: holdId
            }));

            onSuccess();
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

export const updateGradeActionCreator = createAsyncThunk('teacher-class-update',
    async (data: { authToken: string, grade: GradeInfo, isCompleted: boolean, onSuccess: () => void}, thunkApi ) => {
        const { authToken, grade, isCompleted, onSuccess } = data;
        try {
            const desc= grade.description?.trim() || null;

            let attendance : AttendanceCodeType = 0;

            switch(grade.attendance){
                case 1:
                    attendance = isCompleted ? 7 : grade.attendance;
                    break;
                case 2:
                    attendance = isCompleted ? 8 : grade.attendance;
                    break;
                default:
                    attendance = grade.attendance;
            }

            const response = await teacherApi.updateGrade(authToken, grade.idStudentGrate, grade.grade, desc === '' ? null : desc , attendance);
            
            thunkApi.dispatch(classGroupControlSlice.actions.updateGradeActionCreator(response));
            onSuccess();
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

export const checkIsAttestationGrade = (grade: GradeInfo | AttestationGradeInfo): grade is AttestationGradeInfo => {
    return "avgGrade" in grade; 
}


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
    }[];
}): StatisticOfStudent[] => {
    const { students, studentGrades, classes, attestationStudentGrades } = input;
    const allClassIds = classes.map(cls => cls.idClass).sort((a, b) => a - b);
    
    return students.map(student => {
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
                isPassLab: false
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
}



export const activateKeyForClassActionCreator = createAsyncThunk('teacher-class-control/active-key',
    async (data: { authToken: string, classId: number, expiration: number, onSuccess: () => void}, thunkApi ) => {
        const { authToken, classId, expiration, onSuccess } = data;
        try {
            await teacherApi.saveKeyForQr(authToken, classId, expiration);
            onSuccess();
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

export const createQrCodeActionCreator = createAsyncThunk('teacher-class-control/create-qr-code',
    async (data: { authToken: string, classId: number, expirationOfReview: number, expirationOfRefresh: number}, thunkApi ) => {
        const { authToken, classId, expirationOfRefresh, expirationOfReview } = data;
        try {
            await teacherApi.createQrCode(authToken, classId, expirationOfReview);
            thunkApi.dispatch(classGroupControlSlice.actions.setQrCodeDataActionCreator({
                date: (new Date()).toISOString(),
                idClass: classId,
                expiration: expirationOfRefresh
            }));
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

export const startReviewForClassActionCreator = createAsyncThunk('teacher-class-control/review-class',
    async (data: { authToken: string, classId: number, onSuccess: () => void}, thunkApi ) => {
        const { authToken, classId, onSuccess } = data;
        try {
            
            const responce = await teacherApi.startReviewForClass(authToken, classId);

            thunkApi.dispatch(classGroupControlSlice.actions.getReviewStudents(responce));

            onSuccess();
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

export const reloadTableStatisticsActionCreator = createAsyncThunk('reload-teacher-class-group-control-init',
    async (data: { authToken: string, holdId: number, initData: InitScreenData}, thunkApi ) => {
        const { authToken, holdId, initData } = data;
        try {
            thunkApi.dispatch(classGroupControlSlice.actions.setIdHoldActionCreator(holdId))
            thunkApi.dispatch(classGroupControlSlice.actions.setClassGroupInfoActionCreator({initData}))

            const responce = await teacherApi.getTableOfSubgroup(authToken, holdId);
            thunkApi.dispatch(classGroupControlSlice.actions.setStudentsStatisticsActionCreator(
                transformAndSortStudentsStatistics(responce)
            ));
            thunkApi.dispatch(classGroupControlSlice.actions.setCountClassesActionCreator(responce.classes.length));
            thunkApi.dispatch(classGroupControlSlice.actions.setClassesIdsActionCreator(responce.classes.map((item: any) => item.idClass)));
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
