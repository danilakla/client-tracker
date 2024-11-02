import { useNavigate } from 'react-router';
import { urls } from '../../../../../Root';

export type WorkshopProps = {

};

export const useWorkshop = () => {

    const navigate = useNavigate();
    const workshop = () => {
        navigate(urls.adminWorkshop);
    };

    return workshop;
};
