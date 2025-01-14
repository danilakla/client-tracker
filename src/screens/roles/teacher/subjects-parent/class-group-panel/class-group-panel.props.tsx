import { useNavigate } from 'react-router';
import { urls } from '../../../../../Root';

export type ClassGroupPanelProps = {
    onPrevScreen: () => void;
};

export const useClassGroupPanel = () => {

    const navigate = useNavigate();
    const classGroupPanel = () => {
        navigate(urls.teacherClassGroupControl);
    };

    return classGroupPanel;
};
