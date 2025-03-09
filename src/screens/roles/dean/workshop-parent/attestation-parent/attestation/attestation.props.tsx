import { useNavigate } from 'react-router';
import { urls } from '../../../../../../Root';
import { useAppDispatch } from '../../../../../../hooks/use-typed-selector';
import { attestationStudentsSlice } from '../../../../../../store/reducers/roles/dean/attestation-students-slice';

export type AttestationProps = {

};

export const useAttestation = () => {

    const dispatch = useAppDispatch();

    const navigate = useNavigate();
    const attestation = () => {
        dispatch(attestationStudentsSlice.actions.reset());
        navigate(urls.deanAttestation);
    };

    return attestation;
};
