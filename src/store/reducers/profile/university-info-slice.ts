import { PayloadAction, createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { universityApi } from "../../../api/auth/university-api";
import { appStatusSlice } from "../app-status-slice";

type ErrorType = string | null;

export type UniversityDataState = {
    name: string,
    description: string,
    idUniversity: number
};

export type UniversityInfoState = {
    university: UniversityDataState,
    loading: "idle" | "loading" | "success" | "error";
    errors: Record<string, ErrorType>;
};

const initialState: UniversityInfoState = {
    university: {
        name: '',
        description: '',
        idUniversity: 0
    },
    loading: "idle",
    errors: {},
};

const setErrorByKey = (state: UniversityInfoState, key: string, error: ErrorType) => {
    state.errors[key] = error;
};

export const universityInfoSlice = createSlice({
    name: "university-info",
    initialState: initialState,
    reducers: {
        setUniversityDataActionCreater(state, action: PayloadAction<UniversityDataState>) {
            state.university = action.payload;
        },
        setError(state, action: PayloadAction<{ key: string; error: ErrorType }>) {
            setErrorByKey(state, action.payload.key, action.payload.error);
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
            .addCase(getUniversityInfoActionCreator.fulfilled, (state) => {
                state.loading = 'success';
            })
            .addCase(getUniversityInfoActionCreator.pending, (state) => {
                state.loading = 'loading';
            })
            .addCase(getUniversityInfoActionCreator.rejected, (state) => {
                state.loading = "idle";
            })
    },
});

export const getUniversityInfoActionCreator = createAsyncThunk('university/info',
    async (data: { authToken: string}, thunkApi ) => {
        const { authToken } = data;
        try {
            const responce = await universityApi.getUniversityInfo(authToken);
            thunkApi.dispatch(universityInfoSlice.actions.setUniversityDataActionCreater(responce));
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

export default universityInfoSlice.reducer;
