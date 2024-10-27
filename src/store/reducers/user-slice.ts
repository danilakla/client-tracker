import { PayloadAction, createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { appStatusSlice } from "./app-status-slice";
import axios from "axios";

export type UserErrors = {
    loginError: string | null;
    parentKeyError: string | null;
    passwordError: string | null;
};

export type UserData = {
    login: string,
    role: "ROLE_ADMIN" | "ROLE_TEACHER" | "ROLE_STUDENT" | "ROLE_DEAN" | "ROLE_PARENT",
    name: string,
    lastname: string,
    surname: string
}

export type UserState = {
    user: UserData;
    authToken: string; 
};

const initialState: UserState = {
    user: {
        login: '',
        role: 'ROLE_PARENT',
        name: '',
        lastname: '',
        surname: ''
    },
    authToken: ''
}


export const userSlice = createSlice({
    name: "user",
    initialState: initialState,
    reducers: {
        setUserActionCreater(state, action: PayloadAction<UserData>) {
            state.user = action.payload;
        },
        setAuthTockenActionCreater(state, action: PayloadAction<string>) {
            state.authToken = action.payload;
        },
        reset(state) {
            state.user = {
                login: '',
                role: 'ROLE_PARENT',
                name: '',
                lastname: '',
                surname: ''
            };
            state.authToken = '';
        }
    }
});

// export const loginActionCreater = (userName: string, password: string, onSuccess?: () => void) => {
//     return (dispatch: AppDispatch) => {
//       dispatch(loginSlice.actions.fetchLoginUserActionCreater());
//       authApi.login(userName, password)
//           .then(responce => {
//               dispatch(loginSlice.actions.fetchLoginSuccessActionCreater());
//               if(onSuccess !== undefined) onSuccess();
//           })
//           .catch((err) => {
//               dispatch(loginSlice.actions.fetchLoginErrorActionCreater("Not found"));
//           })
//     }
// }

export default userSlice.reducer;
