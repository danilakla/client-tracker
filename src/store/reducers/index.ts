import { combineReducers } from "redux";
import loginReducer from "./auth/login-slice";
import singupReducer from "./auth/singup-slice";
import useReducer from "./user-slice"
import appStatusReducer from "./app-status-slice"

export const rootReducers = combineReducers({
      singup: singupReducer,
      login: loginReducer,
      user: useReducer,
      appStatus: appStatusReducer
});

export type RootState = ReturnType<typeof rootReducers>;