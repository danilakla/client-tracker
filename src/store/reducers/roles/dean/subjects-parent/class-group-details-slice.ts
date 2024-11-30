import { PayloadAction, createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { ItemOfSelectType } from "../../../../../ui-kit/select/select";
import axios from "axios";
import { appStatusSlice } from "../../../app-status-slice";
import { deanApi } from "../../../../../api/auth/dean-api";

type ErrorType = string | null;

export type SubgroupDto = {
    idClassGroupToSubgroup: number,
    idSubgroup: number,
    idClassGroup: number
};

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


export type SubgroupDetails = {
    idSubgroup: number,
    subgroupNumber: string,
    admissionDate: string,
    idDean: number,
    idSpecialty: number,
    isExist: boolean
};

export type СlassGroupDetailsState = {
    teachers: ItemOfSelectType[];
    classFormats: ItemOfSelectType[];
    selectedTeacher: ItemOfSelectType;
    selectedClassFormat: ItemOfSelectType;
    selectedClassGroupId: number | null;
    subgroups: SubgroupDetails[];
    newSubgroups: SubgroupDetails[];
    searchText: string;
    searchTextWindow: string;
    description: string;
    loading: "idle" | "loading" | "success" | "error";
    loadingAdd: "idle" | "loading" | "success" | "error";
    errors: Record<string, ErrorType>;
};

const initialState: СlassGroupDetailsState = {
    searchText: '',
    selectedClassGroupId: null,
    teachers: [],
    description: '',
    searchTextWindow: '',
    classFormats: [],
    subgroups: [],
    newSubgroups: [],
    loadingAdd: 'idle',
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
        setSubgroupsActionCreator(state, action: PayloadAction<{subgroups: SubgroupInfo[], existingIds: number[] | null}>) {
            const currentYear = new Date().getFullYear();

            if (action.payload.existingIds === null) {
                state.subgroups = action.payload.subgroups.map(subgroup => {
                    const admissionYear = new Date(subgroup.admissionDate).getFullYear();
                    const course = Math.max(1, currentYear - admissionYear + 1);
                
                    return {
                        ...subgroup,
                        subgroupNumber: `${course} курс - ${subgroup.subgroupNumber} группа`,
                        isExist: false,
                    };
                });
            } else {
                const existingIds = action.payload.existingIds as number[];
                state.subgroups = action.payload.subgroups.map(subgroup => {
                    const admissionYear = new Date(subgroup.admissionDate).getFullYear();
                    const course = Math.max(1, currentYear - admissionYear + 1);
                
                    return {
                        ...subgroup,
                        subgroupNumber: `${course} курс - ${subgroup.subgroupNumber} группа`,
                        isExist: existingIds.includes(subgroup.idSubgroup),
                    };
                });
            }

            state.newSubgroups = state.subgroups;
        },
        setError(state, action: PayloadAction<{ key: string; error: ErrorType }>) {
            setErrorByKey(state, action.payload.key, action.payload.error);
        },
        setSearchTextActionCreator(state, action: PayloadAction<string>) {
            state.searchText = action.payload;
        },
        setSearchTextWindowActionCreator(state, action: PayloadAction<string>) {
            state.searchTextWindow = action.payload;
        },
        setDescriptionActionCreator(state, action: PayloadAction<string>) {
            state.description = action.payload;
        },
        setSelectedClassGroupIdActionCreator(state, action: PayloadAction<{value: number, onSuccess?: () => void}>) {
            state.selectedClassGroupId = action.payload.value;
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
        switchIsExistByIndexActionCreator(state, action: PayloadAction<number>) {
            state.newSubgroups[action.payload].isExist = !state.newSubgroups[action.payload].isExist;
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

            .addCase(createClassGroupActionCreator.fulfilled, (state) => {
                state.loadingAdd = 'success';
            })
            .addCase(createClassGroupActionCreator.pending, (state) => {
                state.loadingAdd = 'loading';
            })
            .addCase(createClassGroupActionCreator.rejected, (state) => {
                state.loadingAdd = "idle";
            })

            .addCase(updateClassGroupActionCreator.fulfilled, (state) => {
                state.loadingAdd = 'success';
            })
            .addCase(updateClassGroupActionCreator.pending, (state) => {
                state.loadingAdd = 'loading';
            })
            .addCase(updateClassGroupActionCreator.rejected, (state) => {
                state.loadingAdd = "idle";
            })
    },
});

export const initClassGroupDetailsActionCreator = createAsyncThunk('dean-class-group-details-slice/initialize',
    async (data: { authToken: string, selectedClassGroupId: number | null, type: "add" | "edit"}, thunkApi ) => {
        const { authToken, type, selectedClassGroupId } = data;
        try {
            const teachersResponse = await deanApi.getTeachers(authToken);
            const classFormatsResponse = await deanApi.getClassFormats(authToken);
            const subgroupsResponse = await deanApi.getSubgroups(authToken);

            switch(type){
                case 'add':
                    thunkApi.dispatch(classGroupDetailsSlice.actions.setTeachersActionCreator(teachersResponse));
                    thunkApi.dispatch(classGroupDetailsSlice.actions.setClassFormatsActionCreator(classFormatsResponse));

                    thunkApi.dispatch(classGroupDetailsSlice.actions.setSubgroupsActionCreator({
                        subgroups: subgroupsResponse, 
                        existingIds: null
                    }));
                    break;
                case 'edit':
                    if(selectedClassGroupId === null) return;

                    const classGroupDetailsResponse: any = await deanApi.getClassGroupDetails(authToken, selectedClassGroupId);

                    thunkApi.dispatch(classGroupDetailsSlice.actions.setDescriptionActionCreator(classGroupDetailsResponse.classGroup.classGroup.description || ''));
                    
                    thunkApi.dispatch(classGroupDetailsSlice.actions.setSubgroupsActionCreator({
                        subgroups: subgroupsResponse, 
                        existingIds: classGroupDetailsResponse.subgroupsId.map((item: any) => item.idSubgroup)
                    }));
                    
                    thunkApi.dispatch(classGroupDetailsSlice.actions.setTeachersWithSelectActionCreator({
                        teachers: teachersResponse,
                        id: classGroupDetailsResponse.classGroup.classGroup.idTeacher
                    }));
                    thunkApi.dispatch(classGroupDetailsSlice.actions.setClassFormatsWithSelectActionCreator({
                        classFormats: classFormatsResponse,
                        id: classGroupDetailsResponse.classGroup.classGroup.idClassFormat
                    }));

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

export const createClassGroupActionCreator = createAsyncThunk('dean-class-group-details-slice/create-class-group',
    async (data: { 
        authToken: string,
        teacherId: number,
        subjectId: number,
        formatClassId: number, 
        description: string, 
        newSubgroups: SubgroupDetails[],
        onSuccess?: () => void
    }, thunkApi ) => {
        const { authToken, teacherId, subjectId, formatClassId, description, newSubgroups, onSuccess } = data;
        try {
            const responce = await deanApi.createClassGroup(authToken, teacherId, subjectId, formatClassId, description);
            console.log(responce);
            const existingSubgroupIds = newSubgroups
                .filter(subgroup => subgroup.isExist)
                .map(subgroup => subgroup.idSubgroup); 
            await deanApi.assignGroupToClassGroup(authToken, responce.idClassGroup, existingSubgroupIds);
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

export const updateClassGroupActionCreator = createAsyncThunk('dean-class-group-details-slice/update-class-group',
    async (data: { 
        authToken: string,
        teacherId: string,
        subjectId: string,
        classGroupId: string,
        classFormatId: string, 
        description: string, 
        newSubgroups: SubgroupDetails[],
        oldSubgroups: SubgroupDetails[],
        onSuccess?: () => void
    }, thunkApi ) => {
        const { 
            authToken, 
            teacherId, 
            subjectId, 
            classGroupId, 
            classFormatId, 
            description, 
            newSubgroups, 
            oldSubgroups, 
            onSuccess 
        } = data;

        try {
            await deanApi.updateClassGroup(authToken, teacherId, classGroupId, subjectId , classFormatId, description);
            const existingSubgroupIds = newSubgroups
                .filter(subgroup => subgroup.isExist)
                .map(subgroup => subgroup.idSubgroup); 

            const oldSubgroupIds = oldSubgroups
                .filter(subgroup => subgroup.isExist)
                .map(subgroup => subgroup.idSubgroup); 

            const addedSubgroupIds = existingSubgroupIds.filter(id => !oldSubgroupIds.includes(id));
            console.log(addedSubgroupIds.length);
            if(addedSubgroupIds.length > 0)
                await deanApi.addGroupToClassGroup(authToken, Number.parseInt(classGroupId), addedSubgroupIds);
            

            const removedSubgroupIds = oldSubgroupIds.filter(id => !existingSubgroupIds.includes(id));
            if(removedSubgroupIds.length > 0)
                await deanApi.removeGroupToClassGroup(authToken, Number.parseInt(classGroupId), removedSubgroupIds);

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

export default classGroupDetailsSlice.reducer;