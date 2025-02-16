import { useNavigate } from 'react-router';
import { urls } from '../../../../../../Root';

export type AttestationStudentsProps = {

};

export const useAttestationStudents = () => {

    const navigate = useNavigate();
    const attestationStudents = () => {
        navigate(urls.deanAttestationStudents);
    };

    return attestationStudents;
};
