import { useCallback } from "react";
import { appStatusSlice, getUserInfoActionCreator } from "../store/reducers/app-status-slice";
import { useAppDispatch, useTypedSelector } from "./use-typed-selector";
import { useLogInUser } from "../screens/auth/login/login.props";
import { userSlice } from "../store/reducers/user-slice";

export const useUser = () => {
    const dispatch = useAppDispatch();

    const userState = useTypedSelector(state => state.user);

    const authToken = localStorage.getItem("authToken");
    const goToLogInUser = useLogInUser();

    const redirectToLogin = useCallback(() => {
        dispatch(appStatusSlice.actions.clearStatus());
        localStorage.removeItem("authToken");
        goToLogInUser();
    }, [dispatch, goToLogInUser])

    const resetData = useCallback(() => {
        dispatch(userSlice.actions.reset());
        localStorage.removeItem("authToken");
    }, [dispatch])

    const getUserInfo = useCallback(() => {
        if (authToken === null) {
            redirectToLogin();
        }
        else {
            dispatch(getUserInfoActionCreator({ authToken: authToken }));
        }
    }, [authToken, dispatch, redirectToLogin]);

    return {
        user: userState.user,
        getUserInfo: getUserInfo,
        resetData: resetData,
        authToken: userState.authToken,
        redirectToLogin: redirectToLogin,
    }
}