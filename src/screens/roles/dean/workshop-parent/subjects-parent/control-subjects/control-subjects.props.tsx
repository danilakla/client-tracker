import { useNavigate } from 'react-router';
import { urls } from '../../../../../../Root';

export type ControlSubjectsProps = {

};

export const useControlSubjects = () => {

    const navigate = useNavigate();
    const controlSubjects = () => {
        navigate(urls.deanSubjects);
    };

    return controlSubjects;
};
