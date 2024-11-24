import { PayloadAction, createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { ItemOfSelectType } from "../../../../../ui-kit/select/select";
import axios from "axios";
import { appStatusSlice } from "../../../app-status-slice";
import { deanApi } from "../../../../../api/auth/dean-api";
import { ClassGroupInfo } from "./class-groups-slice";

type ErrorType = string | null;

export type TeacherInfo = {
    idTeacher: number,
    flpName: string,
    idAccount: number,
    idUniversity: number
};

export type ClassFormatInfo = {
    idClassFormat: number,
    formatName: string,
    description: string,
    idDean: number
};

export type SubgroupInfo = {
    idSubgroup: number,
    subgroupNumber: string,
    admissionDate: string,
    idDean: number,
    idSpecialty: number
};

export type СlassGroupDetailsState = {
    teachers: ItemOfSelectType[];
    classFormats: ItemOfSelectType[];
    selectedTeacher: ItemOfSelectType;
    selectedClassFormat: ItemOfSelectType;
    selectedClassGroup: ClassGroupInfo | null;
    searchText: string;
    description: string;
    loading: "idle" | "loading" | "success" | "error";
    errors: Record<string, ErrorType>;
};

const initialState: СlassGroupDetailsState = {
    searchText: '',
    selectedClassGroup: null,
    teachers: [],
    description: '',
    classFormats: [],
    selectedClassFormat: {
        name: 'Не указано',
        value: '-1'
    },
    selectedTeacher: {
        name: 'Не указано',
        value: '-1'
    },
    loading: "idle",
    errors: {},
};

const setErrorByKey = (state: СlassGroupDetailsState, key: string, error: ErrorType) => {
    state.errors[key] = error;
};

export const classGroupDetailsSlice = createSlice({
    name: "dean-class-group-details-slice",
    initialState: initialState,
    reducers: {
        setError(state, action: PayloadAction<{ key: string; error: ErrorType }>) {
            setErrorByKey(state, action.payload.key, action.payload.error);
        },
        setSearchTextActionCreator(state, action: PayloadAction<string>) {
            state.searchText = action.payload;
        },
        setDescriptionActionCreator(state, action: PayloadAction<string>) {
            state.description = action.payload;
        },
        setSelectedClassGroupActionCreator(state, action: PayloadAction<{value: ClassGroupInfo, onSuccess?: () => void}>) {
            state.selectedClassGroup = action.payload.value;
            action.payload.onSuccess?.();
        },
        setTeachersActionCreator(state, action: PayloadAction<TeacherInfo[]>) {
            state.teachers = action.payload.map((teacher) => ({
                name: teacher.flpName.replaceAll('_', ' '),
                value: String(teacher.idTeacher),
            }));
        },
        setTeachersWithSelectActionCreator(state, action: PayloadAction<{ teachers: TeacherInfo[], id: number }>) {
            state.teachers = action.payload.teachers.map((teacher: TeacherInfo) => ({
                name: teacher.flpName.replaceAll('_', ' '),
                value: String(teacher.idTeacher),
            }));
        
            state.selectedTeacher = state.teachers.find(teacher => teacher.value === String(action.payload.id)) 
                || { name: 'Не указано', value: '-1' };
        },
        setTeacherById(state, action: PayloadAction<number>) {
            const teacher = state.teachers.find(t => t.value === String(action.payload));
            state.selectedTeacher = teacher || { name: 'Не указано', value: '-1' };
        },
        setClassFormatById(state, action: PayloadAction<number>) {
            const classFormat = state.classFormats.find(cf => cf.value === String(action.payload));
            state.selectedClassFormat = classFormat || { name: 'Не указано', value: '-1' };
        },
        setSelectedTeacherActionCreator(state, action: PayloadAction<ItemOfSelectType>) {
            state.selectedTeacher = action.payload;
        },
        setClassFormatsActionCreator(state, action: PayloadAction<ClassFormatInfo[]>) {
            state.classFormats = action.payload.map((classFormat) => ({
                name: classFormat.formatName,
                value: String(classFormat.idClassFormat),
            }));
        },
        setClassFormatsWithSelectActionCreator(state, action: PayloadAction<{ classFormats: ClassFormatInfo[], id: number }>) {
            state.classFormats = action.payload.classFormats.map((classFormat) => ({
                name: classFormat.formatName,
                value: String(classFormat.idClassFormat),
            }));
        
            state.selectedClassFormat = state.classFormats.find(classFormat => classFormat.value === String(action.payload.id)) 
                || { name: 'Не указано', value: '-1' };
        },
        setSelectedClassFormatActionCreator(state, action: PayloadAction<ItemOfSelectType>) {
            state.selectedClassFormat = action.payload;
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
            .addCase(initClassGroupDetailsActionCreator.fulfilled, (state) => {
                state.loading = 'success';
            })
            .addCase(initClassGroupDetailsActionCreator.pending, (state) => {
                state.loading = 'loading';
            })
            .addCase(initClassGroupDetailsActionCreator.rejected, (state) => {
                state.loading = "idle";
            })
    },
});

export const initClassGroupDetailsActionCreator = createAsyncThunk('dean-class-group-details-slice/initialize',
    async (data: { authToken: string, selectedClassGroup: ClassGroupInfo | null, type: "add" | "edit"}, thunkApi ) => {
        const { authToken, type, selectedClassGroup } = data;
        try {
            const teachersResponse = await deanApi.getTeachers(authToken);
            const classFormatsResponse = await deanApi.getClassFormats(authToken);

            
            switch(type){
                case 'add':
                    thunkApi.dispatch(classGroupDetailsSlice.actions.setTeachersActionCreator(teachersResponse));
                    thunkApi.dispatch(classGroupDetailsSlice.actions.setClassFormatsActionCreator(classFormatsResponse));
                    break;
                case 'edit':
                    thunkApi.dispatch(classGroupDetailsSlice.actions.setDescriptionActionCreator(selectedClassGroup?.description || ''));
                    if(selectedClassGroup !== null){
                        thunkApi.dispatch(classGroupDetailsSlice.actions.setTeachersWithSelectActionCreator({
                            teachers: teachersResponse,
                            id: selectedClassGroup.idTeacher
                        }));
                        thunkApi.dispatch(classGroupDetailsSlice.actions.setClassFormatsWithSelectActionCreator({
                            classFormats: classFormatsResponse,
                            id: selectedClassGroup.idClassFormat
                        }));
                    }
                    break;
            }
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

// export const recoverPasswordActionCreator = createAsyncThunk('admin-members/recover-password',
//     async (data: { authToken: string, id: number, onSuccess?: () => void}, thunkApi ) => {
//         const { authToken, id, onSuccess } = data;
//         try {
//             const responce = await adminApi.recoverPassword(authToken, id);
//             thunkApi.dispatch(membersSlice.actions.setNewPasswordActionCreater(responce));
//             onSuccess?.();
//         }
//         catch (e) {
//             if (axios.isAxiosError(e)) {
//                 if(e.response?.status === 401){
//                     thunkApi.dispatch(appStatusSlice.actions.setStatusApp({ status: "no-autorizate" }))
//                 }
//             }
//         }
//     }
// )

export default classGroupDetailsSlice.reducer;
