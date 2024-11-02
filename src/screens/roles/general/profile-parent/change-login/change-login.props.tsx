import { useNavigate } from 'react-router';
import { urls } from '../../../../../Root';

export type ChangeLoginProps = {
    
};

export const useChangeLogin = () => {

    const navigate = useNavigate();
    const changeLogin = () => {
        navigate(urls.profileUpdateLogin);
    };

    return changeLogin;
};
