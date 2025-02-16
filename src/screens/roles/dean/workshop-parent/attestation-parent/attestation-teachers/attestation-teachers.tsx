import { FC, memo, useCallback, useEffect, useRef } from 'react';
import { AttestationTeachersProps } from './attestation-teachers.props';
import { AttestationTeachersView } from './attestation-teachers.view';
import { useAttestation } from '../attestation/attestation.props';
import { attestationTeachersSlice, initTeachersForDeanActionCreator } from '../../../../../../store/reducers/roles/dean/attestation-teachers-slice';
import { useAppDispatch, useTypedSelector } from '../../../../../../hooks/use-typed-selector';
import { useUser } from '../../../../../../hooks/user-hook';

export const AttestationTeachers: FC<AttestationTeachersProps> = memo(() => {
  
  const goToAttestation = useAttestation();
  
  const deanAttestationTeachersState = useTypedSelector(state => state.deanAttestationTeachers);
  
  const {authToken} = useUser();
  const dispatch = useAppDispatch();

  const { 
    reset
  } = attestationTeachersSlice.actions;

  const isInizialized = useRef(true);

  const initData = useCallback(()=>{
    dispatch(initTeachersForDeanActionCreator({authToken: authToken}));
  },[dispatch, authToken])

  useEffect(() => {
    if (isInizialized.current) {
       isInizialized.current = false;
       initData();
     } else return () => {
       dispatch(reset());
     };
  },[dispatch, reset, initData]);


  return (
      <AttestationTeachersView 
        deanAttestationTeachersState={deanAttestationTeachersState}
        goToAttestation={goToAttestation}
        />
    );
});
