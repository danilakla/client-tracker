import { useNavigate } from 'react-router';
import { urls } from '../../../../../Root';

export type ChangeAccoundDataProps = {
    
};

export const useChangeAccoundData = () => {

    const navigate = useNavigate();
    const changeAccoundData = () => {
        navigate(urls.profileUpdateAccountData);
    };

    return changeAccoundData;
};
