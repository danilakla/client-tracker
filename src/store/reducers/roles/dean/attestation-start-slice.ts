import { PayloadAction, createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { appStatusSlice } from "../../app-status-slice";
import { deanApi } from "../../../../api/auth/dean-api";

export type AttestationStartState = {
    timeOfDay: string;
    loadingStart: "idle" | "loading" | "success" | "error";
    errors: Record<string, ErrorType>;
}

type ErrorType = string | null;

const initialState : AttestationStartState = {
    timeOfDay: '',
    loadingStart: 'idle',
    errors: {}
}

const setErrorByKey = (state: AttestationStartState, key: string, error: ErrorType) => {
    state.errors[key] = error;
};

export const attestationStartSlice = createSlice({
    name: 'attestation-start-slice',
    initialState,
    reducers: {
        reset(state) {
            Object.assign(state, initialState);
        },
        setError(state, action: PayloadAction<{ key: string; error: ErrorType }>) {
            setErrorByKey(state, action.payload.key, action.payload.error);
        },
        setTimeOfDayActionCreator(state, action: PayloadAction<string>) {
            const sanitizedValue = action.payload.replace(',', '.').trim();
        
            if (sanitizedValue === "") {
                state.timeOfDay = "";
                return;
            }
        
            const floatRegex = /^-?(\d+(\.\d{0,2})?|\.\d{1,2})$/;
        
            if (floatRegex.test(sanitizedValue)) {
                const numericValue = parseFloat(sanitizedValue);
                if (numericValue < 1000) {
                    state.timeOfDay = sanitizedValue;
                } else {
                    console.error("Число должно быть меньше 1000");
                }
            } else {
                console.error("Неправильный формат числа");
            }
        },
        clearErrors(state) {
            state.errors = {};
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(startAttestationActionCreator.fulfilled, (state) => {
                state.loadingStart = 'success';
            })
            .addCase(startAttestationActionCreator.pending, (state) => {
                state.loadingStart = "loading";
            })
            .addCase(startAttestationActionCreator.rejected, (state) => {
                state.loadingStart = 'error';
            });
    },
});


export const startAttestationActionCreator = createAsyncThunk('attestation-start-slice/start',
    async (data: { authToken: string, time: string, onSuccess: () => void }, thunkApi) => {
        const { authToken, time, onSuccess } = data;
        try {
            if(time === ""){
                thunkApi.dispatch(attestationStartSlice.actions.setError({ 
                    key: "TimeOfDayError", 
                    error: "Введите корректное время" }))

                return;
            }

            const timeAtSeconds: number = parseFloat(time) * 86400;

            const response = deanApi.startAttestation(authToken, timeAtSeconds);

            thunkApi.dispatch(attestationStartSlice.actions.reset());
            onSuccess();
        }
        catch (e) {
            if (axios.isAxiosError(e)) {
                if (e.response?.status === 401) {
                    thunkApi.dispatch(appStatusSlice.actions.setStatusApp({ status: "no-autorizate" }))
                    return;
                } else thunkApi.dispatch(appStatusSlice.actions.setStatusApp({ status: "app-error" }))
            } else thunkApi.dispatch(appStatusSlice.actions.setStatusApp({ status: "app-error" }))
        }
    }
)

export default attestationStartSlice.reducer;