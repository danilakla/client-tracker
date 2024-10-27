import { useCallback } from "react";
import { appStatusSlice, getUserInfoActionCreator } from "../store/reducers/app-status-slice";
import { useAppDispatch, useTypedSelector } from "./use-typed-selector";
import { useLogin } from "../screens/auth/login/login.props";

export const useUser = () => {
    const dispatch = useAppDispatch();

    const userState = useTypedSelector(state => state.user);

    const authToken = localStorage.getItem("authToken");
    const goToLogin = useLogin();

    const redirectToLogin = useCallback(() => {
        dispatch(appStatusSlice.actions.clearStatus());
        localStorage.removeItem("authToken");
        goToLogin();
    }, [dispatch, goToLogin])

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
        authToken: userState.authToken,
        redirectToLogin: redirectToLogin,
    }
}