import { useNavigate } from 'react-router';
import { urls } from '../../../../../../Root';

export type ClassGroupsDetailsProps = {
    type: 'add' | 'edit'
};

export const useClassGroupAdd = () => {

    const navigate = useNavigate();
    const classGroupsDetails = () => {
        navigate(urls.deanClassGroupAdd);
    };

    return classGroupsDetails;
};

export const useClassGroupEdit = () => {

    const navigate = useNavigate();
    const classGroupsDetails = () => {
        navigate(urls.deanClassGroupEdit);
    };

    return classGroupsDetails;
};
