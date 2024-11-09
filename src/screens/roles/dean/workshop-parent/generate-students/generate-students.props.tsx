import { useNavigate } from 'react-router';
import { urls } from '../../../../../Root';

export type GenerateStudentsProps = {

};

export const useGenerateStudents = () => {

    const navigate = useNavigate();
    const generateStudents = () => {
        navigate(urls.deanGenerateStudents);
    };

    return generateStudents;
};
