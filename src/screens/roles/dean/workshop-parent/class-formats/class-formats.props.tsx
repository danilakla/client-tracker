import { useNavigate } from 'react-router';
import { urls } from '../../../../../Root';

export type ClassFormatsProps = {

};

export const useClassFormats = () => {

    const navigate = useNavigate();
    const classFormats = () => {
        navigate(urls.deanClassFormats);
    };

    return classFormats;
};
