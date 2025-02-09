import { FC, memo, useCallback, useEffect, useRef } from 'react';
import { ClassGroupPanelProps } from './class-group-panel.props';
import { ClassGroupPanelView } from './class-group-panel.view';
import { useAppDispatch, useTypedSelector } from '../../../../../hooks/use-typed-selector';
import { activateKeyForClassActionCreator, addClassActionCreator, AttendanceCodeType, classGroupControlSlice, ClassHeaderType, createQrCodeActionCreator, deleteClassActionCreator, GradeInfo, reloadTableStatisticsActionCreator, startReviewForClassActionCreator, updateGradeActionCreator } from '../../../../../store/reducers/roles/teacher/class-group-control-slice';
import { useUser } from '../../../../../hooks/user-hook';
import { useTeacherSubjects } from '../subjects/subjects.props';

export const ClassGroupPanel: FC<ClassGroupPanelProps> = memo(({onPrevScreen}) => {
  const teacherClassGroupControlState = useTypedSelector(state => state.teacherClassGroupControl);
  const dispatch = useAppDispatch();
  const {authToken} = useUser();

  const goToSubjects = useTeacherSubjects();

  const isInizialized = useRef(true);

  const { 
    reset,
    setSelectedGradeActionCreator,
    setGradeNumberActionCreator,
    setDescriptionActionCreator,
    setAttendanceActionCreator,
    switchIsPassedActionCreator,

    setSelectedClassActionCreator,
    setExpirationOfRefreshActionCreator,
    toggleIsCompletedActionCreator,
    setExpirationOfReviewActionCreator,
    clearQrCodeDataActionCreator
  } = classGroupControlSlice.actions;

  useEffect(() => {
    if (isInizialized.current) {
      isInizialized.current = false;
      // initTableData();
    } else return () => {
      dispatch(reset());
    };
  }, [dispatch, reset]);

  useEffect(() => {
    if(teacherClassGroupControlState.initData === null){
      goToSubjects();
    }
  }, [teacherClassGroupControlState.initData, goToSubjects]);

  const createClass = useCallback((onSuccess: () => void)=>{
    dispatch(addClassActionCreator({
      authToken: authToken, 
      holdId: teacherClassGroupControlState.idHold || -1,
      studentsStatistics: teacherClassGroupControlState.studentsStatistics,
      onSuccess: onSuccess
    }));
  },[
    dispatch,
    authToken,
    teacherClassGroupControlState.idHold,
    teacherClassGroupControlState.studentsStatistics
  ])

  const deleteClass = useCallback((onSuccess: () => void) => {
    const lastNonAttestationClass = teacherClassGroupControlState.classesIds
        .slice()
        .reverse()
        .find(classItem => !classItem.isAttestation);

    if (lastNonAttestationClass) {
        dispatch(deleteClassActionCreator({
            authToken: authToken,
            idClass: lastNonAttestationClass.idClass,  
            onSuccess: onSuccess
        }));
    }
}, [dispatch, authToken, teacherClassGroupControlState.classesIds]);

  const updateGrade = useCallback((onSuccess: () => void)=>{
    dispatch(updateGradeActionCreator({
      authToken: authToken, 
      isCompleted: teacherClassGroupControlState.isCompleted,
      grade: teacherClassGroupControlState.selectedGrade,
      onSuccess: onSuccess
    }));
  },[
    dispatch,
    authToken,
    teacherClassGroupControlState.isCompleted,
    teacherClassGroupControlState.selectedGrade
  ])

  const setSelectedGrade = useCallback((gradeInfo: GradeInfo, onSuccess: () => void)=>{
    dispatch(setSelectedGradeActionCreator({gradeInfo, onSuccess}));
  },[dispatch,setSelectedGradeActionCreator])

  const setGradeNumber = useCallback((value: string)=>{
    dispatch(setGradeNumberActionCreator(value));
  },[dispatch,setGradeNumberActionCreator])

  const switchIsPassed = useCallback(()=>{
    dispatch(switchIsPassedActionCreator());
  },[dispatch,switchIsPassedActionCreator])

  const setDescription = useCallback((value: string)=>{
    dispatch(setDescriptionActionCreator(value));
  },[dispatch,setDescriptionActionCreator])

  const setAttendance = useCallback((value: AttendanceCodeType)=>{
    dispatch(setAttendanceActionCreator(value));
  },[dispatch,setAttendanceActionCreator])

  const toggleIsCompleted = useCallback(()=>{
    dispatch(toggleIsCompletedActionCreator());
  },[dispatch,toggleIsCompletedActionCreator])

  // qr-code-part

  const setSelectedClass = useCallback((value: ClassHeaderType, onSuccess: () => void)=>{
    dispatch(setSelectedClassActionCreator({value, onSuccess}));
  },[dispatch,setSelectedClassActionCreator])

  const setExpirationOfRefresh = useCallback((value: number)=>{
    dispatch(setExpirationOfRefreshActionCreator(value));
  },[dispatch,setExpirationOfRefreshActionCreator])

  const setExpirationOfReview = useCallback((value: number)=>{
    dispatch(setExpirationOfReviewActionCreator(value));
  },[dispatch,setExpirationOfReviewActionCreator])

  const activateKeyForClass = useCallback((expiration: number, onSuccess: () => void)=>{
    dispatch(activateKeyForClassActionCreator({
      authToken: authToken, 
      expiration: expiration,
      classId: teacherClassGroupControlState.selectedClass.idClass,
      onSuccess: onSuccess
    }));
  },[
    dispatch,
    authToken,
    teacherClassGroupControlState.selectedClass.idClass
  ])

  const clearQrCodeData = useCallback(()=>{
    dispatch(clearQrCodeDataActionCreator());
  },[dispatch,clearQrCodeDataActionCreator])

  const createQrCode = useCallback(()=>{
    dispatch(createQrCodeActionCreator({
      authToken: authToken,
      expirationOfReview: teacherClassGroupControlState.qrCodePopup.expirationOfReview,
      expirationOfRefresh: teacherClassGroupControlState.qrCodePopup.expirationOfRefresh,
      classId: teacherClassGroupControlState.selectedClass.idClass,
    }));
  },[
    dispatch,
    teacherClassGroupControlState.qrCodePopup.expirationOfReview,
    teacherClassGroupControlState.qrCodePopup.expirationOfRefresh,
    teacherClassGroupControlState.selectedClass.idClass,
    authToken
  ])

  const onReview = useCallback((onSuccess: () => void)=>{
    dispatch(startReviewForClassActionCreator({
      authToken: authToken,
      onSuccess: onSuccess,
      classId: teacherClassGroupControlState.selectedClass.idClass
    }));
  },[dispatch, authToken, teacherClassGroupControlState.selectedClass.idClass])

  const reloadTable = useCallback(()=>{
    if(
      teacherClassGroupControlState.initData === null || 
      teacherClassGroupControlState.idHold === null) return;
    
    dispatch(reloadTableStatisticsActionCreator({
      authToken: authToken,
      holdId: teacherClassGroupControlState.idHold,
      initData: teacherClassGroupControlState.initData
    }));
  },[dispatch, authToken, teacherClassGroupControlState.idHold, teacherClassGroupControlState.initData])

  return (
      <ClassGroupPanelView 
        createClass={createClass}
        switchIsPassed={switchIsPassed}
        updateGrade={updateGrade}
        onReview={onReview}
        reloadTable={reloadTable}
        setSelectedGrade={setSelectedGrade}
        deleteClass={deleteClass}
        teacherClassGroupControlState={teacherClassGroupControlState}
        goToTeacherClassGroupSubgroups={onPrevScreen}
        setAttendance={setAttendance}
        setDescription={setDescription}
        toggleComplited={toggleIsCompleted}
        setGradeNumber={setGradeNumber}

        setExpirationOfRefresh={setExpirationOfRefresh}
        setSelectedClass={setSelectedClass}
        setExpirationOfReview={setExpirationOfReview}

        activateKeyForClass={activateKeyForClass}

        createQrCode={createQrCode}
        clearQrCodeData={clearQrCodeData}
        />
    );
});
