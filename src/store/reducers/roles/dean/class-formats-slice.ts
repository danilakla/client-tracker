import { PayloadAction, createSlice } from "@reduxjs/toolkit";

type ErrorType = string | null;

export type ClassFormatInfo = {
    idClassFormat: number,
    formatName: string,
    description: string,
    idDean: number
}

export type ClassFormatsState = {
    searchText: string;
    selectedClassFormat: ClassFormatInfo;
    classFormats: ClassFormatInfo[];
    loading: "idle" | "loading" | "success" | "error";
    errors: Record<string, ErrorType>;
};

const initialState: ClassFormatsState = {
    selectedClassFormat: {
        idClassFormat: -1,
        formatName: '',
        description: '',
        idDean: 1
    },
    classFormats: [], 
    searchText: '',
    loading: "idle",
    errors: {},
};

const setErrorByKey = (state: ClassFormatsState, key: string, error: ErrorType) => {
    state.errors[key] = error;
};

export const classFormatsSlice = createSlice({
    name: "dean-class-formats",
    initialState: initialState,
    reducers: {
        setError(state, action: PayloadAction<{ key: string; error: ErrorType }>) {
            setErrorByKey(state, action.payload.key, action.payload.error);
        },
        setSearchText(state, action: PayloadAction<string>) {
            state.searchText = action.payload;
        },
        setSelectedClassFormat(state, action: PayloadAction<ClassFormatInfo>) {
            state.selectedClassFormat = action.payload;
        },
        reset(state) {
            Object.assign(state, initialState);
        },
        clearErrors(state) {
            state.errors = {};
        },
    },
    extraReducers: (builder) => {
        // builder
        //     .addCase(initializeMembersDataActionCreator.fulfilled, (state) => {
        //         state.loading = 'success';
        //     })
        //     .addCase(initializeMembersDataActionCreator.pending, (state) => {
        //         state.loading = 'loading';
        //     })
        //     .addCase(initializeMembersDataActionCreator.rejected, (state) => {
        //         state.loading = "idle";
        //     })
    },
});

// export const initializeMembersDataActionCreator = createAsyncThunk('admin-members/initialize',
//     async (data: { authToken: string}, thunkApi ) => {
//         const { authToken } = data;
//         try {
//             const responce = await adminApi.getMembers(authToken);
//             thunkApi.dispatch(membersSlice.actions.setListDeansActionCreater(responce.deanList));
//             thunkApi.dispatch(membersSlice.actions.setListTeachersActionCreater(responce.teacherList));
//         }
//         catch (e) {
//             if (axios.isAxiosError(e)) {
//                 if(e.response?.status === 401){
//                     thunkApi.dispatch(appStatusSlice.actions.setStatusApp({ status: "no-autorizate" }))
//                 }
//             }
//         }
//     }
// )

// export const recoverPasswordActionCreator = createAsyncThunk('admin-members/recover-password',
//     async (data: { authToken: string, id: number, onSuccess?: () => void}, thunkApi ) => {
//         const { authToken, id, onSuccess } = data;
//         try {
//             const responce = await adminApi.recoverPassword(authToken, id);
//             thunkApi.dispatch(membersSlice.actions.setNewPasswordActionCreater(responce));
//             onSuccess?.();
//         }
//         catch (e) {
//             if (axios.isAxiosError(e)) {
//                 if(e.response?.status === 401){
//                     thunkApi.dispatch(appStatusSlice.actions.setStatusApp({ status: "no-autorizate" }))
//                 }
//             }
//         }
//     }
// )

export default classFormatsSlice.reducer;
