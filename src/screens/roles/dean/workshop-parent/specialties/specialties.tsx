import { FC, memo, useCallback, useEffect, useRef, useState } from 'react';
import { SpecialtiesProps } from './specialties.props';
import { SpecialtiesView } from './specialties.view';
import { useDeanWorkshop } from '../workshop/workshop.props';
import { useUser } from '../../../../../hooks/user-hook';
import { useAppDispatch, useTypedSelector } from '../../../../../hooks/use-typed-selector';
import { addSpecialtyActionCreator, deleteSpecialtyActionCreator, initSpecialtiesDataActionCreator, specialtiesSlice, SpecialtyInfo, updateSpecialtyActionCreator } from '../../../../../store/reducers/roles/dean/specialties-slice';

export const Specialties: FC<SpecialtiesProps> = memo(() => {
  const goToWorkshop = useDeanWorkshop();
  const deanSpecialtiesState = useTypedSelector(state => state.deanSpecialties);
  
  const {authToken} = useUser();

  const { 
    setSelectedSpecialtyActionCreator,
    setSearchTextActionCreator,
    setNewNameOfSpecialtyActionCreator,
    reset,
    clearErrors
  } = specialtiesSlice.actions;

  const dispatch = useAppDispatch();

  const isInizialized = useRef(true);

  const initSpecialties = useCallback(()=>{
    dispatch(initSpecialtiesDataActionCreator({authToken: authToken}));
  },[dispatch, authToken])

  const clearAllErrors = useCallback(()=>{
    dispatch(clearErrors());
  },[dispatch, clearErrors])

  useEffect(() => {
    if (isInizialized.current) {
      isInizialized.current = false;
      initSpecialties();
    } 
    
    return () => {
      dispatch(reset());
    };
  }, [dispatch, reset, initSpecialties]);

  const setSearchTextAction = useCallback((value: string) => {
    dispatch(setSearchTextActionCreator(value));
  }, [dispatch, setSearchTextActionCreator]);

  const setNewNameOfSpecialty = useCallback((value: string) => {
    dispatch(setNewNameOfSpecialtyActionCreator(value));
  }, [dispatch, setNewNameOfSpecialtyActionCreator]);

  const addSpecialtyAction = useCallback((onSuccess?: () => void) => {
    dispatch(addSpecialtyActionCreator({
      authToken: authToken,
      name: deanSpecialtiesState.newNameOfSpecialty,
      onSuccess: onSuccess
    }));
  }, [
    dispatch, 
    deanSpecialtiesState.newNameOfSpecialty,
    authToken
  ]);

  const deleteSpecialty = useCallback((onSuccess?: () => void) => {
    dispatch(deleteSpecialtyActionCreator({
      authToken: authToken,
      id: deanSpecialtiesState.selectedSpecialty.idSpecialty,
      onSuccess: onSuccess
    }));
  }, [
    dispatch, 
    deanSpecialtiesState.selectedSpecialty.idSpecialty,
    authToken
  ]);

  const updateSpecialty = useCallback((onSuccess?: () => void) => {
    dispatch(updateSpecialtyActionCreator({
      authToken: authToken,
      id: deanSpecialtiesState.selectedSpecialty.idSpecialty,
      name: deanSpecialtiesState.newNameOfSpecialty,
      onSuccess: onSuccess
    }));
  }, [
    dispatch, 
    deanSpecialtiesState.selectedSpecialty.idSpecialty,
    deanSpecialtiesState.newNameOfSpecialty,
    authToken
  ]);

  const [filteredSpecialities, setFilteredSpecialities] = useState<SpecialtyInfo[]>([]);

  useEffect(() => {
    const trimmedSearchText = deanSpecialtiesState.searchText.trim().toLowerCase();
  
    const newFilteredSpecialities = deanSpecialtiesState.specialties
      .filter(speciality => !trimmedSearchText || speciality.name.toLowerCase().includes(trimmedSearchText));
  
      setFilteredSpecialities(newFilteredSpecialities);
  }, [deanSpecialtiesState.searchText, deanSpecialtiesState.specialties]);

  const setSelectedSpecialty = useCallback((value: SpecialtyInfo) => {
    setNewNameOfSpecialty(value.name);
    dispatch(setSelectedSpecialtyActionCreator(value));
  }, [
    dispatch, 
    setNewNameOfSpecialty, 
    setSelectedSpecialtyActionCreator
  ]);

  return (
      <SpecialtiesView 
        goToWorkshop={goToWorkshop}
        updateSpecialty={updateSpecialty}
        deleteSpecialty={deleteSpecialty}
        addSpecialtyAction={addSpecialtyAction}
        clearAllErrors={clearAllErrors}
        filteredSpecialities={filteredSpecialities}
        setNewNameOfSpecialty={setNewNameOfSpecialty}
        setSearchTextAction={setSearchTextAction}
        setSelectedSpecialty={setSelectedSpecialty}
        deanSpecialtiesState={deanSpecialtiesState}
        />
    );
});
