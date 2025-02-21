import { FC, memo, useCallback, useEffect, useRef, useState } from 'react';
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

  const setSelectedStudent = useCallback((value: StudentDTO, onSuccess: () => void) => {
    dispatch(setSelectedStudentActionCreator({value, onSuccess}));
  }, [dispatch, setSelectedStudentActionCreator]);

  const setSelectedSubgroup = useCallback((value: SubgroupDTO, onSuccess: () => void) => {
    dispatch(setSelectedSubgroupActionCreator({value, onSuccess}));
  }, [dispatch, setSelectedSubgroupActionCreator]);

  const goBackToAttestation = useCallback(() => {
    goToAttestation();
    dispatch(reset());
  },[goToAttestation, dispatch, reset])

  const [filteredSubgroups, setFilteredSubgroups] = useState<SubgroupDTO[]>([]);
  
  useEffect(() => {
    const trimmedSearchText = deanAttestationStudentsState.searchSubgroup.trim().toLowerCase();
  
    const newFiltered= deanAttestationStudentsState.subgroups
      .filter(subgroup => !trimmedSearchText || subgroup.subgroup.subgroupNumber.toLowerCase().includes(trimmedSearchText));
  
      setFilteredSubgroups(newFiltered);
  }, [deanAttestationStudentsState.subgroups, deanAttestationStudentsState.searchSubgroup]);

  const [filteredStudents, setFilteredStudents] = useState<StudentDTO[]>([]);
  
  useEffect(() => {
    const trimmedSearchText = deanAttestationStudentsState.searchStudent.trim().toLowerCase();
  
    const newFiltered= deanAttestationStudentsState.selectedSubgroup.students
      .filter(student => !trimmedSearchText || student.name.toLowerCase().includes(trimmedSearchText));
  
      setFilteredStudents(newFiltered);
  }, [deanAttestationStudentsState.selectedSubgroup, deanAttestationStudentsState.searchStudent]);

  return (
      <AttestationStudentsView 
        setSearchStudent={setSearchStudent}
        setSearchSubgroup={setSearchSubgroup}
        setSelectedStudent={setSelectedStudent}
        setSelectedSubgroup={setSelectedSubgroup}
        deanAttestationStudentsState={deanAttestationStudentsState}
        goToAttestation={goBackToAttestation}
        filteredStudents={filteredStudents}
        filteredSubgroups={filteredSubgroups}
        />
    );
});
