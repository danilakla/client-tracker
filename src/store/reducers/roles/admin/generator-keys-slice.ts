import { PayloadAction, createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { ItemOfSelectType } from "../../../../ui-kit/select/select";
import axios from "axios";
import { adminApi } from "../../../../api/auth/admin-api";
import { appStatusSlice } from "../../app-status-slice";

type ErrorType = string | null;

export type GeneratorKeysState = {
    role: ItemOfSelectType;
    generatedKey: string;
    facultyName: string;
    loading: "idle" | "loading" | "success" | "error";
    errors: Record<string, ErrorType>;
};

const initialState: GeneratorKeysState = {
    role: {
        name: 'Преподаватель',
        value: 'TEACHER'
    },
    facultyName: '',
    generatedKey: '',
    loading: "idle",
    errors: {},
};

const setErrorByKey = (state: GeneratorKeysState, key: string, error: ErrorType) => {
    state.errors[key] = error;
};

export const generatorKeysSlice = createSlice({
    name: "admin-generator-keys",
    initialState: initialState,
    reducers: {
        setError(state, action: PayloadAction<{ key: string; error: ErrorType }>) {
            setErrorByKey(state, action.payload.key, action.payload.error);
        },
        setRoleActionCreater(state, action: PayloadAction<ItemOfSelectType>){
            state.role = action.payload;
        },
        setGeneratedKeyActionCreater(state, action: PayloadAction<string>){
            state.generatedKey = action.payload;
        },
        setFacultyNameActionCreater(state, action: PayloadAction<string>){
            state.facultyName = action.payload;
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
            .addCase(generateKeyActionCreator.fulfilled, (state) => {
                state.loading = 'success';
            })
            .addCase(generateKeyActionCreator.pending, (state) => {
                state.loading = 'loading';
            })
            .addCase(generateKeyActionCreator.rejected, (state) => {
                state.loading = "idle";
            })
    },
});

export const generateKeyActionCreator = createAsyncThunk('/admin-generator-keys/generate-key',
    async (data: { 
            authToken: string, 
            faculty: string, 
            role: string
        }, thunkApi ) => {
        const { authToken, faculty, role } = data;
        thunkApi.dispatch(generatorKeysSlice.actions.clearErrors());

        try {
            switch(role){
                case 'DEAN':
                    if(faculty.length < 1){
                        thunkApi.dispatch(generatorKeysSlice.actions.setError({
                            key: "facultyNameError",
                            error: 'Введите корректное название',
                        }));
                        
                        return;
                    }

                    const deanResponce = await adminApi.generateDean(authToken, faculty);
                    thunkApi.dispatch(generatorKeysSlice.actions.setGeneratedKeyActionCreater(deanResponce));
                    return;
                case 'TEACHER':
                    const teacherResponce = await adminApi.generateTeacher(authToken);
                    thunkApi.dispatch(generatorKeysSlice.actions.setGeneratedKeyActionCreater(teacherResponce));
                    return;
            }
        }
        catch (e) {
            if (axios.isAxiosError(e)) {
                if(e.response?.status === 401){
                    thunkApi.dispatch(appStatusSlice.actions.setStatusApp({ status: "no-autorizate" }))
                } else thunkApi.dispatch(appStatusSlice.actions.setStatusApp({ status: "app-error" }))
            } else thunkApi.dispatch(appStatusSlice.actions.setStatusApp({ status: "app-error" }))
        }
    }
)
  

export default generatorKeysSlice.reducer;
