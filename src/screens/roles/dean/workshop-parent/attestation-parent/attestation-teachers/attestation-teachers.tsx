import { FC, memo, useCallback, useEffect, useRef, useState } from 'react';
import { AttestationTeachersProps } from './attestation-teachers.props';
import { AttestationTeachersView } from './attestation-teachers.view';
import { useAttestation } from '../attestation/attestation.props';
import { attestationTeachersSlice, initTeachersForDeanActionCreator, TeacherDto } from '../../../../../../store/reducers/roles/dean/attestation-teachers-slice';
import { useAppDispatch, useTypedSelector } from '../../../../../../hooks/use-typed-selector';
import { useUser } from '../../../../../../hooks/user-hook';

export const AttestationTeachers: FC<AttestationTeachersProps> = memo(() => {
  
  const goToAttestation = useAttestation();
  
  const deanAttestationTeachersState = useTypedSelector(state => state.deanAttestationTeachers);
  
  const {authToken} = useUser();
  const dispatch = useAppDispatch();

  const { 
    reset,
    setSearchTextActionCreator
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

  const [filteredTeachers, setFilteredTeachers] = useState<TeacherDto[]>([]);

  useEffect(() => {
    const trimmedSearchText = deanAttestationTeachersState.searchText.trim().toLowerCase();
  
    const newFiltered= deanAttestationTeachersState.teachers
      .filter(teacher => !trimmedSearchText || teacher.flpName.toLowerCase().includes(trimmedSearchText));
  
      setFilteredTeachers(newFiltered);
  }, [deanAttestationTeachersState.teachers, deanAttestationTeachersState.searchText]);

  const setSearchText = useCallback((value: string) => {
    dispatch(setSearchTextActionCreator(value));
  }, [dispatch, setSearchTextActionCreator]);

  return (
      <AttestationTeachersView 
        deanAttestationTeachersState={deanAttestationTeachersState}
        goToAttestation={goToAttestation}
        filteredTeachers={filteredTeachers}
        setSearchText={setSearchText}
        />
    );
});
