import { FC, memo, useCallback, useEffect, useState } from 'react';
import { StudentClassGroupsProps } from './student-class-groups.props';
import { StudentClassGroupsView } from './student-class-groups.view';
import { ClassGroupInfo } from '../../../../store/reducers/roles/student-and-parent/student-subjects-slice';
import { studentClassGroupsSlice } from '../../../../store/reducers/roles/student-and-parent/student-class-groups-slice';
import { useAppDispatch, useTypedSelector } from '../../../../hooks/use-typed-selector';
import { useStudentSubjects } from '../student-subjects/student-subjects.props';
import { studentClassGroupTableSlice } from '../../../../store/reducers/roles/student-and-parent/student-class-group-table';
import { useStudentClassGroupTable } from '../student-class-group-table/student-class-group-table.props';

export const StudentClassGroups: FC<StudentClassGroupsProps> = memo(({
  role
}) => {
  const dispatch = useAppDispatch();
  const studentClassGroupsState = useTypedSelector(state => state.studentClassGroups);

  const goToStudentSubjects = useStudentSubjects();
  const goToStudentClassGroupTable = useStudentClassGroupTable();

  const { 
    setSearchTextActionCreator
  } = studentClassGroupsSlice.actions;
  
  const setSearchText = useCallback((value: string) => {
    dispatch(setSearchTextActionCreator(value));
  }, [dispatch, setSearchTextActionCreator]);

  const [filteredClassGroups, setFilteredClassGroups] = useState<ClassGroupInfo[]>([]);

  useEffect(() => {
    const trimmedSearchText = studentClassGroupsState.searchText.trim().toLowerCase();
  
    const newFilteredClassGroups = studentClassGroupsState.classGroups
      .filter(classGroup => !trimmedSearchText || classGroup.description.toLowerCase().includes(trimmedSearchText));
  
      setFilteredClassGroups(newFilteredClassGroups);
  }, [studentClassGroupsState.classGroups, studentClassGroupsState.searchText]);

  useEffect(() => {
    if(studentClassGroupsState.subjectName === null){
      goToStudentSubjects();
    }
  },[studentClassGroupsState.subjectName, goToStudentSubjects])

  const { 
    setClassGroupInfoActionCreator
  } = studentClassGroupTableSlice.actions;

  const goToTable = useCallback((classGroup: ClassGroupInfo) => {
    dispatch(setClassGroupInfoActionCreator({
      classGroupData: classGroup,
      onSuccess: goToStudentClassGroupTable
    }));
  }, [
    dispatch, 
    setClassGroupInfoActionCreator, 
    goToStudentClassGroupTable
  ]);

  return (
      <StudentClassGroupsView
        nameSubject={studentClassGroupsState.subjectName || ''} 
        role={role}
        goToTable={goToTable}
        searchText={studentClassGroupsState.searchText}
        filteredClassGroups={filteredClassGroups}
        setSearchText={setSearchText}
        goToStudentSubjects={goToStudentSubjects}
        />
    );
});
