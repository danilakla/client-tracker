import { useNavigate } from 'react-router';
import { urls } from '../../../../../../Root';

export type AttestationStartProps = {

};

export const useAttestationStart = () => {

    const navigate = useNavigate();
    const attestationStart = () => {
        navigate(urls.deanAttestationStart);
    };

    return attestationStart;
};
