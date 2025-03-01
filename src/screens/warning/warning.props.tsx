import { useNavigate } from 'react-router';
import { urls } from '../../Root';

export type WarningProps = {

};

export const useWarning = () => {

    const navigate = useNavigate();
    const warning = () => {
        navigate(urls.error);
    };

    return warning;
};
