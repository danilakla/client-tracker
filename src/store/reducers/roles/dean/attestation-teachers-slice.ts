import { PayloadAction, createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { appStatusSlice } from "../../app-status-slice";
import { deanApi } from "../../../../api/auth/dean-api";

export type AttestationTeachersState = {
    loading: "idle" | "loading" | "success" | "error";
}


const initialState : AttestationTeachersState = {
    loading: 'idle',
}

export const attestationTeachersSlice = createSlice({
    name: 'attestation-teachers-slice',
    initialState,
    reducers: {
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
            const response = deanApi.getTeachersNotAttessted(authToken);
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