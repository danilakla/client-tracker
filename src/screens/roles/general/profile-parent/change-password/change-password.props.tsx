import { useNavigate } from 'react-router';
import { urls } from '../../../../../Root';

export type ChangePasswordProps = {
    
};

export const useChangePassword = () => {

    const navigate = useNavigate();
    const changePassword = () => {
        navigate(urls.profileUpdatePassword);
    };

    return changePassword;
};
