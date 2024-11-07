import { useNavigate } from 'react-router';
import { urls } from '../../../../../Root';

export type SpecialtiesProps = {

};

export const useSpecialties = () => {

    const navigate = useNavigate();
    const specialties = () => {
        navigate(urls.deanSpecialities);
    };

    return specialties;
};
