import { FC, memo } from "react"
import { Loader } from "./screens/loader";
import { useAuthentication } from "./hooks/authentication-hook";
import { Outlet } from "react-router-dom";

export type PrivateRouteProps = {

}

export const PrivateRoute: FC<PrivateRouteProps> = memo(() => {
    const { appStatus } = useAuthentication();

    return (
        appStatus !== "success" ? <Loader/> : <Outlet />
    )
})