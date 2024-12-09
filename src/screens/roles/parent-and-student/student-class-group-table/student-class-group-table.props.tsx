import { useNavigate } from 'react-router';
import { urls } from '../../../../Root';
export type StudentClassGroupTableProps = {
    role: "ROLE_STUDENT" | "ROLE_PARENTS";
};

export const useStudentClassGroupTable = () => {

    const navigate = useNavigate();
    const studentClassGroupTable = () => {
        navigate(urls.studentClassGroupTable);
    };

    return studentClassGroupTable;
};
