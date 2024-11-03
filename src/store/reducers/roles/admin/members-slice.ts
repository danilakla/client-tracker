import { PayloadAction, createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { appStatusSlice } from "../../app-status-slice";
import { adminApi } from "../../../../api/auth/admin-api";

type ErrorType = string | null;

export type TeacherInfoState = {
    idTeacher: number,
    flpName: string,
    idUniversity: number,
    idAccount: number
};

export type DeanInfoState = {
    idDean: number,
    flpName: string,
    faculty: string,
    idUniversity: number,
    idAccount: number
};

export type MembersState = {
    searchText: string;
    selectedDean: DeanInfoState;
    selectedTeacher: TeacherInfoState;
    listDeans: DeanInfoState[],
    listTeachers: TeacherInfoState[],
    loading: "idle" | "loading" | "success" | "error";
    errors: Record<string, ErrorType>;
};

const initialState: MembersState = {
    searchText: '',
    selectedDean: {
        idDean: 0,
        flpName: '',
        faculty: '',
        idUniversity: 0,
        idAccount: 0
    },
    selectedTeacher: {
        idTeacher: 0,
        flpName: '',
        idUniversity: 0,
        idAccount: 0
    },
    listDeans: [],
    listTeachers: [],
    loading: "idle",
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
            state.listDeans = action.payload;
        },
        setSearchTextActionCreater(state, action: PayloadAction<string>){
            state.searchText = action.payload;
        },
        setListTeachersActionCreater(state, action: PayloadAction<TeacherInfoState[]>){
            state.listTeachers = action.payload;
        },
        setSelectedDeanActionCreater(state, action: PayloadAction<DeanInfoState>){
            state.selectedDean = action.payload;
        },
        setSelectedTeacherActionCreater(state, action: PayloadAction<TeacherInfoState>){
            state.selectedTeacher = action.payload;
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
                }
            }
        }
    }
)

export default membersSlice.reducer;
