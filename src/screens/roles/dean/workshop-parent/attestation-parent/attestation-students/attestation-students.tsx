import { FC, memo, useCallback, useEffect, useRef } from 'react';
import { AttestationStudentsProps } from './attestation-students.props';
import { AttestationStudentsView } from './attestation-students.view';
import { useAttestation } from '../attestation/attestation.props';
import { attestationStudentsSlice, initStudentsForDeanActionCreator, StudentDTO, SubgroupDTO } from '../../../../../../store/reducers/roles/dean/attestation-students-slice';
import { useAppDispatch, useTypedSelector } from '../../../../../../hooks/use-typed-selector';
import { useUser } from '../../../../../../hooks/user-hook';

export const AttestationStudents: FC<AttestationStudentsProps> = memo(() => {

  const goToAttestation = useAttestation();

  const deanAttestationStudentsState = useTypedSelector(state => state.deanAttestationStudents);
    
  const {authToken} = useUser();
  const dispatch = useAppDispatch();

  const { 
    reset,
    setSearchStudentActionCreator,
    setSearchSubgroupActionCreator,
    setSelectedStudentActionCreator,
    setSelectedSubgroupActionCreator,
  } = attestationStudentsSlice.actions;

  const isInizialized = useRef(true);

  const initData = useCallback(()=>{
    dispatch(initStudentsForDeanActionCreator({authToken: authToken}));
  },[dispatch, authToken])

  useEffect(() => {
    if (isInizialized.current) {
       isInizialized.current = false;
       initData();
     } else return () => {
       dispatch(reset());
     };
  },[dispatch, reset, initData]);

  const setSearchStudent = useCallback((value: string) => {
    dispatch(setSearchStudentActionCreator(value));
  }, [dispatch, setSearchStudentActionCreator]);

  const setSearchSubgroup = useCallback((value: string) => {
    dispatch(setSearchSubgroupActionCreator(value));
  }, [dispatch, setSearchSubgroupActionCreator]);

  const setSelectedStudent = useCallback((value: StudentDTO) => {
    dispatch(setSelectedStudentActionCreator(value));
  }, [dispatch, setSelectedStudentActionCreator]);

  const setSelectedSubgroup = useCallback((value: SubgroupDTO) => {
    dispatch(setSelectedSubgroupActionCreator(value));
  }, [dispatch, setSelectedSubgroupActionCreator]);

  return (
      <AttestationStudentsView 
        setSearchStudent={setSearchStudent}
        setSearchSubgroup={setSearchSubgroup}
        setSelectedStudent={setSelectedStudent}
        setSelectedSubgroup={setSelectedSubgroup}
        deanAttestationStudentsState={deanAttestationStudentsState}
        goToAttestation={goToAttestation}
        />
    );
});
