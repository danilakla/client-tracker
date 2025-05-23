import { PayloadAction, createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { appStatusSlice } from "../../app-status-slice";
import { deanApi } from "../../../../api/auth/dean-api";

export type SubgroupDTO = {
    subgroup: {
        id: number,
        subgroupNumber: string,
        admissionDate: string
    },
    students: StudentDTO[];
}

export type StudentDTO = {
    id: number,
    name: string
    classGroups: DebtDTO[]
    unattestedCount: number;
}

export type DebtDTO = {
    id: number,
    description: string,
    subjectName: string,
    formatName: string,
    teacherName: string,
    idClassHold: number
}

export type AttestationStudentsState = {
    loading: "idle" | "loading" | "success" | "error";
    subgroups: SubgroupDTO[];
    selectedSubgroup: SubgroupDTO;
    selectedStudent: StudentDTO;
    searchSubgroup: string;
    isCheckTable: boolean;
    searchStudent: string;
}

const initialState : AttestationStudentsState = {
    loading: 'idle',
    searchSubgroup: '',
    searchStudent: '',
    subgroups: [],
    isCheckTable: false,
    selectedSubgroup: {
        subgroup: {
            id: -1,
            subgroupNumber: '',
            admissionDate: ''
        },
        students: []
    },
    selectedStudent:{
        id: -1,
        name: '',
        classGroups: [],
        unattestedCount: -1
    }
}

export const attestationStudentsSlice = createSlice({
    name: 'attestation-students-slice',
    initialState,
    reducers: {
        setSubgroupsActionCreator(state, action: PayloadAction<SubgroupDTO[]>) {
            state.subgroups = action.payload;
        },
        setIsCheckTableActionCreator(state, action: PayloadAction<boolean>) {
            state.isCheckTable = action.payload;
        },
        setSelectedSubgroupActionCreator(state, action: PayloadAction<{value: SubgroupDTO, onSuccess: () => void}>) {
            state.selectedSubgroup = action.payload.value;
            action.payload.onSuccess();
        },
        setSelectedStudentActionCreator(state, action: PayloadAction<{value: StudentDTO, onSuccess: () => void}>) {
            state.selectedStudent = action.payload.value;
            action.payload.onSuccess();
        },
        setSearchStudentActionCreator(state, action: PayloadAction<string>) {
            state.searchStudent = action.payload;
        },
        setSearchSubgroupActionCreator(state, action: PayloadAction<string>) {
            state.searchSubgroup = action.payload;
        },
        reset(state) {
            Object.assign(state, initialState);
        },
        resetWithSuccess(state, action: PayloadAction<() => void>) {
            Object.assign(state, initialState);
            action.payload();
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(initStudentsForDeanActionCreator.fulfilled, (state) => {
                state.loading = 'success';
            })
            .addCase(initStudentsForDeanActionCreator.pending, (state) => {
                state.loading = "loading";
            })
            .addCase(initStudentsForDeanActionCreator.rejected, (state) => {
                state.loading = 'error';
            });
    },
});


export const initStudentsForDeanActionCreator = createAsyncThunk('attestation-students-slice/init',
    async (data: { authToken: string }, thunkApi) => {
        const { authToken } = data;
        try {
             const response = await deanApi.getStudentsNotAttessted(authToken);

             const today = new Date();
             const currentYear = today >= new Date(today.getFullYear(), 7, 1) ? today.getFullYear() : today.getFullYear() - 1; 

             const processedData = response.map((item: any) => {
               const admissionYear = new Date(item.subgroup.admissionDate).getFullYear();
               const course = currentYear - admissionYear + 1;

               const groupInfo = item.subgroup.subgroupNumber?.split('.') || ['0', '0'];
               const formattedGroup = `${course} курс ${groupInfo[0]} гр. ${groupInfo[1]} п.`;

                const students = item.students.map((student: any) => ({
                    ...student,
                    name: student.name.replace(/_/g, ' '),
                })).sort((a: any, b: any) => b.unattestedCount - a.unattestedCount);
            
                return {
                    ...item,
                    subgroup: {
                        ...item.subgroup,
                        subgroupNumber: formattedGroup,
                    },
                    students,
                };
            
            });

            thunkApi.dispatch(attestationStudentsSlice.actions.setSubgroupsActionCreator(processedData))

        }
        catch (e) {
            if (axios.isAxiosError(e)) {
                if (e.response?.status === 401) {
                    thunkApi.dispatch(appStatusSlice.actions.setStatusApp({ status: "no-autorizate" }))
                } else thunkApi.dispatch(appStatusSlice.actions.setStatusApp({ status: "app-error" }))
            } else thunkApi.dispatch(appStatusSlice.actions.setStatusApp({ status: "app-error" }))
        }
    }
)

export default attestationStudentsSlice.reducer;