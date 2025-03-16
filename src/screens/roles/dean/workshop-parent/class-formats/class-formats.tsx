import { FC, memo, useCallback, useEffect, useRef, useState } from 'react';
import { ClassFormatsProps } from './class-formats.props';
import { ClassFormatsView } from './class-formats.view';
import { useDeanWorkshop } from '../workshop/workshop.props';
import { useAppDispatch, useTypedSelector } from '../../../../../hooks/use-typed-selector';
import { addClassFormatActionCreator, ClassFormatInfo, classFormatsSlice, deleteClassFormatActionCreator, initClassFormatsDataActionCreator, updateClassFormatActionCreator } from '../../../../../store/reducers/roles/dean/class-formats-slice';
import { useUser } from '../../../../../hooks/user-hook';

export const ClassFormats: FC<ClassFormatsProps> = memo(() => {
  const goToWorkshop = useDeanWorkshop();
  const deanClassFormatsState = useTypedSelector(state => state.deanClassFormats);
  
  const {authToken} = useUser();

  const { 
    setSelectedClassFormatActionCreator,
    setSearchTextActionCreator,
    setNewInfoOfClassFormatActionCreator,
    setNewNameOfClassFormatActionCreator,
    reset,
    clearErrors
  } = classFormatsSlice.actions;

  const dispatch = useAppDispatch();

  const isInizialized = useRef(true);

  const initClassFormats = useCallback(()=>{
    dispatch(initClassFormatsDataActionCreator({authToken: authToken}));
  },[dispatch, authToken])

  const clearAllErrors = useCallback(()=>{
    dispatch(clearErrors());
  },[dispatch, clearErrors])

  useEffect(() => {
    if (isInizialized.current) {
      isInizialized.current = false;
      initClassFormats();
    } 
    return () => {
      dispatch(reset());
    };
  }, [dispatch, reset, initClassFormats]);

  const setSearchTextAction = useCallback((value: string) => {
    dispatch(setSearchTextActionCreator(value));
  }, [dispatch, setSearchTextActionCreator]);

  const setNewInfoOfClassFormat = useCallback((value: string) => {
    dispatch(setNewInfoOfClassFormatActionCreator(value));
  }, [dispatch, setNewInfoOfClassFormatActionCreator]);

  const setNewNameOfClassFormat = useCallback((value: string) => {
    dispatch(setNewNameOfClassFormatActionCreator(value));
  }, [dispatch, setNewNameOfClassFormatActionCreator]);

  const addClassFormat = useCallback((onSuccess?: () => void) => {
    dispatch(addClassFormatActionCreator({
      authToken: authToken,
      formatName: deanClassFormatsState.newNameOfClassFormat,
      description: deanClassFormatsState.newInfoOfClassFormat,
      onSuccess: onSuccess
    }));
  }, [
    dispatch, 
    deanClassFormatsState.newNameOfClassFormat,
    deanClassFormatsState.newInfoOfClassFormat,
    authToken
  ]);

  const deleteClassFormat = useCallback((onSuccess?: () => void) => {
    dispatch(deleteClassFormatActionCreator({
      authToken: authToken,
      id: deanClassFormatsState.selectedClassFormat.idClassFormat,
      onSuccess: onSuccess
    }));
  }, [
    dispatch, 
    deanClassFormatsState.selectedClassFormat.idClassFormat,
    authToken
  ]);

  const updateClassFormat = useCallback((onSuccess?: () => void) => {
    dispatch(updateClassFormatActionCreator({
      authToken: authToken,
      id: deanClassFormatsState.selectedClassFormat.idClassFormat,
      formatName: deanClassFormatsState.newNameOfClassFormat,
      description: deanClassFormatsState.newInfoOfClassFormat,
      onSuccess: onSuccess
    }));
  }, [
    dispatch, 
    deanClassFormatsState.selectedClassFormat.idClassFormat,
    deanClassFormatsState.newNameOfClassFormat,
    deanClassFormatsState.newInfoOfClassFormat,
    authToken
  ]);

  const [filteredListFormats, setFilteredListFormats] = useState<ClassFormatInfo[]>([]);

  useEffect(() => {
    const trimmedSearchText = deanClassFormatsState.searchText.trim().toLowerCase();
  
    const filteredClassFormats = deanClassFormatsState.classFormats
      .filter(format => !trimmedSearchText || format.formatName.toLowerCase().includes(trimmedSearchText));
  
      setFilteredListFormats(filteredClassFormats);
  }, [deanClassFormatsState.searchText, deanClassFormatsState.classFormats]);

  const setSelectedClassFormat = useCallback((value: ClassFormatInfo) => {
    setNewNameOfClassFormat(value.formatName);
    setNewInfoOfClassFormat(value.description);
    dispatch(setSelectedClassFormatActionCreator(value));
  }, [
    dispatch, 
    setNewNameOfClassFormat, 
    setNewInfoOfClassFormat,
    setSelectedClassFormatActionCreator
  ]);

  return (
      <ClassFormatsView 
        updateClassFormat={updateClassFormat}
        deleteClassFormat={deleteClassFormat}
        addClassFormat={addClassFormat}
        clearAllErrors={clearAllErrors}
        filteredListFormats={filteredListFormats}
        setNewInfoOfClassFormat={setNewInfoOfClassFormat}
        setNewNameOfClassFormat={setNewNameOfClassFormat}
        setSearchTextAction={setSearchTextAction}
        setSelectedClassFormat={setSelectedClassFormat}
        deanClassFormatsState={deanClassFormatsState}
        goToWorkshop={goToWorkshop}
        />
    );
});
