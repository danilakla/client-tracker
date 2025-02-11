import { FC, memo, useCallback, useEffect, useRef } from 'react';
import { ClassGroupPanelProps } from './class-group-panel.props';
import { ClassGroupPanelView } from './class-group-panel.view';
import { useAppDispatch, useTypedSelector } from '../../../../../hooks/use-typed-selector';
import { activateKeyForClassActionCreator, addClassActionCreator, AttendanceCodeType, AttestationGradeInfo, calculateAttestationActionCreator, classGroupControlSlice, ClassHeaderType, createQrCodeActionCreator, deleteClassActionCreator, GradeInfo, reloadTableStatisticsActionCreator, startReviewForClassActionCreator, updateAttestationClassActionCreator, updateGradeActionCreator } from '../../../../../store/reducers/roles/teacher/class-group-control-slice';
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
    clearQrCodeDataActionCreator,

    setSelectedAttestationGradeActionCreator,

    setCountClassThatNotAttestationClassActionCreator,
    setMaxCountLabActionCreator,
    setTimeOfOneClassActionCreator,
    setAvgGradeActionCreator,

    resetAttestateWindowPopup
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

  const resetAttestateWindow = useCallback(()=>{
    dispatch(resetAttestateWindowPopup());
  },[dispatch,resetAttestateWindowPopup])
  const setMaxCountLab = useCallback((value: string)=>{
    dispatch(setMaxCountLabActionCreator(value));
  },[dispatch,setMaxCountLabActionCreator])
  const setTimeOfOneClass = useCallback((value: string)=>{
    dispatch(setTimeOfOneClassActionCreator(value));
  },[dispatch,setTimeOfOneClassActionCreator])
  const setCountClassThatNotAttestationClass = useCallback((value: string)=>{
    dispatch(setCountClassThatNotAttestationClassActionCreator(value));
  },[dispatch,setCountClassThatNotAttestationClassActionCreator])

  const setSelectedGrade = useCallback((gradeInfo: GradeInfo, onSuccess: () => void)=>{
    dispatch(setSelectedGradeActionCreator({gradeInfo, onSuccess}));
  },[dispatch,setSelectedGradeActionCreator])

  const setSelectedAttestationGrade = useCallback((value: AttestationGradeInfo, onSuccess: () => void)=>{
    dispatch(setSelectedAttestationGradeActionCreator({value, onSuccess}));
  },[dispatch,setSelectedAttestationGradeActionCreator])

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

  const calculateAttestation = useCallback((onSuccess: () => void)=>{
    if(teacherClassGroupControlState.maxLabCount === null
      || teacherClassGroupControlState.countClassThatNotAttestation === null
      || teacherClassGroupControlState.timeOfOneClass === null)
      return;

    const studentIds: number[] = teacherClassGroupControlState.studentsStatistics.map(
      item => item.student.idStudent
    )
 
    dispatch(calculateAttestationActionCreator({
      authToken: authToken,
      maxLabCount: teacherClassGroupControlState.maxLabCount,
      classId: teacherClassGroupControlState.selectedClass.idClass,
      holdId: teacherClassGroupControlState.selectedClass.idClassHold,
      countClassThatNotAttestation: teacherClassGroupControlState.countClassThatNotAttestation,
      timeOfOneClass: teacherClassGroupControlState.timeOfOneClass,
      studentId: studentIds,
      onSuccess: onSuccess
    }))
  },[
      dispatch,authToken, 
      teacherClassGroupControlState.studentsStatistics,
      teacherClassGroupControlState.maxLabCount,
      teacherClassGroupControlState.selectedClass,
      teacherClassGroupControlState.countClassThatNotAttestation,
      teacherClassGroupControlState.timeOfOneClass
  ])

  const setAvgGrade = useCallback((value: string) => {
    dispatch(setAvgGradeActionCreator(value));
  },[dispatch,setAvgGradeActionCreator])

  const onSave = useCallback((onSuccess: () => void) => {
    if(teacherClassGroupControlState.avgGrade === null 
      || teacherClassGroupControlState.maxLabCount === null
      || teacherClassGroupControlState.timeOfOneClass === null
      || teacherClassGroupControlState.countClassThatNotAttestation === null)
      return;

    dispatch(updateAttestationClassActionCreator({
      authToken: authToken,
      avgGrade: teacherClassGroupControlState.avgGrade,
      maxCountLab: teacherClassGroupControlState.maxLabCount,
      idAttestationStudentGrades: teacherClassGroupControlState.selectedAttestationGrade.idAttestationStudentGrades,
      hour: teacherClassGroupControlState.timeOfOneClass,
      currentCountLab: teacherClassGroupControlState.countClassThatNotAttestation,
      onSuccess: onSuccess
    }));
  },[
    authToken, dispatch,
    teacherClassGroupControlState.avgGrade,
    teacherClassGroupControlState.maxLabCount,
    teacherClassGroupControlState.selectedAttestationGrade.idAttestationStudentGrades,
    teacherClassGroupControlState.timeOfOneClass,
    teacherClassGroupControlState.countClassThatNotAttestation,])

  return (
      <ClassGroupPanelView 
        createClass={createClass}
        onSave={onSave}
        switchIsPassed={switchIsPassed}
        calculateAttestation={calculateAttestation}
        updateGrade={updateGrade}
        setAvgGrade={setAvgGrade}
        onReview={onReview}
        reloadTable={reloadTable}
        setSelectedGrade={setSelectedGrade}
        setSelectedAttestationGrade={setSelectedAttestationGrade}
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

        setCountClassThatNotAttestationClass={setCountClassThatNotAttestationClass}
        setMaxCountLab={setMaxCountLab}
        setTimeOfOneClass={setTimeOfOneClass}
        resetAttestateWindow={resetAttestateWindow}
        />
    );
});
