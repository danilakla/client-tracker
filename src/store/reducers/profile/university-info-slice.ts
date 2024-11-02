import { PayloadAction, createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { universityApi } from "../../../api/auth/university-api";

type ErrorType = string | null;

export type UniversityInfoState = {
    nameUniversity: string;
    descriptionUniversity: string;
    loading: "idle" | "loading" | "success" | "error";
    errors: Record<string, ErrorType>;
};

const initialState: UniversityInfoState = {
    nameUniversity: "",
    descriptionUniversity: "",
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
        setNameUniversityActionCreater(state, action: PayloadAction<string>) {
            state.nameUniversity = action.payload;
        },
        setDescriptionUniversityActionCreater(state, action: PayloadAction<string>) {
            state.descriptionUniversity = action.payload;
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

export const getUniversityInfoActionCreator = createAsyncThunk('login/user',
    async (data: { authToken: string}, thunkApi ) => {
        const { authToken } = data;
        try {
            const responce = await universityApi.getUniversityInfo(authToken);
            thunkApi.dispatch(universityInfoSlice.actions.setNameUniversityActionCreater(responce.name));
            thunkApi.dispatch(universityInfoSlice.actions.setDescriptionUniversityActionCreater(responce.description));
        }
        catch (e) {
            if (axios.isAxiosError(e)) {
                // thunkApi.dispatch(loginSlice.actions.setError(
                //     { key: "passwordError", error: e.response?.data.message }
                // ));
            }
        }
    }
)

export default universityInfoSlice.reducer;
