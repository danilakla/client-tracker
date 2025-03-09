import { useNavigate } from 'react-router';
import { urls } from '../../../../../Root';

export type ClassTableProps = {

};

export const useClassTable = () => {

    const navigate = useNavigate();
    const classTable = () => {
        navigate(urls.logInUser);
    };

    return classTable;
};
