import { FC, memo, useCallback, useEffect, useRef, useState } from 'react';
import { ClassGroupSubgroupsProps } from './class-group-subgroups.props';
import { ClassGroupSubgroupsView } from './class-group-subgroups.view';
import { useAppDispatch, useTypedSelector } from '../../../../../hooks/use-typed-selector';
import { useUser } from '../../../../../hooks/user-hook';
import { classGroupsSlice } from '../../../../../store/reducers/roles/teacher/class-groups-slice';
import { ClassGroupInfo } from '../../../../../store/reducers/roles/teacher/subjects-slice';
import { useTeacherSubjects } from '../subjects/subjects.props';
import { classGroupSubroupsSlice, initSubgroupOfClassGroupActionCreator, SubgroupInfo } from '../../../../../store/reducers/roles/teacher/class-group-subroups-slice';
import { useParams } from 'react-router-dom';
import { classGroupControlSlice } from '../../../../../store/reducers/roles/teacher/class-group-control-slice';
import { useClassGroupPanel } from '../class-group-panel/class-group-panel.props';
import { useTeacherClassGroups } from '../class-groups/class-groups.props';

export const ClassGroupSubgroups: FC<ClassGroupSubgroupsProps> = memo(() => {
  const teacherClassGroupSubroupsState = useTypedSelector(state => state.teacherClassGroupSubroups);
  const dispatch = useAppDispatch();
  const {authToken} = useUser();

  const goToSubjects = useTeacherSubjects();
  const goToTeacherClassGroups = useTeacherClassGroups();
  const goToClassGroupPanel = useClassGroupPanel();
  
  const { 
    setSearchTextActionCreator,
    resetStatus,
    reset
  } = classGroupSubroupsSlice.actions;
  
  const goBack = useCallback(() => {
    goToTeacherClassGroups();
    dispatch(reset());
  },[dispatch, goToTeacherClassGroups, reset])

  
  const { 
    setClassGroupInfoActionCreator,
  } = classGroupControlSlice.actions;

  const [filteredSubgroups, setFilteredSubgroups] = useState<SubgroupInfo[]>([]);

  useEffect(() => {
    const trimmedSearchText = teacherClassGroupSubroupsState.searchText.trim().toLowerCase();
  
    const newFiltered= teacherClassGroupSubroupsState.subgroups
      .filter(subgroup => !trimmedSearchText || subgroup.subgroupNumber.toLowerCase().includes(trimmedSearchText));
  
      setFilteredSubgroups(newFiltered);
  }, [teacherClassGroupSubroupsState.subgroups, teacherClassGroupSubroupsState.searchText]);

  const setSearchText = useCallback((value: string) => {
    dispatch(setSearchTextActionCreator(value));
  }, [dispatch, setSearchTextActionCreator]);

  const goToClassGroubBySubgroup = useCallback((subgroup: SubgroupInfo) => {
    dispatch(setClassGroupInfoActionCreator({
      initData: {
        subgroup: subgroup, 
        classGroup: teacherClassGroupSubroupsState.classGroupInfo
      },
      onSuccess: goToClassGroupPanel
    }));
  }, [
    dispatch, 
    goToClassGroupPanel, 
    setClassGroupInfoActionCreator, 
    teacherClassGroupSubroupsState.classGroupInfo
  ]);

  const isInizialized = useRef(true);

  const initData = useCallback(()=>{
    if(teacherClassGroupSubroupsState.idClassGroup === null){
      goToSubjects();
      return;
    }

    dispatch(initSubgroupOfClassGroupActionCreator({
      authToken: authToken, 
      id: teacherClassGroupSubroupsState.idClassGroup,
      onError: goToSubjects
    }));
  },[dispatch, authToken,goToSubjects,  teacherClassGroupSubroupsState.idClassGroup])

  useEffect(() => {
    if (isInizialized.current) {
      isInizialized.current = false;
      initData();
    } else return () => {
      
    };
  }, [dispatch, resetStatus, initData, teacherClassGroupSubroupsState.loading]);

  return (
      <ClassGroupSubgroupsView 
        goToClassGroubBySubgroup={goToClassGroubBySubgroup}
        filteredSubgroups={filteredSubgroups}
        teacherClassGroupSubroupsState={teacherClassGroupSubroupsState}
        setSearchText={setSearchText}
        goToTeacherClassGroups={goBack}
        />
    );
});
