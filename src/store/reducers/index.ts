import { combineReducers } from "redux";
import loginReducer from "./auth/login-slice";
import singupReducer from "./auth/singup-slice";
import userReducer from "./user-slice"
import appStatusReducer from "./app-status-slice"

export const rootReducers = combineReducers({
      singup: singupReducer,
      login: loginReducer,
      user: userReducer,
      appStatus: appStatusReducer
});

export type RootState = ReturnType<typeof rootReducers>;