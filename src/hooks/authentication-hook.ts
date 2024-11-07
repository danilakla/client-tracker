import { useUser } from "./user-hook";
import { useCallback, useEffect, useRef } from "react";
import { useTypedSelector } from "./use-typed-selector";
import { useLogInUser } from "../screens/auth/login/login.props";
import { userSlice } from "../store/reducers/user-slice";

export const useAuthentication = () => {
    const { getUserInfo, resetData } = useUser();
    const { status } = useTypedSelector(state => state.appStatus);

    const goToLogin = useLogInUser();

    const hasFetched = useRef(false);

    const getUser = useCallback(() => {
        if (status !== "success" && !hasFetched.current){
            hasFetched.current = true;
            getUserInfo();
        }
    }, [status, getUserInfo]);

    const onRedirect = useCallback(() => {
        if (status === "no-autorizate") {
            resetData()
            goToLogin();
        }
    }, [goToLogin, resetData, status])

    useEffect(() => {
        getUser()
    }, [getUser]);

    useEffect(() => {
        onRedirect();
    }, [onRedirect])

    return {
        appStatus: status
    }
}