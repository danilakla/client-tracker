import { useUser } from "./user-hook";
import { useCallback, useEffect, useRef } from "react";
import { useTypedSelector } from "./use-typed-selector";

export const useAuthentication = () => {
    const { getUserInfo, redirectToLogin } = useUser();
    const { status } = useTypedSelector(state => state.appStatus);

    const hasFetched = useRef(false);

    const getUser = useCallback(() => {
        if (status !== "success" && !hasFetched.current){
            hasFetched.current = true;
            getUserInfo();
        }
    }, [status, getUserInfo]);

    const onRedirect = useCallback(() => {
        if (status === "no-autorizate") {
            redirectToLogin();
        }
    }, [redirectToLogin, status])

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