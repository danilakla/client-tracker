import { FC, memo, useCallback, useEffect, useRef } from 'react';
import { StudentClassGroupTableProps } from './student-class-group-table.props';
import { StudentClassGroupTableView } from './student-class-group-table.view';
import { useAppDispatch, useTypedSelector } from '../../../../hooks/use-typed-selector';
import { useUser } from '../../../../hooks/user-hook';
import { useStudentClassGroups } from '../student-class-groups/student-class-groups.props';
import { useStudentSubjects } from '../student-subjects/student-subjects.props';
import { GradeInfo, initStudntTableStatisticsActionCreator, studentClassGroupTableSlice } from '../../../../store/reducers/roles/student-and-parent/student-class-group-table';

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
    reset,
    setSelectedGradeActionCreator
  } = studentClassGroupTableSlice.actions;

  const initTableData = useCallback(()=>{
    dispatch(initStudntTableStatisticsActionCreator({
      authToken: authToken, 
      idHold: studentClassGroupTableState.classGroup?.idHold || -1, 
      idSubgroup: studentClassGroupTableState.classGroup?.idSubgroup || -1,
      role: role
    }));
  },[
    studentClassGroupTableState.classGroup,
    dispatch,
    role,
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

  const setSelectedGrade = useCallback((gradeInfo: GradeInfo, onSuccess: () => void)=>{
    dispatch(setSelectedGradeActionCreator({gradeInfo, onSuccess}));
  },[dispatch,setSelectedGradeActionCreator])

  return (
      <StudentClassGroupTableView 
        setSelectedGrade={setSelectedGrade}
        goToClassGroups={goToClassGroups}
        studentClassGroupTableState={studentClassGroupTableState}
        role={role}
        />
    );
});


