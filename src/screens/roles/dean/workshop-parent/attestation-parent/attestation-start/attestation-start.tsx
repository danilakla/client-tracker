import { FC, memo, useCallback, useEffect, useRef } from 'react';
import { AttestationStartProps } from './attestation-start.props';
import { AttestationStartView } from './attestation-start.view';
import { useAttestation } from '../attestation/attestation.props';
import { useAppDispatch, useTypedSelector } from '../../../../../../hooks/use-typed-selector';
import { useUser } from '../../../../../../hooks/user-hook';
import { attestationStartSlice, startAttestationActionCreator } from '../../../../../../store/reducers/roles/dean/attestation-start-slice';

export const AttestationStart: FC<AttestationStartProps> = memo(() => {
  const goToAttestation = useAttestation();

  const deanAttestationStartState = useTypedSelector(state => state.deanAttestationStart);
  
  const {authToken} = useUser();
  const dispatch = useAppDispatch();

  const { 
    setTimeOfDayActionCreator,
    reset
  } = attestationStartSlice.actions;

  const setTimeOfDay = useCallback((value: string) => {
    dispatch(setTimeOfDayActionCreator(value));
  }, [dispatch, setTimeOfDayActionCreator]);


  const isInizialized = useRef(true);
  
  useEffect(() => {
     if (isInizialized.current) {
       isInizialized.current = false;
       // initTableData();
     } else return () => {
       dispatch(reset());
     };
  }, [dispatch, reset]);

  const startAttestation = useCallback((onSuccess: () => void) => {
    dispatch(startAttestationActionCreator({
      authToken: authToken,
      time: deanAttestationStartState.timeOfDay,
      onSuccess: onSuccess
    }));
  }, [dispatch, authToken, deanAttestationStartState.timeOfDay]);

  return (
      <AttestationStartView 
        deanAttestationStartState={deanAttestationStartState}
        setTimeOfDay={setTimeOfDay}
        startAttestation={startAttestation}
        goToAttestation={goToAttestation}
        />
    );
});
