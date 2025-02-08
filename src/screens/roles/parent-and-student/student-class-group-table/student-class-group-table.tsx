import { FC, memo, useCallback, useEffect, useRef } from 'react';
import { StudentClassGroupTableProps } from './student-class-group-table.props';
import { StudentClassGroupTableView } from './student-class-group-table.view';
import { useAppDispatch, useTypedSelector } from '../../../../hooks/use-typed-selector';
import { useUser } from '../../../../hooks/user-hook';
import { useStudentClassGroups } from '../student-class-groups/student-class-groups.props';
import { useStudentSubjects } from '../student-subjects/student-subjects.props';
import { askReviewActionCreator, checkQrCodeActionCreator, getKeyForQrActionCreator, GradeInfo, ClassHeaderType, initStudntTableStatisticsActionCreator, reloadStudntTableStatisticsActionCreator, studentClassGroupTableSlice } from '../../../../store/reducers/roles/student-and-parent/student-class-group-table';

export const StudentClassGroupTable: FC<StudentClassGroupTableProps> = memo(({
  role
}) => {
  const studentClassGroupTableState = useTypedSelector(state => state.studentClassGroupTable);
  const dispatch = useAppDispatch();
  const {authToken, userAccountId} = useUser();

  const goToClassGroups = useStudentClassGroups();
  const goToSubjects= useStudentSubjects();

  const isInizialized = useRef(true);

  const { 
    reset,
    setSelectedGradeActionCreator,
    setSelectedClassActionCreator,
    clearRedisKeyActionCreator
  } = studentClassGroupTableSlice.actions;

  const initTableData = useCallback(()=>{
    dispatch(initStudntTableStatisticsActionCreator({
      authToken: authToken, 
      idHold: studentClassGroupTableState.classGroup?.idHold || -1, 
      idSubgroup: studentClassGroupTableState.classGroup?.idSubgroup || -1,
      role: role,
      accountId: userAccountId
    }));
  },[
    studentClassGroupTableState.classGroup,
    dispatch,
    role,
    authToken,
    userAccountId
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

  // qr-code-logic

  const setSelectedClass = useCallback((value: ClassHeaderType, onSuccess: () => void)=>{
    dispatch(setSelectedClassActionCreator({value, onSuccess}));
  },[dispatch,setSelectedClassActionCreator])

  const getKeyForQr = useCallback((onError: () => void)=>{
    dispatch(getKeyForQrActionCreator(
      {
        authToken: authToken,
        id: studentClassGroupTableState.selectedClass.idClass,
        onError: onError
      }
    ));
  },[dispatch, authToken, studentClassGroupTableState.selectedClass])

  const clearRedisKey = useCallback(()=>{
    dispatch(clearRedisKeyActionCreator());
  },[dispatch,clearRedisKeyActionCreator])

  const askReview = useCallback((onSuccess: () => void, onError: () => void, closePrewPopup: () => void ) => {
    dispatch(askReviewActionCreator({
      authToken: authToken,
      selectedClass: studentClassGroupTableState.selectedClass,
      onSuccess: onSuccess,
      onError: onError,
      closePrewPopup: closePrewPopup
    }));
  }, [
    dispatch, 
    authToken, 
    studentClassGroupTableState.selectedClass
  ]);

  const checkQrCode = useCallback((value: string, onSuccess: () => void, onError: () => void)=>{
    dispatch(
      checkQrCodeActionCreator({
        authToken: authToken,
        onSuccess: onSuccess,
        onError: onError,
        keyRedux: studentClassGroupTableState.redisKeyData?.classId || -1,
        value: value
      })
    );
  },[dispatch, authToken, studentClassGroupTableState.redisKeyData?.classId])

  const reloadTable = useCallback(()=>{
    dispatch(reloadStudntTableStatisticsActionCreator({
      authToken: authToken, 
      idHold: studentClassGroupTableState.classGroup?.idHold || -1, 
      idSubgroup: studentClassGroupTableState.classGroup?.idSubgroup || -1,
      role: role,
      accountId: userAccountId
    }));
  },[
    studentClassGroupTableState.classGroup,
    dispatch,
    role,
    authToken,
    userAccountId
  ])

  return (
      <StudentClassGroupTableView 
        askReview={askReview}
        setSelectedGrade={setSelectedGrade}
        checkQrCode={checkQrCode}
        goToClassGroups={goToClassGroups}
        setSelectedClass={setSelectedClass}
        reloadTable={reloadTable}
        getKeyForQr={getKeyForQr}
        studentClassGroupTableState={studentClassGroupTableState}
        role={role}
        clearRedisKey={clearRedisKey}
        />
    );
});


