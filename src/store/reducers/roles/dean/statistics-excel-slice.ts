import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { appStatusSlice } from "../../app-status-slice";
import { deanApi } from "../../../../api/auth/dean-api";

export type StatisticsExcelState = {
    loading: "idle" | "loading" | "success" | "error";
    errors: Record<string, ErrorType>;
}

type ErrorType = string | null;

const initialState : StatisticsExcelState = {
    loading: 'idle',
    errors: {}
}

const setErrorByKey = (state: StatisticsExcelState, key: string, error: ErrorType) => {
    state.errors[key] = error;
};

export const statisticsExcelSlice = createSlice({
    name: 'statistics-excel-slice',
    initialState,
    reducers: {
        reset(state) {
            Object.assign(state, initialState);
        },
        clearErrors(state) {
            state.errors = {};
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(getStatisticsExcelActionCreator.fulfilled, (state) => {
                state.loading = 'success';
            })
            .addCase(getStatisticsExcelActionCreator.pending, (state) => {
                state.loading = "loading";
            })
            .addCase(getStatisticsExcelActionCreator.rejected, (state) => {
                state.loading = 'error';
            });
    },
});


export const getStatisticsExcelActionCreator = createAsyncThunk('statistics-excel/get',
    async (data: { authToken: string, onSuccess: () => void, onError: () => void }, thunkApi) => {
        const { authToken, onError, onSuccess } = data;
        try {
            const response = await deanApi.getStatisticsExcel(authToken);

            const fileURL = window.URL.createObjectURL(new Blob([response]));
            const link = document.createElement('a');
            link.href = fileURL;
            link.setAttribute('download', 'statistics.zip');

            document.body.appendChild(link);
            link.click();

            document.body.removeChild(link);
            window.URL.revokeObjectURL(fileURL);

            onSuccess();
        }
        catch (e) {
            if (axios.isAxiosError(e)) {
                if (e.response?.status === 401) {
                    thunkApi.dispatch(appStatusSlice.actions.setStatusApp({ status: "no-autorizate" }))
                    return;
                } else onError();
            } else thunkApi.dispatch(appStatusSlice.actions.setStatusApp({ status: "app-error" }))
        }
    }
)

export default statisticsExcelSlice.reducer;