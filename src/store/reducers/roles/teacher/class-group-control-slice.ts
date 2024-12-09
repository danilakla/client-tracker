import { PayloadAction, createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { teacherApi } from "../../../../api/auth/teacher-api";
import axios from "axios";
import { appStatusSlice } from "../../app-status-slice";
import { ClassGroupData } from "./class-group-subroups-slice";

type ErrorType = string | null;

export type GradeInfo = {
    idClass: number,
    idStudentGrate: number,
    grade: number | null,
    idStudent: number,
    description: string | null,
    attendance: 0 | 1 | 2 | 3
}

export type InitScreenData = {
    subgroup: {
        idSubgroup: number,
        subgroupNumber: string,
        admissionDate: string,
        idDean: number,
        idSpecialty: number,
        idClassGroupToSubgroup: number
    }
    classGroup: ClassGroupData
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

export type SubjectsState = {
    loading: "idle" | "loading" | "success" | "error";
    initData: InitScreenData | null;
    studentsStatistics: StatisticOfStudent[];
    errors: Record<string, ErrorType>;
    countClasses: number;
    classesIds: number[];
    selectedGrade: GradeInfo;
    loadingDelete: "idle" | "loading" | "success" | "error";
    loadingUpdate: "idle" | "loading" | "success" | "error";
    loadingAdd: "idle" | "loading" | "success" | "error";
};

const initialState: SubjectsState = {
    loading: "idle",
    initData: null,
    studentsStatistics: [],
    errors: {},
    classesIds: [],
    loadingUpdate: 'idle',
    countClasses: 0,

    selectedGrade: {
        idClass: -1,
        idStudent: -1,
        idStudentGrate: -1,
        grade: null,
        description: null,
        attendance: 0
    },
    loadingAdd: 'idle',
    loadingDelete: 'idle'
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
        removeLastClassActionCreator(state) {
            const lastClassId = state.classesIds.pop();
        
            if (lastClassId !== undefined) {
                state.studentsStatistics = state.studentsStatistics.map((studentStatistic) => ({
                    ...studentStatistic,
                    grades: studentStatistic.grades.filter((grade) => grade.idClass !== lastClassId),
                }));
                state.countClasses--;
            }
        },
        setClassesIdsActionCreator(state, action: PayloadAction<number[]>) {
            state.classesIds = action.payload;
        },
        updateGradeActionCreator(state, action: PayloadAction<GradeInfo>) {
            const updatedGrade = action.payload;

            state.studentsStatistics = state.studentsStatistics.map((studentStatistic) => {
                const updatedGradesForStudent = studentStatistic.grades.map((grade) => {
                    if (grade.idStudentGrate === updatedGrade.idStudentGrate) {
                        return { ...grade, ...updatedGrade };
                    }
                    return grade;
                });

                return {
                    ...studentStatistic,
                    grades: updatedGradesForStudent,
                };
            });
        },
        setGradeNumberActionCreator(state, action: PayloadAction<string>) {
            const parsedGrade = action.payload.trim();

            if (parsedGrade === "") {
                state.selectedGrade.grade = null;
            } else {
                const numericGrade = Number(parsedGrade);

                if (!isNaN(numericGrade))
                    state.selectedGrade.grade = numericGrade;
                else
                    state.selectedGrade.grade = null;
            }
        },
        setDescriptionActionCreator(state, action: PayloadAction<string>) {
            state.selectedGrade.description = action.payload;
        },
        setAttendanceActionCreator(state, action: PayloadAction<0 | 1 | 2 | 3>) {
            state.selectedGrade.attendance = action.payload;
        },
        addClassToStudentsStatisticsActionCreator(state, action: PayloadAction<{ idClass: number; studentGrades: GradeInfo[] }>
        ) {
            const { idClass, studentGrades } = action.payload;
        
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
                    };
        
                    return {
                        ...statistic,
                        grades: [...statistic.grades, newGrade].sort((a, b) => a.idClass - b.idClass),
                    };
                }
        
                

                return statistic;
            });
            state.classesIds.push(idClass);
            state.countClasses++;
        },
        setCountClassesActionCreator(state, action: PayloadAction<number>) {
            state.countClasses = action.payload;
        },
        setSelectedGradeActionCreator(state, action: PayloadAction<{gradeInfo: GradeInfo, onSuccess: () => void}>) {
            state.selectedGrade = action.payload.gradeInfo;
            action.payload.onSuccess();
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
    },
});

export const initTableStatisticsActionCreator = createAsyncThunk('teacher-class-group-control-init',
    async (data: { authToken: string, idClassGroupToSubgroup: number, idSubgroup: number}, thunkApi ) => {
        const { authToken, idClassGroupToSubgroup, idSubgroup } = data;
        try {
            const responce = await teacherApi.getTableOfSubgroup(authToken, idClassGroupToSubgroup, idSubgroup);
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
    async (data: { authToken: string, classGroupToSubgroupId: number, studentsStatistics: StatisticOfStudent[], onSuccess: () => void}, thunkApi ) => {
        const { authToken, classGroupToSubgroupId, studentsStatistics, onSuccess } = data;
        try {
            const studentIds = studentsStatistics.map((statistic) => statistic.student.idStudent);


            const responce = await teacherApi.createClass(authToken,classGroupToSubgroupId, studentIds);

            thunkApi.dispatch(classGroupControlSlice.actions.addClassToStudentsStatisticsActionCreator({
                studentGrades: responce.studentGrades,
                idClass: responce.classes.idClass
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
    async (data: { authToken: string, grade: GradeInfo, onSuccess: () => void}, thunkApi ) => {
        const { authToken, grade, onSuccess } = data;
        try {
            const desc= grade.description?.trim() || null;
            const response = await teacherApi.updateGrade(authToken, grade.idStudentGrate, grade.grade, desc === '' ? null : desc , grade.attendance );
            
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