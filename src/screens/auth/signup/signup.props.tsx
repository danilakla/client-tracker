import { useNavigate } from 'react-router';
import { urls } from '../../../Root';

export type SignupProps = {
    typeOfSignup: 'admin' | 'user';
};

export const useSignUpUser = () => {
    const navigate = useNavigate();

    const goToSignUpUser = () => {
        navigate(urls.signUpUser);
    };

    return goToSignUpUser;
};

export const useSignUpAdmin = () => {
    const navigate = useNavigate();

    const goToSignUpAdmin = () => {
        navigate(urls.signUpAdmin);
    };

    return goToSignUpAdmin;
};