import { PayloadAction, createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { appStatusSlice } from "../../app-status-slice";
import { deanApi } from "../../../../api/auth/dean-api";

export type TeacherDto = {
    idTeacher: number
    flpName: string
    idAccount: number
    idUniversity: number
}

export type AttestationTeachersState = {
    loading: "idle" | "loading" | "success" | "error";
    teachers: TeacherDto[];
    searchText: string;
}



const initialState : AttestationTeachersState = {
    teachers: [],
    loading: 'idle',
    searchText: ''
}

export const attestationTeachersSlice = createSlice({
    name: 'attestation-teachers-slice',
    initialState,
    reducers: {
        setSearchTextActionCreator(state, action: PayloadAction<string>) {
            state.searchText = action.payload;
        },
        setTeachersActionCreator(state, action: PayloadAction<TeacherDto[]>) {
            state.teachers = action.payload;
        },
        reset(state) {
            Object.assign(state, initialState);
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(initTeachersForDeanActionCreator.fulfilled, (state) => {
                state.loading = 'success';
            })
            .addCase(initTeachersForDeanActionCreator.pending, (state) => {
                state.loading = "loading";
            })
            .addCase(initTeachersForDeanActionCreator.rejected, (state) => {
                state.loading = 'error';
            });
    },
});


export const initTeachersForDeanActionCreator = createAsyncThunk('attestation-teachers-slice/init',
    async (data: { authToken: string }, thunkApi) => {
        const { authToken } = data;
        try {
            const response = await deanApi.getTeachersNotAttessted(authToken);

            thunkApi.dispatch(attestationTeachersSlice.actions.setTeachersActionCreator(
                response.map((teacher: TeacherDto) => ({
                    ...teacher,
                    flpName: teacher.flpName.replace(/_/g, ' ')
                }))
            ));
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

export default attestationTeachersSlice.reducer;