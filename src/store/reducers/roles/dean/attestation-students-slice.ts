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
    students: StudentDTO[]
}

export type StudentDTO = {
    id: number,
    name: string
    classGroups: DebtDTO[]
}

export type DebtDTO = {
    id: number,
    description: string
    idSubject: number,
    idClassFormat: number,
    idTeacher: number
}

export type AttestationStudentsState = {
    loading: "idle" | "loading" | "success" | "error";
    subgroups: SubgroupDTO[];
    selectedSubgroup: SubgroupDTO;
    selectedStudent: StudentDTO;
    searchSubgroup: string;
    searchStudent: string;
}

const initialState : AttestationStudentsState = {
    loading: 'idle',
    searchSubgroup: '',
    searchStudent: '',
    subgroups: [],
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
        classGroups: []
    }
}

export const attestationStudentsSlice = createSlice({
    name: 'attestation-students-slice',
    initialState,
    reducers: {
        setSubgroupsActionCreator(state, action: PayloadAction<SubgroupDTO[]>) {
            state.subgroups = action.payload;
        },
        setSelectedSubgroupActionCreator(state, action: PayloadAction<SubgroupDTO>) {
            state.selectedSubgroup = action.payload;
        },
        setSelectedStudentActionCreator(state, action: PayloadAction<StudentDTO>) {
            state.selectedStudent = action.payload;
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
             const response = deanApi.getStudentsNotAttessted(authToken);
        }
        catch (e) {
            if (axios.isAxiosError(e)) {
                if (e.response?.status === 401) {
                    thunkApi.dispatch(appStatusSlice.actions.setStatusApp({ status: "no-autorizate" }))
                }
            }
        }
    }
)

export default attestationStudentsSlice.reducer;