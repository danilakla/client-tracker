import { useNavigate } from 'react-router';
import { urls } from '../../../Root';

export type ExampleProps = {

};

export const useLogInUser = () => {

    const navigate = useNavigate();
    const login = () => {
        navigate(urls.logInUser);
    };

    return login;
};
