import { useNavigate } from 'react-router';
import { urls } from '../../../Root';

export type LoginProps = {
    typeOfLogin: 'parent' | 'other'
};

export const useLogInUser = () => {

    const navigate = useNavigate();
    const login = () => {
        navigate(urls.logInUser);
    };

    return login;
};

export const useLogInParent = () => {

    const navigate = useNavigate();
    const login = () => {
        navigate(urls.logInParent);
    };

    return login;
};