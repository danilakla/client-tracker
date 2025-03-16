import { FC, memo, useCallback, useEffect, useRef, useState } from 'react';
import { ClassGroupsBySubgroupProps } from './class-groups-by-subgroup.props';
import { ClassGroupsBySubgroupView } from './class-groups-by-subgroup.view';
import { useAppDispatch, useTypedSelector } from '../../../../../hooks/use-typed-selector';
import { useUser } from '../../../../../hooks/user-hook';
import { ClassGroupDTO, classGroupsBySubgroupSlice, initClassGroupsBySubgroupnActionCreator, SubgroupDTO, SubjectDTO } from '../../../../../store/reducers/roles/dean/class-groups-by-subgroup-slice';
import { useDeanWorkshop } from '../workshop/workshop.props';
import { useClassTable } from '../class-table/class-table.props';
import { classGroupTableSlice, InitData } from '../../../../../store/reducers/roles/dean/class-group-table-slice';

export const ClassGroupsBySubgroup: FC<ClassGroupsBySubgroupProps> = memo(() => {
  const deanClassGroupsBySubgroupState = useTypedSelector(state => state.deanClassGroupsBySubgroup);
     
  const {authToken} = useUser();
  const dispatch = useAppDispatch();
  const goToWorkshop = useDeanWorkshop();

  const { 
    reset,
    setSearchClassGroupActionCreator,
    setSearchSubgroupActionCreator,
    setIsCheckTableActionCreator,
    setSelectedSubjectActionCreator,
    setSelectedSubgroupActionCreator,
    setSearchSubjectActionCreator
  } = classGroupsBySubgroupSlice.actions;

  const isInizialized = useRef(true);

  const initData = useCallback(()=>{
    dispatch(initClassGroupsBySubgroupnActionCreator({authToken: authToken}));
  },[dispatch, authToken])

  useEffect(() => {
    if (isInizialized.current) {
       isInizialized.current = false;
       initData();
     } 
     return () => {
      //  dispatch(reset());
     };
  },[dispatch, reset, initData]);


  const setSearchSubgroup = useCallback((value: string) => {
    dispatch(setSearchSubgroupActionCreator(value));
  }, [dispatch, setSearchSubgroupActionCreator]);

  const setSearchClassGroup = useCallback((value: string) => {
    dispatch(setSearchClassGroupActionCreator(value));
  }, [dispatch, setSearchClassGroupActionCreator]);

  const setSearchSubject = useCallback((value: string) => {
    dispatch(setSearchSubjectActionCreator(value));
  }, [dispatch, setSearchSubjectActionCreator]);

  const setSelectedSubject = useCallback((value: SubjectDTO, onSuccess: () => void) => {
    dispatch(setSelectedSubjectActionCreator({value, onSuccess}));
  }, [dispatch, setSelectedSubjectActionCreator]);

  const setSelectedSubgroup = useCallback((value: SubgroupDTO, onSuccess: () => void) => {
    dispatch(setSelectedSubgroupActionCreator({value, onSuccess}));
  }, [dispatch, setSelectedSubgroupActionCreator]);

  const setIsCheckTable = useCallback((value: boolean) => {
    dispatch(setIsCheckTableActionCreator(value));
  }, [dispatch, setIsCheckTableActionCreator]);

  const [filteredSubgroups, setFilteredSubgroups] = useState<SubgroupDTO[]>([]);
  
  useEffect(() => {
    const trimmedSearchText = deanClassGroupsBySubgroupState.searchSubgroup.trim().toLowerCase();
  
    const newFiltered= deanClassGroupsBySubgroupState.subgroups
      .filter(subgroup => !trimmedSearchText || subgroup.subgroupNumber.toLowerCase().includes(trimmedSearchText));
  
      setFilteredSubgroups(newFiltered);
  }, [deanClassGroupsBySubgroupState.subgroups, deanClassGroupsBySubgroupState.searchSubgroup]);

  const [filteredSubjects, setFilteredSubjects] = useState<SubjectDTO[]>([]);

  useEffect(() => {
    const trimmedSearchText = deanClassGroupsBySubgroupState.searchSubject.trim().toLowerCase();
  
    const newFiltered= deanClassGroupsBySubgroupState.selectedSubgroup.subjects
      .filter(subject => !trimmedSearchText || subject.subjectName.toLowerCase().includes(trimmedSearchText));
  
      setFilteredSubjects(newFiltered);
  }, [deanClassGroupsBySubgroupState.selectedSubgroup.subjects, deanClassGroupsBySubgroupState.searchSubject]);

  const [filteredClassGroups, setFilteredClassGroups] = useState<ClassGroupDTO[]>([]);
  
  useEffect(() => {
    const trimmedSearchText = deanClassGroupsBySubgroupState.searchClassGroup.trim().toLowerCase();
  
    const newFiltered= deanClassGroupsBySubgroupState.selectedSubject.classGroups
      .filter(classGroup => !trimmedSearchText || classGroup.description.toLowerCase().includes(trimmedSearchText));
  
      setFilteredClassGroups(newFiltered);
  }, [deanClassGroupsBySubgroupState.selectedSubject.classGroups, deanClassGroupsBySubgroupState.searchClassGroup]);

  const deanClassTable = useClassTable();

  const { 
    setInitDataActionCreator
  } = classGroupTableSlice.actions;

  const openClassTable = useCallback((value: InitData) => {
    setIsCheckTable(true);
    dispatch(setInitDataActionCreator({value, onSuccess: deanClassTable}));
  }, [dispatch, setIsCheckTable, setInitDataActionCreator, deanClassTable]);

  const goBackToWorkshop = useCallback(() => {
    dispatch(reset());
    goToWorkshop();
  },[goToWorkshop, dispatch, reset])

  return (
      <ClassGroupsBySubgroupView 
        setSearchClassGroup={setSearchClassGroup}
        goToWorkshop={goBackToWorkshop}
        setIsCheckTable={setIsCheckTable}
        setSearchSubgroup={setSearchSubgroup}
        setSearchSubject={setSearchSubject}
        setSelectedSubgroup={setSelectedSubgroup}
        setSelectedSubject={setSelectedSubject}
        isCheckTable={deanClassGroupsBySubgroupState.isCheckTable}
        loading={deanClassGroupsBySubgroupState.loading}
        searchClassGroup={deanClassGroupsBySubgroupState.searchClassGroup}
        searchSubgroup={deanClassGroupsBySubgroupState.searchSubgroup}
        searchSubject={deanClassGroupsBySubgroupState.searchSubject}
        filteredClassGroups={filteredClassGroups}
        filteredSubgroups={filteredSubgroups}
        openClassTable={openClassTable}
        filteredSubjects={filteredSubjects}
        selectedSubjectName={deanClassGroupsBySubgroupState.selectedSubject.subjectName}
        />
    );
});
