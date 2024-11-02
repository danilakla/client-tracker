import { useNavigate } from 'react-router';
import { urls } from '../../../../../Root';

export type UniversityEditorProps = {

};

export const useUniversityEditor = () => {

    const navigate = useNavigate();
    const universityEditor = () => {
        navigate(urls.adminUniversityEditor);
    };

    return universityEditor;
};
