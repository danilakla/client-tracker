import { useNavigate } from 'react-router';
import { urls } from '../../../../Root';

export type StudentSubjectsProps = {
    role: "ROLE_STUDENT" | "ROLE_PARENTS";
};

export const useStudentSubjects = () => {

    const navigate = useNavigate();
    const studentSubjects = () => {
        navigate(urls.studentSubjects);
    };

    return studentSubjects;
};
