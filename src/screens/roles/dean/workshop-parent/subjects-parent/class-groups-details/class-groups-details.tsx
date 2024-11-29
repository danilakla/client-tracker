import { FC, memo, useCallback, useEffect, useRef, useState } from 'react';
import { ClassGroupsDetailsProps } from './class-groups-details.props';
import { ClassGroupsDetailsView } from './class-groups-details.view';
import { useClassGroups } from '../class-groups/class-groups.props';
import { useAppDispatch, useTypedSelector } from '../../../../../../hooks/use-typed-selector';
import { classGroupDetailsSlice, createClassGroupActionCreator, initClassGroupDetailsActionCreator, SubgroupDetails, updateClassGroupActionCreator } from '../../../../../../store/reducers/roles/dean/subjects-parent/class-group-details-slice';
import { useUser } from '../../../../../../hooks/user-hook';
import { ItemOfSelectType } from '../../../../../../ui-kit/select/select';

export const ClassGroupsDetails: FC<ClassGroupsDetailsProps> = memo(({
  type
}) => {
  const goToClassGroups = useClassGroups();
  const {authToken} = useUser();
  const deanClassGroupDetailsState = useTypedSelector(state => state.deanClassGroupDetails);
  const deanClassGroupsState = useTypedSelector(state => state.deanClassGroups);

  const isInizialized = useRef(true);

  useEffect(() => {
    if(type === 'edit' && deanClassGroupDetailsState.selectedClassGroupId === null)
      goToClassGroups();
  },[type, deanClassGroupDetailsState.selectedClassGroupId, goToClassGroups])

  const { 
    setSelectedClassFormatActionCreator,
    setSelectedTeacherActionCreator,
    setDescriptionActionCreator,
    setSearchTextActionCreator,
    setSearchTextWindowActionCreator,
    switchIsExistByIndexActionCreator,
    reset
  } = classGroupDetailsSlice.actions;

  const dispatch = useAppDispatch();

  const initClassGroupDetails = useCallback(() => {
    dispatch(initClassGroupDetailsActionCreator({
      authToken: authToken,
      selectedClassGroupId: deanClassGroupDetailsState.selectedClassGroupId,
      type: type
    }));
  },[
    dispatch, 
    authToken,
    deanClassGroupDetailsState.selectedClassGroupId,
    type
  ])

  useEffect(() => {
    if (isInizialized.current) {
      isInizialized.current = false;
      initClassGroupDetails();
    } else return () => {
      dispatch(reset());
    };
  }, [dispatch, initClassGroupDetails, reset]);

  const setSelectedTeacher = useCallback((value: ItemOfSelectType) => {
    dispatch(setSelectedTeacherActionCreator(value));
  }, [dispatch, setSelectedTeacherActionCreator]);

  const setSelectedClassFormat = useCallback((value: ItemOfSelectType) => {
    dispatch(setSelectedClassFormatActionCreator(value));
  }, [dispatch, setSelectedClassFormatActionCreator]);

  const setDescription = useCallback((value: string) => {
    dispatch(setDescriptionActionCreator(value));
  }, [dispatch, setDescriptionActionCreator]);

  const setSearchText = useCallback((value: string) => {
    dispatch(setSearchTextActionCreator(value));
  }, [dispatch, setSearchTextActionCreator]);

  const setSearchTextWindow = useCallback((value: string) => {
    dispatch(setSearchTextWindowActionCreator(value));
  }, [dispatch, setSearchTextWindowActionCreator]);

  const switchIsExistByIndex = useCallback((value: number) => {
    dispatch(switchIsExistByIndexActionCreator(value));
  }, [dispatch, switchIsExistByIndexActionCreator]);

  const [filteredSubgroups, setFilteredSubgroups] = useState<SubgroupDetails[]>([]);
  const [filteredSubgroupsWindow, setFilteredSubgroupsWindow] = useState<SubgroupDetails[]>([]);

  useEffect(() => {
    const trimmedSearchText = deanClassGroupDetailsState.searchText.trim().toLowerCase();
  
    const newSubgroups = deanClassGroupDetailsState.newSubgroups
      .filter(subgroup => !trimmedSearchText || subgroup.subgroupNumber.toLowerCase().includes(trimmedSearchText));
  
      setFilteredSubgroups(newSubgroups);
  }, [deanClassGroupDetailsState.newSubgroups, deanClassGroupDetailsState.searchText]);

  useEffect(() => {
    const trimmedSearchText = deanClassGroupDetailsState.searchTextWindow.trim().toLowerCase();
  
    const newSubgroups = deanClassGroupDetailsState.newSubgroups
      .filter(subgroup => !trimmedSearchText || subgroup.subgroupNumber.toLowerCase().includes(trimmedSearchText));
  
      setFilteredSubgroupsWindow(newSubgroups);
  }, [deanClassGroupDetailsState.newSubgroups, deanClassGroupDetailsState.searchTextWindow]);

  const createClassGroup = useCallback(() => {
    dispatch(createClassGroupActionCreator({
      authToken: authToken,
      teacherId: Number.parseInt(deanClassGroupDetailsState.selectedTeacher.value),
      subjectId: deanClassGroupsState.selectedSubject?.idSubject || -1,
      newSubgroups: deanClassGroupDetailsState.newSubgroups,
      formatClassId: Number.parseInt(deanClassGroupDetailsState.selectedClassFormat.value),
      description: deanClassGroupDetailsState.description,
      onSuccess: goToClassGroups
    }));
  }, [
    dispatch, 
    deanClassGroupDetailsState.selectedTeacher,
    deanClassGroupDetailsState.selectedClassFormat,
    deanClassGroupDetailsState.description,
    deanClassGroupDetailsState.newSubgroups,
    deanClassGroupsState.selectedSubject?.idSubject,
    authToken,
    goToClassGroups
  ]);

  const updateClassGroup = useCallback(() => {
    dispatch(updateClassGroupActionCreator({
      authToken: authToken,
      teacherId: deanClassGroupDetailsState.selectedTeacher.value,
      subjectId: deanClassGroupsState.selectedSubject?.idSubject.toString() || '-1',
      classGroupId: deanClassGroupDetailsState.selectedClassGroupId?.toString() || '-1',
      classFormatId:  deanClassGroupDetailsState.selectedClassFormat.value,
      description: deanClassGroupDetailsState.description,
      newSubgroups: deanClassGroupDetailsState.newSubgroups,
      oldSubgroups: deanClassGroupDetailsState.subgroups,
      onSuccess: goToClassGroups
    }));
  }, [
    dispatch, 
    authToken,
    goToClassGroups,
    deanClassGroupDetailsState.selectedTeacher,
    deanClassGroupsState.selectedSubject?.idSubject,
    deanClassGroupDetailsState.selectedClassGroupId,
    deanClassGroupDetailsState.selectedClassFormat,
    deanClassGroupDetailsState.description,
    deanClassGroupDetailsState.newSubgroups,
    deanClassGroupDetailsState.subgroups
  ]);

  return (
      <ClassGroupsDetailsView 
        deanClassGroupDetailsState={deanClassGroupDetailsState}
        goToClassGroups={goToClassGroups}
        setSearchText={setSearchText}
        updateClassGroup={updateClassGroup}
        filteredSubgroups={filteredSubgroups}
        createClassGroup={createClassGroup}
        filteredSubgroupsWindow={filteredSubgroupsWindow}
        setSearchTextWindow={setSearchTextWindow}
        setDescription={setDescription}
        switchIsExistByIndex={switchIsExistByIndex}
        setSelectedClassFormat={setSelectedClassFormat}
        setSelectedTeacher={setSelectedTeacher}
        type={type}
        />
    );
});
