import { PayloadAction, createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { appStatusSlice } from "../../app-status-slice";
import { theme } from "../../../../ui-kit/themes/theme";
import { deanApi } from "../../../../api/auth/dean-api";

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
    className: string | null;
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

export type InitData = {
    id: number,
    description: string,
    subjectName: string,
    formatName: string,
    teacherName: string,
    idClassHold: number
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

export type ClassGroupTableState = {
    loading: "idle" | "loading" | "success" | "error";
    loadingReloadTable: "idle" | "loading" | "success" | "error";

    initData: InitData | null;
    studentsStatistics: StatisticOfStudent[];

    errors: Record<string, ErrorType>;
    
    countClasses: number;

    classesIds: ClassHeaderType[];
    attestationClassesIds: ClassHeaderType[];

    selectedGrade: GradeInfo;
};

const initialState: ClassGroupTableState = {
    loading: "idle",
    loadingReloadTable: 'idle',

    initData: null,
    studentsStatistics: [],

    errors: {},

    classesIds: [],
    attestationClassesIds: [],
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
};

const setErrorByKey = (state: ClassGroupTableState, key: string, error: ErrorType) => {
    state.errors[key] = error;
};

export const classGroupTableSlice = createSlice({
    name: "class-group-table-slice",
    initialState: initialState,
    reducers: {
        setError(state, action: PayloadAction<{ key: string; error: ErrorType }>) {
            setErrorByKey(state, action.payload.key, action.payload.error);
        },
        setStudentsStatisticsActionCreator(state, action: PayloadAction<StatisticOfStudent[]>) {
            state.studentsStatistics = action.payload;
        },
        setClassesIdsActionCreator(state, action: PayloadAction<{
            idClass: number,
            idClassHold: number,
            dateCreation: string,
            isAttestation: boolean,
            className: string |null
        }[]>) {
            let positionCounter = 1;

            state.classesIds = action.payload.map((classItem) => {
                const position = classItem.isAttestation ? -1 : positionCounter++;
            
                return {
                    ...classItem,
                    position
                };
            });

            state.attestationClassesIds = state.classesIds.filter(classItem => classItem.isAttestation);
        },
        setSelectedGradeInfoActionCreator(state, action: PayloadAction<{value: GradeInfo, onSuccess: () => void}>) {
            state.selectedGrade = action.payload.value;
            action.payload.onSuccess();
        },
        setInitDataActionCreator(state, action: PayloadAction<{value: InitData, onSuccess: () => void}>) {
            state.initData = action.payload.value;
            action.payload.onSuccess();
        },
        setCountClassesActionCreator(state, action: PayloadAction<number>) {
            state.countClasses = action.payload;
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
            .addCase(initDeanClassTableActionCreator.fulfilled, (state) => {
                state.loading = 'success';
            })
            .addCase(initDeanClassTableActionCreator.pending, (state) => {
                state.loading = 'loading';
            })
            .addCase(initDeanClassTableActionCreator.rejected, (state) => {
                state.loading = "idle";
            })

            .addCase(reloadDeanClassTableActionCreator.fulfilled, (state) => {
                state.loadingReloadTable = 'success';
            })
            .addCase(reloadDeanClassTableActionCreator.pending, (state) => {
                state.loadingReloadTable = 'loading';
            })
            .addCase(reloadDeanClassTableActionCreator.rejected, (state) => {
                state.loadingReloadTable = "idle";
            })
    },
});

export const initDeanClassTableActionCreator = createAsyncThunk('class-group-table-slice/init',
    async (data: { authToken: string, initData: InitData | null}, thunkApi ) => {
        const { authToken, initData } = data;
        try {
            if(initData === null){
                return;
            }
                
            const responce = await deanApi.getClassGroupTable(authToken, initData.idClassHold);

            const sortedResponse = {
                ...responce,
                classes: responce.classes.sort((a: any, b: any) => a.idClass - b.idClass)
            };

            thunkApi.dispatch(classGroupTableSlice.actions.setStudentsStatisticsActionCreator(
                transformAndSortStudentsStatistics(sortedResponse)
            ));

            thunkApi.dispatch(classGroupTableSlice.actions.setClassesIdsActionCreator(sortedResponse.classes));
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

export const reloadDeanClassTableActionCreator = createAsyncThunk('class-group-table-slice/reload',
    async (data: { authToken: string, initData: InitData | null}, thunkApi ) => {
        const { authToken, initData } = data;
        try {
            // if(initData === null){
            //     return;
            // }

            const responce = await deanApi.getClassGroupTable(authToken, 1);

            const sortedResponse = {
                ...responce,
                classes: responce.classes.sort((a: any, b: any) => a.idClass - b.idClass)
            };

            thunkApi.dispatch(classGroupTableSlice.actions.setStudentsStatisticsActionCreator(
                transformAndSortStudentsStatistics(sortedResponse)
            ));

            thunkApi.dispatch(classGroupTableSlice.actions.setClassesIdsActionCreator(sortedResponse.classes));
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

export default classGroupTableSlice.reducer;

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
        idClass: number,
        idClassHold: number,
        dateCreation: string,
        isAttestation: boolean,
        className: string |null
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