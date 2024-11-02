import { PayloadAction, createSlice } from "@reduxjs/toolkit";

type ErrorType = string | null;

export type UniversityEditorState = {
    nameUniversity: string;
    descriptionUniversity: string;
    loading: "idle" | "loading" | "success" | "error";
    errors: Record<string, ErrorType>;
};

const initialState: UniversityEditorState = {
    nameUniversity: "",
    descriptionUniversity: '',
    loading: "idle",
    errors: {},
};

const setErrorByKey = (state: UniversityEditorState, key: string, error: ErrorType) => {
    state.errors[key] = error;
};

export const universityEditorSlice = createSlice({
    name: "admin-university-editor",
    initialState: initialState,
    reducers: {
        setError(state, action: PayloadAction<{ key: string; error: ErrorType }>) {
            setErrorByKey(state, action.payload.key, action.payload.error);
        },
        reset(state) {
            Object.assign(state, initialState);
        },
        setNameUniversityActionCreater(state, action: PayloadAction<string>){
            state.nameUniversity = action.payload;
        },
        setDescriptionUniversityActionCreater(state, action: PayloadAction<string>){
            state.descriptionUniversity = action.payload;
        },
        clearErrors(state) {
            state.errors = {};
        },
    },
    // extraReducers: (builder) => {
    //     builder
    //         .addCase(changePasswordActionCreator.fulfilled, (state) => {
    //             state.loading = 'success';
    //         })
    //         .addCase(changePasswordActionCreator.pending, (state) => {
    //             state.loading = 'loading';
    //         })
    //         .addCase(changePasswordActionCreator.rejected, (state) => {
    //             state.loading = "idle";
    //         })
    // },
});

// export const changePasswordActionCreator = createAsyncThunk('/profile/change-password',
//     async (data: { 
//             authToken: string, 
//             oldPassword: string, 
//             newPassword: string, 
//             confirmPassword: string, 
//             onSuccess?: () => void
//         }, thunkApi ) => {
//         const { authToken, oldPassword, newPassword, confirmPassword, onSuccess } = data;
//         try {
//             const responce = await userApi.changePassword(authToken, oldPassword, newPassword);
//             onSuccess?.();
//             thunkApi.dispatch(changePasswordSlice.actions.reset());
//         }
//         catch (e) {
//             if (axios.isAxiosError(e)) {
//                 // thunkApi.dispatch(changeAccountDataSlice.actions.setError(
//                 //     { key: "passwordError", error: e.response?.data.message }
//                 // ));
//             }
//         }
//     }
// )

export default universityEditorSlice.reducer;
