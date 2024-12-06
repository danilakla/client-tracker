import { useNavigate } from 'react-router';
import { urls } from '../../../../../Root';

export type ClassGroupSubgroupsProps = {

};

export const useTeacherClassGroupSubgroups = () => {

    const navigate = useNavigate();
    const classGroups = () => {
        navigate(urls.teacherClassGroupSubgroups);
    };

    return classGroups;
};
