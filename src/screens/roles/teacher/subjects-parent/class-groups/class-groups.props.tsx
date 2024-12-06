import { useNavigate } from 'react-router';
import { urls } from '../../../../../Root';

export type ClassGroupsProps = {

};

export const useTeacherClassGroups = () => {

    const navigate = useNavigate();
    const classGroups = () => {
        navigate(urls.teacherClassGroups);
    };

    return classGroups;
};
