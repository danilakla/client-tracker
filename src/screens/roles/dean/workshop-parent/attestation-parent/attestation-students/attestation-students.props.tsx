import { useNavigate } from 'react-router';
import { urls } from '../../../../../../Root';
import { useAppDispatch } from '../../../../../../hooks/use-typed-selector';
import { attestationStudentsSlice } from '../../../../../../store/reducers/roles/dean/attestation-students-slice';

export type AttestationStudentsProps = {

};

export const useAttestationStudents = () => {

    const dispatch = useAppDispatch();

    const navigate = useNavigate();
    const attestationStudents = () => {
        dispatch(attestationStudentsSlice.actions.resetWithSuccess(() => navigate(urls.deanAttestationStudents)));

    };

    return attestationStudents;
};
