import { PayloadAction, createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { appStatusSlice } from "../../app-status-slice";
import { adminApi } from "../../../../api/auth/admin-api";
import { ItemOfSelectType } from "../../../../ui-kit/select/select";

type ErrorType = string | null;

export type TeacherInfoState = {
    idTeacher: number,
    flpName: string,
    idUniversity: number,
    login: string,
    idAccount: number
};

export type DeanInfoState = {
    idDean: number,
    flpName: string,
    faculty: string,
    idUniversity: number,
    login: string,
    idAccount: number
};

export type MembersState = {
    selectedNewResponsible: ItemOfSelectType;
    searchText: string;
    newPassword: string;
    selectedDean: DeanInfoState;
    selectedTeacher: TeacherInfoState;
    listDeans: DeanInfoState[],
    itemsForSelectTeachers: ItemOfSelectType[],
    itemsForSelectDean: ItemOfSelectType[],
    listTeachers: TeacherInfoState[],
    loading: "idle" | "loading" | "success" | "error";
    loadingNewPassword: "idle" | "loading" | "success" | "error";
    loadingDelete: "idle" | "loading" | "success" | "error";
    errors: Record<string, ErrorType>;
};

const initialState: MembersState = {
    searchText: '',
    selectedNewResponsible: {
        name: 'Не выбрано',
        value: '-1'
    },
    newPassword: '',
    selectedDean: {
        idDean: 0,
        login: '',
        flpName: '',
        faculty: '',
        idUniversity: 0,
        idAccount: 0
    },
    selectedTeacher: {
        idTeacher: 0,
        flpName: '',
        login: '',
        idUniversity: 0,
        idAccount: 0
    },
    listDeans: [],
    listTeachers: [],
    itemsForSelectTeachers: [],
    itemsForSelectDean: [],
    loadingNewPassword: 'idle',
    loading: "idle",
    loadingDelete: 'idle',
    errors: {},
};

const setErrorByKey = (state: MembersState, key: string, error: ErrorType) => {
    state.errors[key] = error;
};

export const membersSlice = createSlice({
    name: "admin-members",
    initialState: initialState,
    reducers: {
        setError(state, action: PayloadAction<{ key: string; error: ErrorType }>) {
            setErrorByKey(state, action.payload.key, action.payload.error);
        },
        setListDeansActionCreater(state, action: PayloadAction<DeanInfoState[]>){
            state.listDeans = action.payload.map(teacher => ({
                ...teacher,
                flpName: teacher.flpName.replace(/_/g, ' '),
            }));
        },
        setSearchTextActionCreater(state, action: PayloadAction<string>){
            state.searchText = action.payload;
        },
        setSelectedNewResponsibleActionCreater(state, action: PayloadAction<ItemOfSelectType>){
            state.selectedNewResponsible = action.payload;
        },
        setListTeachersActionCreater(state, action: PayloadAction<TeacherInfoState[]>){
            state.listTeachers = action.payload.map(teacher => ({
                ...teacher,
                flpName: teacher.flpName.replace(/_/g, ' '),
            }));
        },
        setSelectedDeanActionCreater(state, action: PayloadAction<DeanInfoState>){
            state.selectedDean = action.payload;
            state.itemsForSelectDean = state.listDeans
                .filter((item) => item.idDean !== action.payload.idDean)
                .map((dean) => ({
                    name: dean.flpName.replace(/_/g, ' '),
                    value: dean.idDean.toString()
                }))
        },
        setItemsForSelectTeachersActionCreater(state, action: PayloadAction<ItemOfSelectType[]>){
            state.itemsForSelectTeachers = action.payload;
        },
        setItemsForSelectDeansActionCreater(state, action: PayloadAction<ItemOfSelectType[]>){
            state.itemsForSelectDean = action.payload;
        },
        setNewPasswordActionCreater(state, action: PayloadAction<string>){
            state.newPassword = action.payload;
        },
        setSelectedTeacherActionCreater(state, action: PayloadAction<TeacherInfoState>){
            state.selectedTeacher = action.payload;
            state.itemsForSelectTeachers = state.listTeachers
                .filter((item) => item.idTeacher !== action.payload.idTeacher)
                .map((teacher) => ({
                    name: teacher.flpName.replace(/_/g, ' '),
                    value: teacher.idTeacher.toString()
                }))
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
            .addCase(initializeMembersDataActionCreator.fulfilled, (state) => {
                state.loading = 'success';
            })
            .addCase(initializeMembersDataActionCreator.pending, (state) => {
                state.loading = 'loading';
            })
            .addCase(initializeMembersDataActionCreator.rejected, (state) => {
                state.loading = "idle";
            })
            .addCase(recoverPasswordActionCreator.fulfilled, (state) => {
                state.loadingNewPassword = 'success';
            })
            .addCase(recoverPasswordActionCreator.pending, (state) => {
                state.loadingNewPassword = 'loading';
            })
            .addCase(recoverPasswordActionCreator.rejected, (state) => {
                state.loadingNewPassword = "idle";
            })
            .addCase(deleteDeanActionCreator.fulfilled, (state) => {
                state.loadingDelete = 'success';
            })
            .addCase(deleteDeanActionCreator.pending, (state) => {
                state.loadingDelete = 'loading';
            })
            .addCase(deleteDeanActionCreator.rejected, (state) => {
                state.loadingDelete = "idle";
            })
            .addCase(deleteTeacherActionCreator.fulfilled, (state) => {
                state.loadingDelete = 'success';
            })
            .addCase(deleteTeacherActionCreator.pending, (state) => {
                state.loadingDelete = 'loading';
            })
            .addCase(deleteTeacherActionCreator.rejected, (state) => {
                state.loadingDelete = "idle";
            })
    },
});

export const initializeMembersDataActionCreator = createAsyncThunk('admin-members/initialize',
    async (data: { authToken: string}, thunkApi ) => {
        const { authToken } = data;
        try {
            const responce = await adminApi.getMembers(authToken);
            thunkApi.dispatch(membersSlice.actions.setListDeansActionCreater(responce.deanList));
            thunkApi.dispatch(membersSlice.actions.setListTeachersActionCreater(responce.teacherList));
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

export const recoverPasswordActionCreator = createAsyncThunk('admin-members/recover-password',
    async (data: { authToken: string, id: number, onSuccess?: () => void}, thunkApi ) => {
        const { authToken, id, onSuccess } = data;
        try {
            const responce = await adminApi.recoverPassword(authToken, id);
            thunkApi.dispatch(membersSlice.actions.setNewPasswordActionCreater(responce));
            onSuccess?.();
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

export const deleteDeanActionCreator = createAsyncThunk('admin-members/delete-dean',
    async (data: { authToken: string, deanId: number, newDeanId: number, onSuccess?: () => void}, thunkApi ) => {
        const { authToken, deanId, newDeanId, onSuccess } = data;
        try {
            await adminApi.deleteDean(authToken, deanId, newDeanId);
            await thunkApi.dispatch(initializeMembersDataActionCreator({authToken: authToken}));
            onSuccess?.();
        }
        catch (e) {
            if (axios.isAxiosError(e)) {
                if(e.response?.status === 401){
                    thunkApi.dispatch(appStatusSlice.actions.setStatusApp({ status: "no-autorizate" }))
                } else thunkApi.dispatch(membersSlice.actions.setError({
                    key: "selectedNewResponsibleError",
                    error: "Некорректное значение",
                }));
            } else thunkApi.dispatch(appStatusSlice.actions.setStatusApp({ status: "app-error" }))
        }
    }
)

export const deleteTeacherActionCreator = createAsyncThunk('admin-members/delete-teacher',
    async (data: { authToken: string, teacherId: number, newTeacherId: number, onSuccess?: () => void}, thunkApi ) => {
        const { authToken, teacherId, newTeacherId, onSuccess } = data;
        try {
            await adminApi.deleteDean(authToken, teacherId, newTeacherId);
            await thunkApi.dispatch(initializeMembersDataActionCreator({authToken: authToken}));
            onSuccess?.();
        }
        catch (e) {
            if (axios.isAxiosError(e)) {
                if(e.response?.status === 401){
                    thunkApi.dispatch(appStatusSlice.actions.setStatusApp({ status: "no-autorizate" }))
                } else thunkApi.dispatch(membersSlice.actions.setError({
                    key: "selectedNewResponsibleError",
                    error: "Некорректное значение",
                }));
            } else thunkApi.dispatch(appStatusSlice.actions.setStatusApp({ status: "app-error" }))
        }
    }
)

export default membersSlice.reducer;
