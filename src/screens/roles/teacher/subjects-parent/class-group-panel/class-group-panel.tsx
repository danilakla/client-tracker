import { FC, memo, useCallback, useEffect, useRef } from 'react';
import { ClassGroupPanelProps } from './class-group-panel.props';
import { ClassGroupPanelView } from './class-group-panel.view';
import { useAppDispatch, useTypedSelector } from '../../../../../hooks/use-typed-selector';
import { activateKeyForClassActionCreator, addClassActionCreator, AttendanceCodeType, classGroupControlSlice, createQrCodeActionCreator, deleteClassActionCreator, GradeInfo, HeaderClassType, updateGradeActionCreator } from '../../../../../store/reducers/roles/teacher/class-group-control-slice';
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

    setSelectedClassActionCreator,
    setExpirationOfRefreshActionCreator,
    setExpirationOfKeyActionCreator,
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

  const deleteClass = useCallback((onSuccess: () => void)=>{
    dispatch(deleteClassActionCreator({
      authToken: authToken, 
      idClass: teacherClassGroupControlState.classesIds[teacherClassGroupControlState.classesIds.length - 1],
      onSuccess: onSuccess
    }));
  },[
    dispatch,
    teacherClassGroupControlState.classesIds,
    authToken
  ])

  const updateGrade = useCallback((onSuccess: () => void)=>{
    dispatch(updateGradeActionCreator({
      authToken: authToken, 
      grade: teacherClassGroupControlState.selectedGrade,
      onSuccess: onSuccess
    }));
  },[
    dispatch,
    authToken,
    teacherClassGroupControlState.selectedGrade
  ])

  const setSelectedGrade = useCallback((gradeInfo: GradeInfo, onSuccess: () => void)=>{
    dispatch(setSelectedGradeActionCreator({gradeInfo, onSuccess}));
  },[dispatch,setSelectedGradeActionCreator])

  const setGradeNumber = useCallback((value: string)=>{
    dispatch(setGradeNumberActionCreator(value));
  },[dispatch,setGradeNumberActionCreator])

  const setDescription = useCallback((value: string)=>{
    dispatch(setDescriptionActionCreator(value));
  },[dispatch,setDescriptionActionCreator])

  const setAttendance = useCallback((value: AttendanceCodeType)=>{
    dispatch(setAttendanceActionCreator(value));
  },[dispatch,setAttendanceActionCreator])

  // qr-code-part

  const setSelectedClass = useCallback((value: HeaderClassType, onSuccess: () => void)=>{
    dispatch(setSelectedClassActionCreator({value, onSuccess}));
  },[dispatch,setSelectedClassActionCreator])

  const setExpirationOfRefresh = useCallback((value: number)=>{
    dispatch(setExpirationOfRefreshActionCreator(value));
  },[dispatch,setExpirationOfRefreshActionCreator])

  const setExpirationOfKey = useCallback((value: number)=>{
    dispatch(setExpirationOfKeyActionCreator(value));
  },[dispatch,setExpirationOfKeyActionCreator])

  const setExpirationOfReview = useCallback((value: number)=>{
    dispatch(setExpirationOfReviewActionCreator(value));
  },[dispatch,setExpirationOfReviewActionCreator])

  const activateKeyForClass = useCallback((onSuccess: () => void)=>{
    dispatch(activateKeyForClassActionCreator({
      authToken: authToken, 
      expiration: teacherClassGroupControlState.generateKeyPopup.expiration,
      classId: teacherClassGroupControlState.selectedClass.id,
      onSuccess: onSuccess
    }));
  },[
    dispatch,
    teacherClassGroupControlState.generateKeyPopup.expiration,
    authToken,
    teacherClassGroupControlState.selectedClass.id
  ])

  const clearQrCodeData = useCallback(()=>{
    dispatch(clearQrCodeDataActionCreator());
  },[dispatch,clearQrCodeDataActionCreator])

  const createQrCode = useCallback(()=>{
    dispatch(createQrCodeActionCreator({
      authToken: authToken,
      expirationOfReview: teacherClassGroupControlState.qrCodePopup.expirationOfReview,
      expirationOfRefresh: teacherClassGroupControlState.qrCodePopup.expirationOfRefresh,
      classId: teacherClassGroupControlState.selectedClass.id,
    }));
  },[
    dispatch,
    teacherClassGroupControlState.qrCodePopup.expirationOfReview,
    teacherClassGroupControlState.qrCodePopup.expirationOfRefresh,
    teacherClassGroupControlState.selectedClass.id,
    authToken
  ])

  const onReview = useCallback((onSuccess: () => void)=>{
    onSuccess();
  },[])

  return (
      <ClassGroupPanelView 
        createClass={createClass}
        updateGrade={updateGrade}
        onReview={onReview}
        setSelectedGrade={setSelectedGrade}
        deleteClass={deleteClass}
        teacherClassGroupControlState={teacherClassGroupControlState}
        goToTeacherClassGroupSubgroups={onPrevScreen}
        setAttendance={setAttendance}
        setDescription={setDescription}
        setGradeNumber={setGradeNumber}

        setExpirationOfRefresh={setExpirationOfRefresh}
        setExpirationOfKey={setExpirationOfKey}
        setSelectedClass={setSelectedClass}
        setExpirationOfReview={setExpirationOfReview}

        activateKeyForClass={activateKeyForClass}

        createQrCode={createQrCode}
        clearQrCodeData={clearQrCodeData}
        />
    );
});
