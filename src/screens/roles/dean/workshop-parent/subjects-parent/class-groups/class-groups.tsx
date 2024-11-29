import { FC, memo, useCallback, useEffect, useRef, useState } from 'react';
import { ClassGroupsProps } from './class-groups.props';
import { ClassGroupsView } from './class-groups.view';
import { useControlSubjects } from '../control-subjects/control-subjects.props';
import { useAppDispatch, useTypedSelector } from '../../../../../../hooks/use-typed-selector';
import { useUser } from '../../../../../../hooks/user-hook';
import { ClassGroupInfo, classGroupsSlice, deleteSubjectActionCreator, initClassGroupsActionCreator, updateSubjectActionCreator } from '../../../../../../store/reducers/roles/dean/subjects-parent/class-groups-slice';
import { useClassGroupAdd, useClassGroupEdit } from '../class-groups-details/class-groups-details.props';
import { classGroupDetailsSlice } from '../../../../../../store/reducers/roles/dean/subjects-parent/class-group-details-slice';

export const ClassGroups: FC<ClassGroupsProps> = memo(() => {
  const goToControlSubjects = useControlSubjects();
  const goToClassGroupEdit = useClassGroupEdit();
  const goToClassGroupAdd = useClassGroupAdd();
  const {authToken} = useUser();
  const deanClassGroupsState = useTypedSelector(state => state.deanClassGroups);

  const { 
    setNameActionCreator,
    setSearchTextActionCreator,
    setDescriptionActionCreator,
    reset,
    clearErrors
  } = classGroupsSlice.actions;

  const { 
    setSelectedClassGroupIdActionCreator,
  } = classGroupDetailsSlice.actions;

  const dispatch = useAppDispatch();

  const setName = useCallback((value: string) => {
    dispatch(setNameActionCreator(value));
  }, [dispatch, setNameActionCreator]);

  const deleteSubject = useCallback((onSuccess: () => void) => {
    dispatch(deleteSubjectActionCreator({
      authToken: authToken,
      id: deanClassGroupsState.selectedSubject?.idSubject || -1,
      onSuccess: onSuccess
    }));
  }, [dispatch, authToken, deanClassGroupsState.selectedSubject?.idSubject]);

  const updateSubject = useCallback((onSuccess: () => void) => {
    dispatch(updateSubjectActionCreator({
      authToken: authToken,
      id: deanClassGroupsState.selectedSubject?.idSubject || -1,
      name: deanClassGroupsState.name,
      description: deanClassGroupsState.description,
      onSuccess: onSuccess
    }));
  }, [
    dispatch, 
    authToken, 
    deanClassGroupsState.selectedSubject?.idSubject,
    deanClassGroupsState.name,
    deanClassGroupsState.description
  ]);


  const setDescription = useCallback((value: string) => {
    dispatch(setDescriptionActionCreator(value));
  }, [dispatch, setDescriptionActionCreator]);

  const setSearchText = useCallback((value: string) => {
    dispatch(setSearchTextActionCreator(value));
  }, [dispatch, setSearchTextActionCreator]);

  const clearAllErrors = useCallback(()=>{
    dispatch(clearErrors());
  },[dispatch, clearErrors])

  useEffect(() => {
    if(deanClassGroupsState.selectedSubject === null){
      goToControlSubjects();
    }
  },[deanClassGroupsState.selectedSubject, goToControlSubjects])


  const [filteredClassGroups, setFilteredClassGroups] = useState<ClassGroupInfo[]>([]);

  useEffect(() => {
    const trimmedSearchText = deanClassGroupsState.searchText.trim().toLowerCase();
  
    const newFilteredClassGroups = deanClassGroupsState.classGroups
      .filter(classGroup => !trimmedSearchText || classGroup.description.toLowerCase().includes(trimmedSearchText));
  
      setFilteredClassGroups(newFilteredClassGroups);
  }, [deanClassGroupsState.classGroups, deanClassGroupsState.searchText]);

  const initClassGroups = useCallback(()=>{
    dispatch(initClassGroupsActionCreator({
      authToken: authToken,
      id: deanClassGroupsState.selectedSubject?.idSubject || -1
    }));
  },[dispatch, authToken, deanClassGroupsState.selectedSubject?.idSubject])

  const isInizialized = useRef(true);
  
  
  useEffect(() => {
    if (isInizialized.current) {
      isInizialized.current = false;
      initClassGroups();
    } else return () => {
      // dispatch(reset());
    };
  }, [dispatch, reset, initClassGroups]);

  const setDataAndGoToClassGroupDetails = useCallback((value: number)=>{
    dispatch(setSelectedClassGroupIdActionCreator({
      value: value,
      onSuccess: goToClassGroupEdit
    }));
  },[dispatch, setSelectedClassGroupIdActionCreator, goToClassGroupEdit])

  return (
      <ClassGroupsView 
        filteredClassGroups={filteredClassGroups}
        goToControlSubjects={goToControlSubjects}
        setDescription={setDescription}
        setName={setName}
        updateSubject={updateSubject}
        setSearchText={setSearchText}
        goToClassGroupEdit={setDataAndGoToClassGroupDetails}
        deleteSubject={deleteSubject}
        clearAllErrors={clearAllErrors}
        goToClassGroupAdd={goToClassGroupAdd}
        deanClassGroupsState={deanClassGroupsState}
        />
    );
});
