import { useNavigate } from 'react-router';

export type LoginProps = {

};

export const useLogin = () => {

    const navigate = useNavigate();
    const login = () => {
        navigate('/log-in');
    };

    return login;
};