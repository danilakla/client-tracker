import { useNavigate } from 'react-router';
import { urls } from '../../../../../Root';

export type GeneratorKeysProps = {

};

export const useGeneratorKeys = () => {

    const navigate = useNavigate();
    const generatorKeys = () => {
        navigate(urls.adminGeneratorKeys);
    };

    return generatorKeys;
};
