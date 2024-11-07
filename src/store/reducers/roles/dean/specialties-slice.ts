import { PayloadAction, createSlice } from "@reduxjs/toolkit";

type ErrorType = string | null;

export type SpecialtyInfo = {
    idSpecialty: number,
    name: string,
    idDean: number
}

export type SpecialtiesState = {
    searchText: string;
    specialties: SpecialtyInfo[],
    selectedSpeciality: SpecialtyInfo;
    loading: "idle" | "loading" | "success" | "error";
    errors: Record<string, ErrorType>;
};

const initialState: SpecialtiesState = {
    specialties: [],
    selectedSpeciality: {
        idSpecialty: -1,
        name: '',
        idDean: -1
    },
    searchText: '',
    loading: "idle",
    errors: {},
};

const setErrorByKey = (state: SpecialtiesState, key: string, error: ErrorType) => {
    state.errors[key] = error;
};

export const specialtiesSlice = createSlice({
    name: "dean-specialties",
    initialState: initialState,
    reducers: {
        setError(state, action: PayloadAction<{ key: string; error: ErrorType }>) {
            setErrorByKey(state, action.payload.key, action.payload.error);
        },
        setSearchText(state, action: PayloadAction<string>) {
            state.searchText = action.payload;
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

export default specialtiesSlice.reducer;
