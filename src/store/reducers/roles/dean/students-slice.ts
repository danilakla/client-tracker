import { PayloadAction, createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { deanApi } from "../../../../api/auth/dean-api";
import { appStatusSlice } from "../../app-status-slice";
import axios from "axios";
import { ItemOfSelectType } from "../../../../ui-kit/select/select";

type ErrorType = string | null;

export type StudentInfoState = {
    idStudent: number,
    idSubgroup: number,
    flpName: string,
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
    selectedSubgroup: SubgroupInfoState;
    selectedStudent: StudentInfoState;
    searchSubgroups: string;
    searchStudents: string;
    newPassword: string;
    newLastname: string;
    newName: string;
    subgroupsForSelect: ItemOfSelectType[];
    selectedSubgroupFromSelect: ItemOfSelectType;
    newSurname: string;
    loadingDelete: "idle" | "loading" | "success" | "error";
    loadingAdd: "idle" | "loading" | "success" | "error";
    loadingUpdate: "idle" | "loading" | "success" | "error";
    loading: "idle" | "loading" | "success" | "error";
    errors: Record<string, ErrorType>;
};

const initialState: StudentsState = {
    subgroups: [],
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
    subgroupsForSelect: [],
    selectedSubgroupFromSelect: {
        name: 'Не выбрано',
        value: '-1'
    },
    selectedStudent: {
        idStudent: -1,
        idSubgroup: -1,
        flpName: '',
        keyStudentParents: '',
        idAccount: -1
    },
    newLastname: '',
    newName: '',
    newSurname: '',
    searchSubgroups: '',
    searchStudents: '',
    newPassword: '',
    loadingAdd: 'idle',
    loadingDelete: 'idle',
    loadingUpdate: 'idle',
    loading: "idle",
    errors: {},
};

const setErrorByKey = (state: StudentsState, key: string, error: ErrorType) => {
    state.errors[key] = error;
};

export const studentsSlice = createSlice({
    name: "dean-students",
    initialState: initialState,
    reducers: {
        setSubgroupsActionCreator(state, action: PayloadAction<SubgroupInfoState[]>) {
            state.subgroups = action.payload;
            //todo logic
        },
        setSelectedSubgroupActionCreator(state, action: PayloadAction<SubgroupInfoState>) {
            state.selectedSubgroup = action.payload;
        },
        setSelectedStudentActionCreator(state, action: PayloadAction<StudentInfoState>) {
            state.selectedStudent = action.payload;
        },
        setSearchSubgroupsActionCreator(state, action: PayloadAction<string>) {
            state.searchSubgroups = action.payload;
        },
        setSearchStudentsActionCreator(state, action: PayloadAction<string>) {
            state.searchStudents = action.payload;
        },
        setNewPasswordActionCreator(state, action: PayloadAction<string>) {
            state.newPassword = action.payload;
        },
        setNewLastnameActionCreator(state, action: PayloadAction<string>) {
            state.newLastname = action.payload;
        },
        setNewNameActionCreator(state, action: PayloadAction<string>) {
            state.newName = action.payload;
        },
        setNewSurnameActionCreator(state, action: PayloadAction<string>) {
            state.newSurname = action.payload;
        },
        setSelectedSubgroupFromSelectActionCreator(state, action: PayloadAction<ItemOfSelectType>) {
            state.selectedSubgroupFromSelect = action.payload;
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
                }
            }
        }
    }
)

export const recoverPasswordForStudentActionCreator = createAsyncThunk('dean-students/recover-password',
    async (data: { authToken: string, id: number, onSuccess?: () => void}, thunkApi ) => {
        const { authToken, id, onSuccess } = data;
        try {
            const responce = await deanApi.recoveryPasswordForStudent(authToken, id);
            thunkApi.dispatch(studentsSlice.actions.setNewPasswordActionCreator(responce));
            onSuccess?.();
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


export const deleteStudentActionCreator = createAsyncThunk('dean-students/delete-student',
    async (data: { authToken: string, id: number, onSuccess?: () => void}, thunkApi ) => {
        const { authToken, id, onSuccess } = data;
        try {
            await deanApi.deleteStudent(authToken, id);
            //todo logic
            onSuccess?.();
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

export const createStudentActionCreator = createAsyncThunk('dean-students/create-student',
    async (data: { 
        authToken: string, 
        numberOfGroupId: string, 
        lastname: string, 
        name: string, 
        surname: string, 
        onSuccess?: () => void
    }, thunkApi ) => {
        const { authToken, numberOfGroupId, lastname, name, surname, onSuccess } = data;
        try {
            await deanApi.createStudent(authToken, numberOfGroupId, lastname, name, surname);
            //todo logic
            onSuccess?.();
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

export const updateStudentActionCreator = createAsyncThunk('dean-students/update-student',
    async (data: { 
        authToken: string, 
        id: number, 
        lastname: string, 
        name: string, 
        surname: string, 
        onSuccess?: () => void
    }, thunkApi ) => {
        const { authToken, id, lastname, name, surname, onSuccess } = data;
        try {
            await deanApi.updateStudent(authToken, id, lastname, name, surname);
            //todo logic
            onSuccess?.();
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

export default studentsSlice.reducer;
