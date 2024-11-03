import { useNavigate } from 'react-router';
import { urls } from '../../../../../Root';

export type MembersProps = {

};

export const useMembers = () => {

    const navigate = useNavigate();
    const members = () => {
        navigate(urls.adminMembers);
    };

    return members;
};