import { FC, memo, useCallback, useEffect, useRef } from 'react';
import { ChangeAccoundDataProps } from './change-accound-data.props';
import { ChangeAccoundDataView } from './change-accound-data.view';
import { useUser } from '../../../../../hooks/user-hook';
import { useProfile } from '../profile/profile.props';
import { useAppDispatch, useTypedSelector } from '../../../../../hooks/use-typed-selector';
import { changeAccountDataActionCreator, changeAccountDataSlice } from '../../../../../store/reducers/profile/change-account-data-slice';

export const ChangeAccoundData: FC<ChangeAccoundDataProps> = memo(() => {
  const {user, authToken} = useUser();
  const changeAccountDataState = useTypedSelector(state => state.changeAccountData);
  
  const goToProfile = useProfile();

  const { 
    setNameActionCreater,
    setLastnameActionCreater,
    setSurnameActionCreater,
    reset
  } = changeAccountDataSlice.actions;

  const dispatch = useAppDispatch();

  const setName = useCallback((value: string) => {
    dispatch(setNameActionCreater(value));
  }, [dispatch, setNameActionCreater]);

  const setLastname = useCallback((value: string) => {
    dispatch(setLastnameActionCreater(value));
  }, [dispatch, setLastnameActionCreater]);

  const setSurname = useCallback((value: string) => {
    dispatch(setSurnameActionCreater(value));
  }, [dispatch, setSurnameActionCreater]);

  const onSave = useCallback(() => {
    dispatch(changeAccountDataActionCreator({
      lastname: changeAccountDataState.lastname,
      name: changeAccountDataState.name,
      surname: changeAccountDataState.surname,
      authToken: authToken,
      onSuccess: goToProfile
    }))
  },[
      dispatch,
      goToProfile,
      authToken,
      changeAccountDataState.lastname,
      changeAccountDataState.name,
      changeAccountDataState.surname
  ]);

  const isInizialized = useRef(true);

  useEffect(() => {
    if (isInizialized.current) {
      isInizialized.current = false;
      setName(user.name);
      setLastname(user.lastname);
      setSurname(user.surname);
    } else return () => {
      dispatch(reset());
    };
  }, [
    dispatch,
    setName,
    setLastname,
    setSurname,
    reset,
    user.name,
    user.lastname,
    user.surname
  ]);
  
  return (
      <ChangeAccoundDataView 
      changeAccountDataState={changeAccountDataState}
        user={user}
        onSave={onSave}
        goToProfile={goToProfile}
        setLastname={setLastname}
        setName={setName}
        setSurname={setSurname}
        />
    );
});
