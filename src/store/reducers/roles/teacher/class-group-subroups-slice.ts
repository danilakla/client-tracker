import { PayloadAction, createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { appStatusSlice } from "../../app-status-slice";
import { teacherApi } from "../../../../api/auth/teacher-api";

type ErrorType = string | null;

export type SubgroupInfo = {
    idHold:  number,
    subgroup: {
        idSubgroup: number,
        subgroupNumber: string,
        admissionDate: string,
        idDean: number,
        idSpecialty: number,
        idClassGroupToSubgroup: number
    }
}

export type ClassGroupData = {
    subjectName: string,
    nameClassFormat: string,
    classGroup: {
        idClassGroup: number,
        idSubject: number,
        description: string,
        idClassFormat: number,
        idTeacher: number,
        idDean: number
    }
}

export type ClassGroupSubroupsState = {
    searchText: string;
    subgroups: SubgroupInfo[];
    classGroupInfo: ClassGroupData;
    isOneScreen: boolean;
    idClassGroup: number | null;
    loading: "idle" | "loading" | "success" | "error";
    errors: Record<string, ErrorType>;
};

const initialState: ClassGroupSubroupsState = {
    idClassGroup: null,
    classGroupInfo: {
        subjectName: '',
        nameClassFormat: '',
        classGroup: {
            idClassGroup: -1,
            idSubject: -1,
            description: '',
            idClassFormat: -1,
            idTeacher: -1,
            idDean: -1
        }
    },
    searchText: '',
    loading: "idle",
    isOneScreen: false,
    subgroups: [],
    errors: {},
};

const setErrorByKey = (state: ClassGroupSubroupsState, key: string, error: ErrorType) => {
    state.errors[key] = error;
};

export const classGroupSubroupsSlice = createSlice({
    name: "teacher-class-group-subroups",
    initialState: initialState,
    reducers: {
        setError(state, action: PayloadAction<{ key: string; error: ErrorType }>) {
            setErrorByKey(state, action.payload.key, action.payload.error);
        },
        setSearchTextActionCreator(state, action: PayloadAction<string>) {
            state.searchText = action.payload;
        },
        setClassGroupInfoActionCreator(state, action: PayloadAction<ClassGroupData>) {
            state.classGroupInfo = action.payload;
        },
        setIdClassGroupActionCreator(state, action: PayloadAction<{ idClassGroup: number, onSuccess?: () => void}>) {
            state.idClassGroup = action.payload.idClassGroup;
            action.payload.onSuccess?.();
        },
        setSubgroupsActionCreator(state, action: PayloadAction<SubgroupInfo[]>) {
            state.subgroups = action.payload;
        },
        setSIsOneScreenActionCreator(state, action: PayloadAction<boolean>) {
            state.isOneScreen = action.payload;
        },
        reset(state) {
            Object.assign(state, initialState);
        },
        resetStatus(state) {
            state.loading = 'idle';
        },
        clearErrors(state) {
            state.errors = {};
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(initSubgroupOfClassGroupActionCreator.fulfilled, (state) => {
                state.loading = 'success';
            })
            .addCase(initSubgroupOfClassGroupActionCreator.pending, (state) => {
                state.loading = 'loading';
            })
            .addCase(initSubgroupOfClassGroupActionCreator.rejected, (state) => {
                state.loading = "idle";
            })        
    },
});

export const initSubgroupOfClassGroupActionCreator = createAsyncThunk('teacher-class-group-subroups',
    async (data: {
        authToken: string, 
        idClassGroup: number, 
        onError: () => void,
        initStudentTable: (holdId: number, subgroup: SubgroupInfo, classGroupInfo: ClassGroupData) => void
    }, thunkApi ) => {
        const { authToken, onError, initStudentTable, idClassGroup } = data;
        try {
            const responce = await teacherApi.getClassGroupSubgroups(authToken, idClassGroup);
            thunkApi.dispatch(classGroupSubroupsSlice.actions.setClassGroupInfoActionCreator(responce.classGroup));

            const idSubgroups: number[] = responce.subgroupsId.map((subgroup: any) => subgroup.idSubgroup);
            const currentYear = new Date().getFullYear();
            const currentMonth = new Date().getMonth();

            const subgroupsData = await teacherApi.getSubgroupsByIds(authToken, idSubgroups, idClassGroup);
        
            const subgroups: SubgroupInfo[] = subgroupsData.classHoldSubgroupDTO.map((item: any) => {
                const classGroupToSubgroup = responce.subgroupsId.find(
                  (subgroup: any) => subgroup.idSubgroup === item.subgroup.idSubgroup
                );
        
                const admissionYear = new Date(item.subgroup.admissionDate).getFullYear();
                const course =
                 currentMonth >= 7
                   ? currentYear - admissionYear + 1
                   : currentYear - admissionYear;
        
                const groupInfo = item.subgroup.subgroupNumber?.split('.') || ['0', '0'];
        
                return {
                  idHold: item.idHold, 
                  subgroup: {
                    idSubgroup: item.subgroup.idSubgroup,
                    subgroupNumber: `${course === 0 ? 1 : course} курс - ${groupInfo[0]} гр. - ${groupInfo[1]} п.`,
                    admissionDate: item.subgroup.admissionDate,
                    idDean: item.subgroup.idDean,
                    idSpecialty: item.subgroup.idSpecialty,
                    idClassGroupToSubgroup: classGroupToSubgroup?.idClassGroupToSubgroup || 0,
                  },
                };
              });

              if(subgroupsData.isOneClass && subgroups.length > 0){
                thunkApi.dispatch(classGroupSubroupsSlice.actions.setSIsOneScreenActionCreator(true));

                initStudentTable(subgroups[0].idHold, {
                    idHold: subgroups[0].idHold,
                    subgroup: {
                        idSubgroup: 0,
                        subgroupNumber:  subgroups.map((item) => item.subgroup.subgroupNumber).join('#'),
                        admissionDate: '',
                        idDean: 0,
                        idSpecialty: 0,
                        idClassGroupToSubgroup: 0
                    }
                },
                responce.classGroup)

                return;
            }

            thunkApi.dispatch(classGroupSubroupsSlice.actions.setSubgroupsActionCreator(subgroups));
        }
        catch (e) {
            if (axios.isAxiosError(e)) {
                if(e.response?.status === 401){
                    thunkApi.dispatch(appStatusSlice.actions.setStatusApp({ status: "no-autorizate" }))
                }
            } else {
                onError();
            }
        }
    }
)

export default classGroupSubroupsSlice.reducer;
