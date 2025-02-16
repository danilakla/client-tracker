import { PayloadAction, createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { appStatusSlice } from "../../app-status-slice";
import { deanApi } from "../../../../api/auth/dean-api";

export type AttestationStudentsState = {
    loading: "idle" | "loading" | "success" | "error";
}


const initialState : AttestationStudentsState = {
    loading: 'idle',
}

export const attestationStudentsSlice = createSlice({
    name: 'attestation-students-slice',
    initialState,
    reducers: {
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