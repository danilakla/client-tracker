import { useUser } from "./user-hook";
import { useCallback, useEffect, useRef } from "react";
import { useTypedSelector } from "./use-typed-selector";
import { useLogin } from "../screens/auth/login/login.props";

export const useAuthentication = () => {
    const { getUserInfo } = useUser();
    const { status } = useTypedSelector(state => state.appStatus);

    const goToLogin = useLogin();

    const hasFetched = useRef(false);

    const getUser = useCallback(() => {
        if (status !== "success" && !hasFetched.current){
            hasFetched.current = true;
            getUserInfo();
        }
    }, [status, getUserInfo]);

    const onRedirect = useCallback(() => {
        if (status === "no-autorizate") {
            localStorage.removeItem("authToken");
            goToLogin();
        }
    }, [goToLogin, status])

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