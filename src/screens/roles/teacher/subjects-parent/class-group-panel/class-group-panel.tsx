import { FC, memo, useCallback, useEffect, useRef } from 'react';
import { ClassGroupPanelProps } from './class-group-panel.props';
import { ClassGroupPanelView } from './class-group-panel.view';
import { useParams } from 'react-router-dom';
import { useAppDispatch, useTypedSelector } from '../../../../../hooks/use-typed-selector';
import { classGroupControlSlice, initTableStatisticsActionCreator } from '../../../../../store/reducers/roles/teacher/class-group-control-slice';
import { useUser } from '../../../../../hooks/user-hook';
import { useTeacherSubjects } from '../subjects/subjects.props';

export const ClassGroupPanel: FC<ClassGroupPanelProps> = memo(() => {
  const teacherClassGroupControlState = useTypedSelector(state => state.teacherClassGroupControl);
  const dispatch = useAppDispatch();
  const {authToken} = useUser();

  const goToSubjects = useTeacherSubjects();

  const isInizialized = useRef(true);

  const { 
    reset
  } = classGroupControlSlice.actions;

  const initTableData = useCallback(()=>{
    dispatch(initTableStatisticsActionCreator({
      authToken: authToken, 
      idClassGroup: teacherClassGroupControlState.initData?.classGroup.classGroup.idClassGroup || -1, 
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

  return (
      <ClassGroupPanelView 
        teacherClassGroupControlState={teacherClassGroupControlState}
        />
    );
});
