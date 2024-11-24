import { useNavigate } from 'react-router';
import { urls } from '../../../../../../Root';

export type ClassGroupsProps = {

};

export const useClassGroups = () => {

    const navigate = useNavigate();
    const classGroups = () => {
        navigate(urls.deanClassGroups);
    };

    return classGroups;
};
