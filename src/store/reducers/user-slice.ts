import { PayloadAction, createSlice } from "@reduxjs/toolkit";

export type UserErrors = {
    loginError: string | null;
    parentKeyError: string | null;
    passwordError: string | null;
};

export type UserRole = "ROLE_ADMIN" | "ROLE_TEACHER" | "ROLE_STUDENT" | "ROLE_DEAN" | "ROLE_PARENT" | "UNDEFINED";

export type UserData = {
    login: string,
    role: UserRole,
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
        role: 'ROLE_ADMIN',
        name: '',
        lastname: '',
        surname: ''
    },
    authToken: ''
}


export const userSlice = createSlice({
    name: "user-slice",
    initialState: initialState,
    reducers: {
        setUserActionCreater(state, action: PayloadAction<UserData>) {
            state.user = action.payload;
        },
        setAuthTockenActionCreater(state, action: PayloadAction<string>) {
            state.authToken = action.payload;
        },
        reset(state) {
            Object.assign(state, initialState);
        }
    }
});

export default userSlice.reducer;
