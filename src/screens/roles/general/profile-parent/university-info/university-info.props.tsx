import { useNavigate } from 'react-router';
import { urls } from '../../../../../Root';

export type UniversityInfoProps = {
    
};

export const useUniversityInfo = () => {

    const navigate = useNavigate();
    const universityInfo = () => {
        navigate(urls.profileUniversityInfo);
    };

    return universityInfo;
};
