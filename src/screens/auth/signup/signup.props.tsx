import { useNavigate } from 'react-router';
import { urls } from '../../../Root';

export type SignupProps = {};

export const useSignUp = () => {
    const navigate = useNavigate();

    const goToSignUpUser = () => {
        navigate(urls.signUp);
    };

    return goToSignUpUser;
};