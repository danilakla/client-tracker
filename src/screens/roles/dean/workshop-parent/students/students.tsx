import { FC, memo, useCallback, useEffect, useRef } from 'react';
import { StudentsProps } from './students.props';
import { StudentsView } from './students.view';
import { useDeanWorkshop } from '../workshop/workshop.props';
import { useUser } from '../../../../../hooks/user-hook';
import { useAppDispatch, useTypedSelector } from '../../../../../hooks/use-typed-selector';
import { initDeanMembersActionCreator, StudentInfoState, studentsSlice, SubgroupInfoState } from '../../../../../store/reducers/roles/dean/students-slice';

export const Students: FC<StudentsProps> = memo(() => {
  const goToWorkshop = useDeanWorkshop();
  
  const deanStudentsState = useTypedSelector(state => state.deanStudents);
  
  const {authToken} = useUser();
  const dispatch = useAppDispatch();

  const { 
    setNewLastnameActionCreator,
    setNewNameActionCreator,
    setNewPasswordActionCreator,
    setNewSurnameActionCreator,
    setSearchStudentsActionCreator,
    setSearchSubgroupsActionCreator,
    setSelectedStudentActionCreator,
    setSelectedSubgroupActionCreator,
    setSelectedSubgroupFromSelectActionCreator,
    reset
  } = studentsSlice.actions;

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

  return (
      <StudentsView 
        setNewLastname={setNewLastname}
        setNewName={setNewName}
        setNewSurname={setNewSurname}
        setSelectedStudent={setSelectedStudent}
        setSelectedSubgroup={setSelectedSubgroup}
        setSearchStudents={setSearchStudents}
        setSearchSubgroups={setSearchSubgroups}
        deanStudentsState={deanStudentsState}
        goToWorkshop={goToWorkshop}
        />
    );
});
