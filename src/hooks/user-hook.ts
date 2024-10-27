import { useCallback } from "react";
import { appStatusSlice, getUserInfoActionCreator } from "../store/reducers/app-status-slice";
import { useAppDispatch, useTypedSelector } from "./use-typed-selector";
import { useLogInUser } from "../screens/auth/login/login.props";

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