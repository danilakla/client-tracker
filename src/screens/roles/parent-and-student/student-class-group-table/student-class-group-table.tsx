import { FC, memo, useCallback, useEffect, useRef } from 'react';
import { StudentClassGroupTableProps } from './student-class-group-table.props';
import { StudentClassGroupTableView } from './student-class-group-table.view';
import { useAppDispatch, useTypedSelector } from '../../../../hooks/use-typed-selector';
import { useUser } from '../../../../hooks/user-hook';
import { useStudentClassGroups } from '../student-class-groups/student-class-groups.props';
import { useStudentSubjects } from '../student-subjects/student-subjects.props';
import { initStudntTableStatisticsActionCreator, studentClassGroupTableSlice } from '../../../../store/reducers/roles/student-and-parent/student-class-group-table';

export const StudentClassGroupTable: FC<StudentClassGroupTableProps> = memo(({
  role
}) => {
  const studentClassGroupTableState = useTypedSelector(state => state.studentClassGroupTable);
  const dispatch = useAppDispatch();
  const {authToken} = useUser();

  const goToClassGroups = useStudentClassGroups();
  const goToSubjects= useStudentSubjects();

  const isInizialized = useRef(true);

  const { 
    reset
  } = studentClassGroupTableSlice.actions;

  const initTableData = useCallback(()=>{
    dispatch(initStudntTableStatisticsActionCreator({
      authToken: authToken, 
      idClassGroupToSubgroup: studentClassGroupTableState.classGroup?.idClassGroupToSubgroup || -1, 
      idSubgroup: studentClassGroupTableState.classGroup?.idSubgroup || -1,
    }));
  },[
    studentClassGroupTableState.classGroup,
    dispatch,
    authToken
  ])

  useEffect(() => {
    if (isInizialized.current) {
      isInizialized.current = false;
      initTableData();
    } else return () => {
      dispatch(reset());
    };
  }, [dispatch, reset, initTableData]);

  useEffect(() => {
    if(studentClassGroupTableState.classGroup === null){
      goToSubjects();
    }
  }, [studentClassGroupTableState.classGroup, goToSubjects]);

  return (
      <StudentClassGroupTableView 
        goToClassGroups={goToClassGroups}
        studentClassGroupTableState={studentClassGroupTableState}
        role={role}
        />
    );
});


