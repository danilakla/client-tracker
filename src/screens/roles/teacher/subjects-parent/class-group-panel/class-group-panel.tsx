import { FC, memo, useCallback, useEffect, useRef } from 'react';
import { ClassGroupPanelProps } from './class-group-panel.props';
import { ClassGroupPanelView } from './class-group-panel.view';
import { useParams } from 'react-router-dom';
import { useAppDispatch, useTypedSelector } from '../../../../../hooks/use-typed-selector';
import { addClassActionCreator, classGroupControlSlice, deleteClassActionCreator, GradeInfo, initTableStatisticsActionCreator, updateGradeActionCreator } from '../../../../../store/reducers/roles/teacher/class-group-control-slice';
import { useUser } from '../../../../../hooks/user-hook';
import { useTeacherSubjects } from '../subjects/subjects.props';
import { useTeacherClassGroupSubgroups } from '../class-group-subgroups/class-group-subgroups.props';

export const ClassGroupPanel: FC<ClassGroupPanelProps> = memo(() => {
  const teacherClassGroupControlState = useTypedSelector(state => state.teacherClassGroupControl);
  const dispatch = useAppDispatch();
  const {authToken} = useUser();

  const goToSubjects = useTeacherSubjects();
  const goToTeacherClassGroupSubgroups= useTeacherClassGroupSubgroups();

  const isInizialized = useRef(true);

  const { 
    reset,
    setSelectedGradeActionCreator
  } = classGroupControlSlice.actions;

  const initTableData = useCallback(()=>{
    dispatch(initTableStatisticsActionCreator({
      authToken: authToken, 
      idClassGroupToSubgroup: teacherClassGroupControlState.initData?.subgroup.idClassGroupToSubgroup || -1, 
      idSubgroup: teacherClassGroupControlState.initData?.subgroup.idSubgroup || -1,
    }));
  },[
    teacherClassGroupControlState.initData,
    dispatch,
    authToken])

  useEffect(() => {
    if (isInizialized.current) {
      isInizialized.current = false;
      initTableData();
    } else return () => {
      dispatch(reset());
    };
  }, [dispatch, reset, initTableData]);

  useEffect(() => {
    if(teacherClassGroupControlState.initData === null){
      goToSubjects();
    }
  }, [teacherClassGroupControlState.initData, goToSubjects]);

  const createClass = useCallback((onSuccess: () => void)=>{
    dispatch(addClassActionCreator({
      authToken: authToken, 
      classGroupToSubgroupId: teacherClassGroupControlState.initData?.subgroup.idClassGroupToSubgroup || -1,
      studentsStatistics: teacherClassGroupControlState.studentsStatistics,
      onSuccess: onSuccess
    }));
  },[
    dispatch,
    authToken,
    teacherClassGroupControlState.initData?.subgroup.idClassGroupToSubgroup,
    teacherClassGroupControlState.studentsStatistics
  ])

  const deleteClass = useCallback((onSuccess: () => void)=>{
    dispatch(deleteClassActionCreator({
      authToken: authToken, 
      idClass: -1,
      onSuccess: onSuccess
    }));
  },[
    dispatch,
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

  return (
      <ClassGroupPanelView 
        createClass={createClass}
        updateGrade={updateGrade}
        setSelectedGrade={setSelectedGrade}
        deleteClass={deleteClass}
        teacherClassGroupControlState={teacherClassGroupControlState}
        goToTeacherClassGroupSubgroups={goToTeacherClassGroupSubgroups}
        />
    );
});
