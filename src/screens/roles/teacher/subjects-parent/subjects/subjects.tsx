import { FC, memo, useCallback, useEffect, useRef, useState } from 'react';
import { SubjectsProps } from './subjects.props';
import { SubjectsView } from './subjects.view';
import { useAppDispatch, useTypedSelector } from '../../../../../hooks/use-typed-selector';
import { useUser } from '../../../../../hooks/user-hook';
import { ClassGroupInfo, initTeacherSubjectsActionCreator, SubjectInfo, subjectsSlice } from '../../../../../store/reducers/roles/teacher/subjects-slice';
import { classGroupsSlice } from '../../../../../store/reducers/roles/teacher/class-groups-slice';
import { useTeacherClassGroups } from '../class-groups/class-groups.props';
import { classGroupSubroupsSlice } from '../../../../../store/reducers/roles/teacher/class-group-subroups-slice';

export const Subjects: FC<SubjectsProps> = memo(() => {
  const teacherSubjectsState = useTypedSelector(state => state.teacherSubjects);
  const dispatch = useAppDispatch();

  const goToTeacherClassGroups = useTeacherClassGroups();
  
  const {authToken} = useUser();

  const { 
    setSearchTextActionCreator,
    reset,
    resetStatus
  } = subjectsSlice.actions;

  const [filteredSubjects, setFilteredSubjects] = useState<SubjectInfo[]>([]);

  useEffect(() => {
    const trimmedSearchText = teacherSubjectsState.searchText.trim().toLowerCase();
  
    const newFilteredSubjects = teacherSubjectsState.subjects
      .filter(subject => !trimmedSearchText || subject.subjectName.toLowerCase().includes(trimmedSearchText));
  
      setFilteredSubjects(newFilteredSubjects);
  }, [teacherSubjectsState.subjects, teacherSubjectsState.searchText]);

  const setSearchText = useCallback((value: string) => {
    dispatch(setSearchTextActionCreator(value));
  }, [dispatch, setSearchTextActionCreator]);

  const isInizialized = useRef(true);

  const initSubjects = useCallback(()=>{
    dispatch(initTeacherSubjectsActionCreator({authToken: authToken}));
  },[dispatch, authToken])

  useEffect(() => {
    if (isInizialized.current) {
      isInizialized.current = false;
      initSubjects();
    } else return () => {
      dispatch(reset());
    };
  }, [dispatch, reset, initSubjects]);

  useEffect(() => {
    dispatch(classGroupsSlice.actions.reset());
    dispatch(classGroupSubroupsSlice.actions.reset());
  },[dispatch])

  const { 
    setClassGroupsActionCreator
  } = classGroupsSlice.actions;

  const goToClassGroups = useCallback((value: ClassGroupInfo[], nameSubject: string) => {
    dispatch(setClassGroupsActionCreator({
      classGroups: value,
      onSuccess: goToTeacherClassGroups,
      subjectName: nameSubject
    }));
  }, [dispatch, setClassGroupsActionCreator, goToTeacherClassGroups]);

  return (
      <SubjectsView 
        filteredSubjects={filteredSubjects}
        goToClassGroups={goToClassGroups}
        teacherSubjectsState={teacherSubjectsState}
        setSearchText={setSearchText}
        />
    );
});
