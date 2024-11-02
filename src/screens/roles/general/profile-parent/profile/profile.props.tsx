import { useNavigate } from 'react-router';
import { urls } from '../../../../../Root';

export type ProfileProps = {

};

export const useProfile = () => {

    const navigate = useNavigate();
    const profile = () => {
        navigate(urls.profile);
    };

    return profile;
};
