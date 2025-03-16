import { FC, memo, useCallback, useEffect, useRef, useState } from 'react';
import { ControlSubjectsProps } from './control-subjects.props';
import { ControlSubjectsView } from './control-subjects.view';
import { useDeanWorkshop } from '../../workshop/workshop.props';
import { useAppDispatch, useTypedSelector } from '../../../../../../hooks/use-typed-selector';
import { useUser } from '../../../../../../hooks/user-hook';
import { controlSubjectsSlice, createSubjectActionCreator, initSubjectsActionCreator, SubjectInfo } from '../../../../../../store/reducers/roles/dean/subjects-parent/control-subjects-slice';
import { useClassGroups } from '../class-groups/class-groups.props';
import { classGroupsSlice } from '../../../../../../store/reducers/roles/dean/subjects-parent/class-groups-slice';

export const ControlSubjects: FC<ControlSubjectsProps> = memo(() => {
  const goToWorkshop = useDeanWorkshop();
  const goToClassGroups = useClassGroups();

  const deanControlSubjectsState = useTypedSelector(state => state.deanControlSubjects);

  const {authToken} = useUser();


  const [filteredSubjects, setFilteredSubjects] = useState<SubjectInfo[]>([]);

  useEffect(() => {
    const trimmedSearchText = deanControlSubjectsState.searchText.trim().toLowerCase();
  
    const newFilteredSubjects = deanControlSubjectsState.subjects
      .filter(subject => !trimmedSearchText || subject.name.toLowerCase().includes(trimmedSearchText));
  
      setFilteredSubjects(newFilteredSubjects);
  }, [deanControlSubjectsState.subjects, deanControlSubjectsState.searchText]);


  const { 
    setNameActionCreator,
    setSearchTextActionCreator,
    setDescriptionActionCreator,
    reset,
    clearErrors
  } = controlSubjectsSlice.actions;

  const { 
    setSelectedSubjectActionCreator
  } = classGroupsSlice.actions;

  const dispatch = useAppDispatch();

  const setName = useCallback((value: string) => {
    dispatch(setNameActionCreator(value));
  }, [dispatch, setNameActionCreator]);

  const setDescription = useCallback((value: string) => {
    dispatch(setDescriptionActionCreator(value));
  }, [dispatch, setDescriptionActionCreator]);

  const setSearchText = useCallback((value: string) => {
    dispatch(setSearchTextActionCreator(value));
  }, [dispatch, setSearchTextActionCreator]);

  const isInizialized = useRef(true);

  const initSubjects = useCallback(()=>{
    dispatch(initSubjectsActionCreator({authToken: authToken}));
  },[dispatch, authToken])

  const clearAllErrors = useCallback(()=>{
    dispatch(clearErrors());
  },[dispatch, clearErrors])

  useEffect(() => {
    if (isInizialized.current && deanControlSubjectsState.loading !== 'success') {
      isInizialized.current = false;
      initSubjects();
    } 
    
    return () => {
      // dispatch(reset());
    };
  }, [dispatch, reset, initSubjects, deanControlSubjectsState.loading]);

  const createSubject = useCallback((onSuccess: () => void)  => {
    dispatch(createSubjectActionCreator({
      authToken: authToken,
      name: deanControlSubjectsState.name,
      description: deanControlSubjectsState.description,
      onSuccess: onSuccess
    }));
  }, [
    dispatch, 
    authToken, 
    deanControlSubjectsState.name, 
    deanControlSubjectsState.description
  ]);

  const setDataAndGoToClassGroups = useCallback((value: SubjectInfo)=>{
    dispatch(setSelectedSubjectActionCreator({
      value: value,
      onSuccess: goToClassGroups
    }));
  },[dispatch,setSelectedSubjectActionCreator, goToClassGroups])

  return (
      <ControlSubjectsView 
        setSearchText={setSearchText}
        setDescription={setDescription}
        createSubject={createSubject}
        setName={setName}
        goClassGroups={setDataAndGoToClassGroups}
        filteredSubjects={filteredSubjects}
        clearAllErrors={clearAllErrors}
        goToWorkshop={goToWorkshop}
        deanControlSubjectsState={deanControlSubjectsState}
        />
    );
});
