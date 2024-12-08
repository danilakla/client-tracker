import { FC, memo, useCallback, useEffect, useState } from 'react';
import { ClassGroupsProps } from './class-groups.props';
import { ClassGroupsView } from './class-groups.view';
import { useAppDispatch, useTypedSelector } from '../../../../../hooks/use-typed-selector';
import { classGroupsSlice } from '../../../../../store/reducers/roles/teacher/class-groups-slice';
import { ClassGroupInfo } from '../../../../../store/reducers/roles/teacher/subjects-slice';
import { useTeacherSubjects } from '../subjects/subjects.props';
import { classGroupSubroupsSlice } from '../../../../../store/reducers/roles/teacher/class-group-subroups-slice';
import { useTeacherClassGroupSubgroups } from '../class-group-subgroups/class-group-subgroups.props';

export const ClassGroups: FC<ClassGroupsProps> = memo(() => {
  const teacherClassGroupsState = useTypedSelector(state => state.teacherClassGroups);
  const dispatch = useAppDispatch();

  const goToSubjects = useTeacherSubjects();
  const goToTeacherClassGroupSubgroups = useTeacherClassGroupSubgroups();
  
  const { 
    setSearchTextActionCreator
  } = classGroupsSlice.actions;

  const { 
    setIdClassGroupActionCreator,
  } = classGroupSubroupsSlice.actions;
  

  const [filteredClassGroups, setFilteredClassGroups] = useState<ClassGroupInfo[]>([]);

  useEffect(() => {
    const trimmedSearchText = teacherClassGroupsState.searchText.trim().toLowerCase();
  
    const newFilteredClassGroups = teacherClassGroupsState.classGroups
      .filter(classGroup => !trimmedSearchText || classGroup.description.toLowerCase().includes(trimmedSearchText));
  
      setFilteredClassGroups(newFilteredClassGroups);
  }, [teacherClassGroupsState.classGroups, teacherClassGroupsState.searchText]);

  const setSearchText = useCallback((value: string) => {
    dispatch(setSearchTextActionCreator(value));
  }, [dispatch, setSearchTextActionCreator]);

  useEffect(() => {
    if(teacherClassGroupsState.subjectName === null){
      goToSubjects();
    }
  },[teacherClassGroupsState.subjectName, goToSubjects])

  const goToClassGroupSubgroups = useCallback((value: number) => {
    dispatch(setIdClassGroupActionCreator({
      idClassGroup: value,
      onSuccess: goToTeacherClassGroupSubgroups,
    }));
  }, [dispatch, setIdClassGroupActionCreator, goToTeacherClassGroupSubgroups]);

  return (
      <ClassGroupsView 
        filteredClassGroups={filteredClassGroups}
        teacherClassGroupsState={teacherClassGroupsState}
        setSearchText={setSearchText}
        goToSubjects={goToSubjects}
        goToClassGroupSubgroups={goToClassGroupSubgroups}
        />
    );
});
