import { useNavigate } from 'react-router';
import { urls } from '../../../../Root';
export type StudentClassGroupsProps = {
    role: "ROLE_STUDENT" | "ROLE_PARENTS";
};

export const useStudentClassGroups = () => {

    const navigate = useNavigate();
    const studentClassGroups = () => {
        navigate(urls.studentClassGroups);
    };

    return studentClassGroups;
};
