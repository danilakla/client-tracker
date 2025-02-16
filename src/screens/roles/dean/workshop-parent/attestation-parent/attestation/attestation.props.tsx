import { useNavigate } from 'react-router';
import { urls } from '../../../../../../Root';

export type AttestationProps = {

};

export const useAttestation = () => {

    const navigate = useNavigate();
    const attestation = () => {
        navigate(urls.deanAttestation);
    };

    return attestation;
};
