import { FC, memo, useCallback, useEffect, useRef } from 'react';
import { StudentsProps } from './students.props';
import { StudentsView } from './students.view';
import { useDeanWorkshop } from '../workshop/workshop.props';
import { useUser } from '../../../../../hooks/user-hook';
import { useAppDispatch, useTypedSelector } from '../../../../../hooks/use-typed-selector';
import { createStudentActionCreator, deleteStudentActionCreator, initDeanMembersActionCreator, recoverPasswordForStudentActionCreator, StudentInfoState, studentsSlice, SubgroupInfoState, updateStudentActionCreator } from '../../../../../store/reducers/roles/dean/students-slice';

export const Students: FC<StudentsProps> = memo(() => {
  const goToWorkshop = useDeanWorkshop();
  
  const deanStudentsState = useTypedSelector(state => state.deanStudents);
  
  const {authToken} = useUser();
  const dispatch = useAppDispatch();

  const { 
    setNewLastnameActionCreator,
    setNewNameActionCreator,
    setNewSurnameActionCreator,
    setSearchStudentsActionCreator,
    setSearchSubgroupsActionCreator,
    setSelectedStudentActionCreator,
    setSelectedSubgroupActionCreator,
    clearFormActionCreator,
    reset
  } = studentsSlice.actions;

  const clearForm = useCallback(()=>{
    dispatch(clearFormActionCreator());
  },[dispatch, clearFormActionCreator])

  const setNewLastname = useCallback((value: string)=>{
    dispatch(setNewLastnameActionCreator(value));
  },[dispatch, setNewLastnameActionCreator])
  
  const setNewName = useCallback((value: string)=>{
    dispatch(setNewNameActionCreator(value));
  },[dispatch, setNewNameActionCreator])

  const setNewSurname = useCallback((value: string)=>{
    dispatch(setNewSurnameActionCreator(value));
  },[dispatch, setNewSurnameActionCreator])

  const setSearchSubgroups = useCallback((value: string)=>{
    dispatch(setSearchSubgroupsActionCreator(value));
  },[dispatch, setSearchSubgroupsActionCreator])

  const setSearchStudents = useCallback((value: string)=>{
    dispatch(setSearchStudentsActionCreator(value));
  },[dispatch, setSearchStudentsActionCreator])

  const setSelectedSubgroup = useCallback((value: SubgroupInfoState)=>{
    dispatch(setSelectedSubgroupActionCreator(value));
  },[dispatch, setSelectedSubgroupActionCreator])

  const setSelectedStudent = useCallback((value: StudentInfoState)=>{
    dispatch(setSelectedStudentActionCreator(value));
  },[dispatch, setSelectedStudentActionCreator])


  const deleteStudent = useCallback((onSuccess?: () => void)=>{
    dispatch(deleteStudentActionCreator({
      authToken: authToken,
      id: deanStudentsState.selectedStudent.idAccount,
      onSuccess: onSuccess
    }));
  },[dispatch, authToken, deanStudentsState.selectedStudent.idAccount]);

  const recoveryPasswordForStudent = useCallback((onSuccess?: () => void)=>{
    dispatch(recoverPasswordForStudentActionCreator({
      authToken: authToken,
      id: deanStudentsState.selectedStudent.idAccount,
      onSuccess: onSuccess
    }));
  },[dispatch, authToken, deanStudentsState.selectedStudent.idAccount]);

  const isInizialized = useRef(true);

  const initStudents = useCallback(()=>{
    dispatch(initDeanMembersActionCreator({authToken: authToken}));
  },[dispatch, authToken])

  useEffect(() => {
    if (isInizialized.current) {
      isInizialized.current = false;
      initStudents();
    } else return () => {
      dispatch(reset());
    };
  }, [dispatch, reset, initStudents]);

  const onUpdate = useCallback((onSuccess?: () => void)=>{
    dispatch(updateStudentActionCreator({
      authToken: authToken,
      id: deanStudentsState.selectedStudent.idStudent,
      lastname: deanStudentsState.newLastname,
      name: deanStudentsState.newName,
      surname: deanStudentsState.newSurname,
      onSuccess: onSuccess
    }));
  },[
    dispatch,
    authToken, 
    deanStudentsState.selectedStudent.idStudent,
    deanStudentsState.newLastname,
    deanStudentsState.newName,
    deanStudentsState.newSurname
  ]);

  const onCreate = useCallback((onSuccess?: () => void)=>{
    dispatch(createStudentActionCreator({
      authToken: authToken,
      numberOfGroupId: deanStudentsState.selectedSubgroup.subgroup.idSubgroup.toString(),
      lastname: deanStudentsState.newLastname,
      name: deanStudentsState.newName,
      surname: deanStudentsState.newSurname,
      onSuccess: onSuccess
    }));
  },[
    dispatch,
    authToken, 
    deanStudentsState.selectedSubgroup.subgroup.idSubgroup,
    deanStudentsState.newLastname,
    deanStudentsState.newName,
    deanStudentsState.newSurname
  ]);

  return (
      <StudentsView 
        onCreate={onCreate}
        setNewLastname={setNewLastname}
        clearForm={clearForm}
        setNewName={setNewName}
        setNewSurname={setNewSurname}
        recoveryPasswordForStudent={recoveryPasswordForStudent}
        setSelectedStudent={setSelectedStudent}
        deleteStudent={deleteStudent}
        onUpdate={onUpdate}
        setSelectedSubgroup={setSelectedSubgroup}
        setSearchStudents={setSearchStudents}
        setSearchSubgroups={setSearchSubgroups}
        deanStudentsState={deanStudentsState}
        goToWorkshop={goToWorkshop}
        />
    );
});
