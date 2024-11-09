import { useNavigate } from 'react-router';
import { urls } from '../../../../../Root';

export type StudentsProps = {

};

export const useDeanStudents = () => {

    const navigate = useNavigate();
    const students = () => {
        navigate(urls.deanStudents);
    };

    return students;
};
