import { PayloadAction, createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { deanApi } from "../../../../api/auth/dean-api";
import { appStatusSlice } from "../../app-status-slice";
import axios from "axios";

type ErrorType = string | null;

export type StudentInfoState = {
    idStudent: number,
    idSubgroup: number,
    flpName: string,
    login: string,
    keyStudentParents: string,
    idAccount: number
};

export type SubgroupInfoState = {
    subgroup: {
        idSubgroup: number,
        subgroupNumber: string,
        admissionDate: string,
        idDean: number,
        idSpecialty: number
    },
    students: StudentInfoState[]
};

export type StudentsState = {
    subgroups: SubgroupInfoState[];
    selectedNewId: number;
    searchNewSubgroup: string;
    selectedSubgroup: SubgroupInfoState;
    selectedStudent: StudentInfoState;
    newSubgroup: number;
    searchSubgroups: string;
    searchStudents: string;
    newPassword: string;
    newLastname: string;
    newName: string;
    newSurname: string;
    loadingDelete: "idle" | "loading" | "success" | "error";
    loadingAdd: "idle" | "loading" | "success" | "error";
    loadingUpdate: "idle" | "loading" | "success" | "error";
    loadingReassign: "idle" | "loading" | "success" | "error";
    loading: "idle" | "loading" | "success" | "error";
    loadingRecovery: "idle" | "loading" | "success" | "error";
    errors: Record<string, ErrorType>;
};

const initialState: StudentsState = {
    subgroups: [],
    selectedNewId: -1,
    loadingReassign: 'idle',
    newSubgroup: -1,
    searchNewSubgroup: '',
    selectedSubgroup: {
        subgroup: {
            idSubgroup: -1,
            subgroupNumber: '',
            admissionDate: '',
            idDean: -1,
            idSpecialty: -1
        },
        students: []
    },
    selectedStudent: {
        idStudent: -1,
        idSubgroup: -1,
        flpName: '',
        login: '',
        keyStudentParents: '',
        idAccount: -1
    },
    newLastname: '',
    newName: '',
    newSurname: '',
    searchSubgroups: '',
    searchStudents: '',
    newPassword: '',
    loadingRecovery: 'idle',
    loadingAdd: 'idle',
    loadingDelete: 'idle',
    loadingUpdate: 'idle',
    loading: "idle",
    errors: {},
};

const setErrorByKey = (state: StudentsState, key: string, error: ErrorType) => {
    state.errors[key] = error;
};

const MAX_LENGTH = 21;
const RUSSIAN_LETTERS_REGEX = /^[А-Яа-яёЁ]+$/;

export const studentsSlice = createSlice({
    name: "dean-students",
    initialState: initialState,
    reducers: {
        moveStudentToSubgroup(state, action: PayloadAction<{ idStudent: number; toSubgroupId: number }>
        ) {
            const { idStudent, toSubgroupId } = action.payload;
            let movedStudent: StudentInfoState;

            state.selectedSubgroup = {
                ...state.selectedSubgroup,
                students: state.selectedSubgroup.students.filter(
                    student => student.idStudent !== idStudent
                ),
            };

            state.subgroups = state.subgroups.map(subgroup => ({
                ...subgroup,
                students: subgroup.students.filter(student => {
                    if (student.idStudent === idStudent) {
                        movedStudent = { ...student };
                        return false;
                    }
                    return true;
                })
            }));
        
            movedStudent!.idSubgroup = toSubgroupId;
        
            state.subgroups = state.subgroups.map(subgroup =>
                subgroup.subgroup.idSubgroup === toSubgroupId
                    ? {
                        ...subgroup,
                        students: [...subgroup.students, movedStudent!].sort((a, b) =>
                            a.flpName.localeCompare(b.flpName)
                        ),
                    }
                    : subgroup
            );
        },          
        setSubgroupsActionCreator(state, action: PayloadAction<SubgroupInfoState[]>) {
            const today = new Date();
            const currentYear = today >= new Date(today.getFullYear(), 7, 1) ? today.getFullYear() : today.getFullYear() - 1; 

            state.subgroups = action.payload.map(subgroup => {
                const admissionYear = new Date(subgroup.subgroup.admissionDate).getFullYear();
                const course = currentYear - admissionYear + 1;

                const groupInfo = subgroup.subgroup.subgroupNumber.split('.');
                    
                return {
                    ...subgroup,
                    subgroup: {
                        ...subgroup.subgroup,
                        subgroupNumber: `${course} курс ${groupInfo[0]} гр. ${groupInfo[1]} п.`
                    },
                    students: subgroup.students.map(student => ({
                        ...student,
                        flpName: student.flpName.replace(/_/g, ' ')
                    }))
                };
            });
        },
        removeSubgroupByIdActionCreator(state, action: PayloadAction<number>) {
            const idSubgroupToDelete = action.payload;
        
            state.subgroups = state.subgroups.filter(subgroup => subgroup.subgroup.idSubgroup !== idSubgroupToDelete);
        
            if (state.selectedSubgroup.subgroup.idSubgroup === idSubgroupToDelete) {
                state.selectedSubgroup = {
                    subgroup: {
                        idSubgroup: -1,
                        subgroupNumber: '',
                        admissionDate: '',
                        idDean: -1,
                        idSpecialty: -1
                    },
                    students: []
                };
            }
        },
        deleteStudentByIdActionCreator(state, action: PayloadAction<number>) {
            const studentId = action.payload;
        
            state.subgroups = state.subgroups.map((subgroup) => ({
                ...subgroup,
                students: subgroup.students.filter(student => student.idAccount !== studentId)
            }));
        
            if (state.selectedSubgroup) {
                state.selectedSubgroup = {
                    ...state.selectedSubgroup,
                    students: state.selectedSubgroup.students.filter(student => student.idAccount !== studentId)
                };
            }
        },
        updateStudentByIdActionCreator(state, action: PayloadAction<StudentInfoState>) {
            const updatedStudent = action.payload;
        
            state.subgroups = state.subgroups.map((subgroup) => ({
                ...subgroup,
                students: subgroup.students.map(student =>
                    student.idAccount === updatedStudent.idAccount ? {
                        ...student,
                        flpName: updatedStudent.flpName.replace(/_/g, ' ')
                    } : student
                ),
            }));
        
            if (state.selectedSubgroup) {
                state.selectedSubgroup = {
                    ...state.selectedSubgroup,
                    students: state.selectedSubgroup.students.map(student =>
                        student.idAccount === updatedStudent.idAccount ? {
                            ...student,
                            flpName: updatedStudent.flpName.replace(/_/g, ' ')
                        } : student
                    ),
                };
            }
            
            state.selectedStudent.flpName = action.payload.flpName.replace(/_/g, ' ');
        },        
        addStudentActionCreator(state, action: PayloadAction<StudentInfoState>) {
            const newStudent = action.payload;
        
            state.subgroups = state.subgroups.map((subgroup) => ({
                ...subgroup,
                students: subgroup.subgroup.idSubgroup === newStudent.idSubgroup
                    ? [
                        ...subgroup.students,
                        {
                            ...newStudent,
                            flpName: newStudent.flpName.replace(/_/g, ' ')
                        }
                    ].sort((a, b) => a.flpName.localeCompare(b.flpName))
                    : subgroup.students
            }));
        
            if (state.selectedSubgroup.subgroup.idSubgroup === newStudent.idSubgroup) {
                state.selectedSubgroup = {
                    ...state.selectedSubgroup,
                    students: [
                        ...state.selectedSubgroup.students,
                        {
                            ...newStudent,
                            flpName: newStudent.flpName.replace(/_/g, ' ')
                        }
                    ].sort((a, b) => a.flpName.localeCompare(b.flpName))
                };
            }
        },
        setSelectedSubgroupActionCreator(state, action: PayloadAction<{value: SubgroupInfoState, onSuccess: () => void}>) {
            state.selectedSubgroup = action.payload.value;
            action.payload.onSuccess();
        },
        clearFormActionCreator(state) {
            state.errors = {};
            state.newLastname = '';
            state.newName = '';
            state.newSurname = '';
        },
        setSelectedStudentActionCreator(state, action: PayloadAction<{value: StudentInfoState, onSuccess: () => void}>) {
            state.selectedStudent = action.payload.value;
            action.payload.onSuccess();
        },
        setSearchSubgroupsActionCreator(state, action: PayloadAction<string>) {
            state.searchSubgroups = action.payload;
        },
        setSearchNewSubgroupsActionCreator(state, action: PayloadAction<string>) {
            state.searchNewSubgroup = action.payload;
        },
        setSearchStudentsActionCreator(state, action: PayloadAction<string>) {
            state.searchStudents = action.payload;
        },
        setSelectedNewIdActionCreator(state, action: PayloadAction<{id: number, onSuccess: () => void}>) {
            state.selectedNewId = action.payload.id;
            action.payload.onSuccess();
        },
        setNewPasswordActionCreator(state, action: PayloadAction<string>) {
            state.newPassword = action.payload;
        },
        setNewLastnameActionCreator(state, action: PayloadAction<string>) {
            const lastname = action.payload;
            if (lastname === '' || (lastname.length <= MAX_LENGTH && RUSSIAN_LETTERS_REGEX.test(lastname))) {
                state.newLastname = lastname;
            }
        },
        setNewNameActionCreator(state, action: PayloadAction<string>) {
            const name = action.payload;
            if (name === '' || (name.length <= MAX_LENGTH && RUSSIAN_LETTERS_REGEX.test(name))) {
                state.newName = name;
            }
        },
        setNewSurnameActionCreator(state, action: PayloadAction<string>) {
            const surname = action.payload;
            if (surname === '' || (surname.length <= MAX_LENGTH && RUSSIAN_LETTERS_REGEX.test(surname))) {
                state.newSurname = surname;
            }
        },
        setError(state, action: PayloadAction<{ key: string; error: ErrorType }>) {
            setErrorByKey(state, action.payload.key, action.payload.error);
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
            .addCase(initDeanMembersActionCreator.fulfilled, (state) => {
                state.loading = 'success';
            })
            .addCase(initDeanMembersActionCreator.pending, (state) => {
                state.loading = 'loading';
            })
            .addCase(initDeanMembersActionCreator.rejected, (state) => {
                state.loading = "idle";
            })

            .addCase(recoverPasswordForStudentActionCreator.fulfilled, (state) => {
                state.loadingRecovery = 'success';
            })
            .addCase(recoverPasswordForStudentActionCreator.pending, (state) => {
                state.loadingRecovery = 'loading';
            })
            .addCase(recoverPasswordForStudentActionCreator.rejected, (state) => {
                state.loadingRecovery = "idle";
            })

            .addCase(deleteStudentActionCreator.fulfilled, (state) => {
                state.loadingDelete = 'success';
            })
            .addCase(deleteStudentActionCreator.pending, (state) => {
                state.loadingDelete = 'loading';
            })
            .addCase(deleteStudentActionCreator.rejected, (state) => {
                state.loadingDelete = "idle";
            })

            .addCase(updateStudentActionCreator.fulfilled, (state) => {
                state.loadingUpdate = 'success';
            })
            .addCase(updateStudentActionCreator.pending, (state) => {
                state.loadingUpdate = 'loading';
            })
            .addCase(updateStudentActionCreator.rejected, (state) => {
                state.loadingUpdate = "idle";
            })

            .addCase(createStudentActionCreator.fulfilled, (state) => {
                state.loadingAdd = 'success';
            })
            .addCase(createStudentActionCreator.pending, (state) => {
                state.loadingAdd = 'loading';
            })
            .addCase(createStudentActionCreator.rejected, (state) => {
                state.loadingAdd = "idle";
            })

            .addCase(deleteSubgroupActionCreator.fulfilled, (state) => {
                state.loadingDelete = 'success';
            })
            .addCase(deleteSubgroupActionCreator.pending, (state) => {
                state.loadingDelete = 'loading';
            })
            .addCase(deleteSubgroupActionCreator.rejected, (state) => {
                state.loadingDelete = "idle";
            })

            .addCase(reassignStudentActionCreator.fulfilled, (state) => {
                state.loadingReassign = 'success';
            })
            .addCase(reassignStudentActionCreator.pending, (state) => {
                state.loadingReassign = 'loading';
            })
            .addCase(reassignStudentActionCreator.rejected, (state) => {
                state.loadingReassign = "idle";
            })
    },
});


export const initDeanMembersActionCreator = createAsyncThunk('dean-students/initialize',
    async (data: { authToken: string}, thunkApi ) => {
        const { authToken } = data;
        try {
            const responce = await deanApi.getMembers(authToken);
            thunkApi.dispatch(studentsSlice.actions.setSubgroupsActionCreator(responce));
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

export const recoverPasswordForStudentActionCreator = createAsyncThunk('dean-students/recover-password',
    async (data: { authToken: string, id: number, onSuccess: () => void}, thunkApi ) => {
        const { authToken, id, onSuccess } = data;
        try {
            const responce = await deanApi.recoveryPasswordForStudent(authToken, id);
            thunkApi.dispatch(studentsSlice.actions.setNewPasswordActionCreator(responce));
            onSuccess();
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


export const deleteStudentActionCreator = createAsyncThunk('dean-students/delete-student',
    async (data: { authToken: string, id: number, onSuccess: () => void}, thunkApi ) => {
        const { authToken, id, onSuccess } = data;
        try {
            await deanApi.deleteStudent(authToken, id);
            thunkApi.dispatch(studentsSlice.actions.deleteStudentByIdActionCreator(id));
            onSuccess();
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

const validateField = (
    thunkApi: any, 
    value: string, 
    minLength: number, 
    errorKey: string, 
    errorMessage: string
) => {
    if (value.length < minLength) {
        thunkApi.dispatch(studentsSlice.actions.setError(
            { key: errorKey, error: errorMessage }
        ));
        return false;
    }
    return true;
};


export const createStudentActionCreator = createAsyncThunk('dean-students/create-student',
    async (data: { 
        authToken: string, 
        numberOfGroupId: string, 
        lastname: string, 
        name: string, 
        surname: string, 
        onSuccess: () => void
    }, thunkApi ) => {
        const { authToken, numberOfGroupId, lastname, name, surname, onSuccess } = data;
        try {
            thunkApi.dispatch(studentsSlice.actions.clearErrors());
            
            let hasError = false;
            
            hasError = !validateField(thunkApi, name, 1, "newNameError", 'Введите корректное имя') || hasError;
            hasError = !validateField(thunkApi, lastname, 1, "newLastnameError", 'Введите корректную фамилию') || hasError;
            hasError = !validateField(thunkApi, surname, 1, "newSurnameError", 'Введите корректное отчество') || hasError;
            
            if (hasError) return;

            const responce = await deanApi.createStudent(authToken, numberOfGroupId, lastname, name, surname);
            thunkApi.dispatch(studentsSlice.actions.addStudentActionCreator(responce));
            onSuccess();
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

export const updateStudentActionCreator = createAsyncThunk('dean-students/update-student',
    async (data: { 
        authToken: string, 
        id: number, 
        lastname: string, 
        name: string, 
        surname: string, 
        onSuccess: () => void
    }, thunkApi ) => {
        const { authToken, id, lastname, name, surname, onSuccess } = data;
        try {
            thunkApi.dispatch(studentsSlice.actions.clearErrors());
            
            let hasError = false;
            
            hasError = !validateField(thunkApi, name, 1, "newNameError", 'Введите корректное имя') || hasError;
            hasError = !validateField(thunkApi, lastname, 1, "newLastnameError", 'Введите корректную фамилию') || hasError;
            hasError = !validateField(thunkApi, surname, 1, "newSurnameError", 'Введите корректное отчество') || hasError;
            
            if (hasError) return;

            const response = await deanApi.updateStudent(authToken, id, lastname, name, surname);
            thunkApi.dispatch(studentsSlice.actions.updateStudentByIdActionCreator(response));
            onSuccess();
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

export const deleteSubgroupActionCreator = createAsyncThunk('dean-students/delete-subgroup',
    async (data: {authToken: string, idSubgroup: number,onSuccess: () => void}, thunkApi ) => {
        const { authToken, idSubgroup, onSuccess } = data;
        try {
            await deanApi.deleteSubgroup(authToken, idSubgroup);
            thunkApi.dispatch(studentsSlice.actions.removeSubgroupByIdActionCreator(idSubgroup));
            onSuccess();
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

export const reassignStudentActionCreator = createAsyncThunk('dean-students/reassign-student',
    async (data: {authToken: string, idStudent: number, idSubgroup: number, onSuccess: () => void}, thunkApi ) => {
        const { authToken, idStudent, idSubgroup, onSuccess } = data;
        try {
            await deanApi.reassignStudent(authToken, idStudent, idSubgroup);
            thunkApi.dispatch(studentsSlice.actions.moveStudentToSubgroup({idStudent, toSubgroupId: idSubgroup}));
            onSuccess();
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

export default studentsSlice.reducer;
