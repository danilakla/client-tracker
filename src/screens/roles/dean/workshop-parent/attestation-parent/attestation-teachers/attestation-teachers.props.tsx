import { useNavigate } from 'react-router';
import { urls } from '../../../../../../Root';

export type AttestationTeachersProps = {

};

export const useAttestationTeachers = () => {

    const navigate = useNavigate();
    const attestationTeachers = () => {
        navigate(urls.deanAttestationTeachers);
    };

    return attestationTeachers;
};
