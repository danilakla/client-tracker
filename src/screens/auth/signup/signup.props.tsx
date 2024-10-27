import { useNavigate } from 'react-router';

export type SignupProps = {
    typeOfSignup: 'admin' | 'user';
};

export const useSignUpUser = () => {
    const navigate = useNavigate();

    const goToSignUpUser = () => {
        navigate('/sign-up-user');
    };

    return goToSignUpUser;
};

export const useSignUpAdmin = () => {
    const navigate = useNavigate();

    const goToSignUpAdmin = () => {
        navigate('/sign-up-admin');
    };

    return goToSignUpAdmin;
};