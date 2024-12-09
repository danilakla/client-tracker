import { FC, memo, useCallback, useEffect, useRef, useState } from 'react';
import { StudentSubjectsProps } from './student-subjects.props';
import { StudentSubjectsView } from './student-subjects.view';
import { ClassGroupInfo, initStudentSubjectsActionCreator, studentSubjectsSlice, SubjectInfo } from '../../../../store/reducers/roles/student-and-parent/student-subjects-slice';
import { useAppDispatch, useTypedSelector } from '../../../../hooks/use-typed-selector';
import { useUser } from '../../../../hooks/user-hook';
import { studentClassGroupsSlice } from '../../../../store/reducers/roles/student-and-parent/student-class-groups-slice';
import { useStudentClassGroups } from '../student-class-groups/student-class-groups.props';

export const StudentSubjects: FC<StudentSubjectsProps> = memo(({
  role
}) => {
  const dispatch = useAppDispatch();
  const {authToken} = useUser();
  const studentSubjectsState = useTypedSelector(state => state.studentSubjects);

  const isInizialized = useRef(true);

  const { 
    reset,
    setSearchTextActionCreator
  } = studentSubjectsSlice.actions;

  const initData = useCallback(()=>{
    dispatch(initStudentSubjectsActionCreator({authToken, role}));
  },[dispatch, authToken, role])

  useEffect(() => {
    if (isInizialized.current) {
      isInizialized.current = false;
      initData();
    } else return () => {
      dispatch(reset());
    };
  }, [dispatch, reset, initData]);

  const setSearchText = useCallback((value: string) => {
    dispatch(setSearchTextActionCreator(value));
  }, [dispatch, setSearchTextActionCreator]);

  const [filteredSubjects, setFilteredSubjects] = useState<SubjectInfo[]>([]);

  useEffect(() => {
    const trimmedSearchText = studentSubjectsState.searchText.trim().toLowerCase();
  
    const newFilteredSubjects = studentSubjectsState.subjects
      .filter(subject => !trimmedSearchText || subject.subjectName.toLowerCase().includes(trimmedSearchText));
  
      setFilteredSubjects(newFilteredSubjects);
  }, [studentSubjectsState.subjects, studentSubjectsState.searchText]);

  const { 
    setClassGroupsActionCreator
  } = studentClassGroupsSlice.actions;

  const goToStudentClassGroups = useStudentClassGroups();

  const goToClassGroups = useCallback((value: ClassGroupInfo[], subjectName: string) => {
    dispatch(setClassGroupsActionCreator({
      classGroups: value,
      onSuccess: goToStudentClassGroups,
      subjectName: subjectName
    }));
  }, [dispatch, setClassGroupsActionCreator, goToStudentClassGroups]);

  return (
      <StudentSubjectsView 
        setSearchText={setSearchText}
        studentSubjectsState={studentSubjectsState}
        filteredSubjects={filteredSubjects}
        role={role}
        goToClassGroups={goToClassGroups}
        />
    );
});
