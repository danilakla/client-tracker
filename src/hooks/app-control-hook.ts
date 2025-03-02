import { useUser } from "./user-hook";
import { useCallback, useEffect, useRef } from "react";
import { useTypedSelector } from "./use-typed-selector";
import { urls } from "../Root";
import { useNavigate } from "react-router-dom";
import { useWarning } from "../screens/warning/warning.props";

export const useAppControlHook = () => {
    const { status } = useTypedSelector(state => state.appStatus);

    const goToWarning = useWarning();


    return {
        goToErrorScreen: ()=>{}
    }
}