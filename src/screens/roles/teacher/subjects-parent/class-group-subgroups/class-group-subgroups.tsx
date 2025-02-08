import { FC, memo, useCallback, useEffect, useRef, useState } from 'react';
import { ClassGroupSubgroupsProps } from './class-group-subgroups.props';
import { ClassGroupSubgroupsView } from './class-group-subgroups.view';
import { useAppDispatch, useTypedSelector } from '../../../../../hooks/use-typed-selector';
import { useUser } from '../../../../../hooks/user-hook';
import { useTeacherSubjects } from '../subjects/subjects.props';
import { ClassGroupData, classGroupSubroupsSlice, initSubgroupOfClassGroupActionCreator, SubgroupInfo } from '../../../../../store/reducers/roles/teacher/class-group-subroups-slice';
import { initTableStatisticsActionCreator } from '../../../../../store/reducers/roles/teacher/class-group-control-slice';
import { ClassGroupPanel } from '../class-group-panel';
import { useTeacherClassGroups } from '../class-groups/class-groups.props';

export const ClassGroupSubgroups: FC<ClassGroupSubgroupsProps> = memo(() => {
  const teacherClassGroupSubroupsState = useTypedSelector(state => state.teacherClassGroupSubroups);
  const dispatch = useAppDispatch();
  const {authToken} = useUser();

  const goToSubjects = useTeacherSubjects();
  const goToClassGroupPanel = useTeacherClassGroups();
  
  const { 
    setSearchTextActionCreator,
    resetStatus,
    reset
  } = classGroupSubroupsSlice.actions;

  const [filteredSubgroups, setFilteredSubgroups] = useState<SubgroupInfo[]>([]);

  useEffect(() => {
    const trimmedSearchText = teacherClassGroupSubroupsState.searchText.trim().toLowerCase();
  
    const newFiltered= teacherClassGroupSubroupsState.subgroups
      .filter(subgroup => !trimmedSearchText || subgroup.subgroup.subgroupNumber.toLowerCase().includes(trimmedSearchText));
  
      setFilteredSubgroups(newFiltered);
  }, [teacherClassGroupSubroupsState.subgroups, teacherClassGroupSubroupsState.searchText]);

  const setSearchText = useCallback((value: string) => {
    dispatch(setSearchTextActionCreator(value));
  }, [dispatch, setSearchTextActionCreator]);

  const isInizialized = useRef(true);

  const [currentPage, setCurrentPage] = useState<'subgroups' | 'table'>('subgroups');

  const openStudentTable = useCallback((holdId: number, subgroup: SubgroupInfo) => {
    setCurrentPage('table')
    dispatch(initTableStatisticsActionCreator({
      holdId: holdId,
      authToken: authToken,
      initData: {
        idHold: holdId,
        subgroup: subgroup.subgroup,
        classGroup: teacherClassGroupSubroupsState.classGroupInfo
      }
    }))
  },[dispatch, authToken, teacherClassGroupSubroupsState.classGroupInfo])

  const initStudentTable = useCallback((holdId: number, subgroup: SubgroupInfo, classGroupInfo: ClassGroupData) => {
    setCurrentPage('table')
    dispatch(initTableStatisticsActionCreator({
      holdId: holdId,
      authToken: authToken,
      initData: {
        idHold: holdId,
        subgroup: subgroup.subgroup,
        classGroup: classGroupInfo
      }
    }))
  },[dispatch, authToken])

  const initData = useCallback(()=>{
    if(teacherClassGroupSubroupsState.idClassGroup === null){
      goToSubjects();
      return;
    }

    dispatch(initSubgroupOfClassGroupActionCreator({
      authToken: authToken, 
      initStudentTable: initStudentTable,
      idClassGroup: teacherClassGroupSubroupsState.idClassGroup,
      onError: goToSubjects
    }));
  },[
    dispatch, 
    authToken, 
    teacherClassGroupSubroupsState.idClassGroup,
    initStudentTable,  
    goToSubjects
  ])

  useEffect(() => {
    if (isInizialized.current) {
      isInizialized.current = false;
      initData();
    } else return () => {
      
    };
  }, [dispatch, resetStatus, initData, teacherClassGroupSubroupsState.loading]);

  const goToClassGroubBySubgroup = useCallback((subgroup: SubgroupInfo) => {
    openStudentTable(
      subgroup.idHold,
      subgroup
    )
  }, [
    openStudentTable
  ]);

  const onPrevScreen = useCallback(() => {
    if(teacherClassGroupSubroupsState.isOneScreen || currentPage === 'subgroups'){
      goToClassGroupPanel();
      dispatch(reset());
    } setCurrentPage('subgroups');
  },[currentPage, dispatch, reset, goToClassGroupPanel, teacherClassGroupSubroupsState.isOneScreen])

  return (
    <>
    {
      currentPage === 'subgroups' ? 
        <ClassGroupSubgroupsView 
          goToClassGroubBySubgroup={goToClassGroubBySubgroup}
          filteredSubgroups={filteredSubgroups}
          onPrevScreen={onPrevScreen}
          teacherClassGroupSubroupsState={teacherClassGroupSubroupsState}
          setSearchText={setSearchText}
        /> :
        <ClassGroupPanel onPrevScreen={onPrevScreen}/>
    }
    </>
      
    );
});
