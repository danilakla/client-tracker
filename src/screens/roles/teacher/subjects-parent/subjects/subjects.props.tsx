import { useNavigate } from 'react-router';
import { urls } from '../../../../../Root';

export type SubjectsProps = {

};

export const useTeacherSubjects = () => {

    const navigate = useNavigate();
    const subjects = () => {
        navigate(urls.teacherSubjects);
    };

    return subjects;
};
