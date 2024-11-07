import { useNavigate } from 'react-router';
import { urls } from '../../../../../Root';

export type WorkshopProps = {

};

export const useDeanWorkshop= () => {

    const navigate = useNavigate();
    const deanWorkshop = () => {
        navigate(urls.deanWorkshop);
    };

    return deanWorkshop;
};
