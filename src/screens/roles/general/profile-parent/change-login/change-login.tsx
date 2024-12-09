import { FC, memo, useCallback, useEffect } from 'react';
import { ChangeLoginProps } from './change-login.props';
import { ChangeLoginView } from './change-login.view';
import { useUser } from '../../../../../hooks/user-hook';
import { useProfile } from '../profile/profile.props';
import { useAppDispatch, useTypedSelector } from '../../../../../hooks/use-typed-selector';
import { changeLoginActionCreator, changeLoginSlice } from '../../../../../store/reducers/profile/change-login-slice';

export const ChangeLogin: FC<ChangeLoginProps> = memo(() => {
  const {user, authToken} = useUser();
  const changeLoginState = useTypedSelector(state => state.changeLogin);

  const goToProfile = useProfile();

  const { 
    setNewLoginActionCreater,
    setOldLoginActionCreater,
    reset
  } = changeLoginSlice.actions;

  const dispatch = useAppDispatch();

  const setNewLogin = useCallback((value: string) => {
    dispatch(setNewLoginActionCreater(value));
  }, [dispatch, setNewLoginActionCreater]);

  const setOldLogin = useCallback((value: string) => {
    dispatch(setOldLoginActionCreater(value));
  }, [dispatch, setOldLoginActionCreater]);

  const onSave = useCallback(() => {
    dispatch(changeLoginActionCreator({
      authToken: authToken,
      newLogin: changeLoginState.newLogin,
      onSuccess: goToProfile
    }));
  },[dispatch, authToken, changeLoginState.newLogin, goToProfile])

  useEffect(() => {
    return () => {
      dispatch(reset());
    };
  }, [dispatch,reset]);
  
  return (
      <ChangeLoginView 
        goToProfile={goToProfile}
        onSave={onSave}
        setNewLogin={setNewLogin}
        setOldLogin={setOldLogin}
        changeLoginState={changeLoginState}
        user={user}
        />
    );
});
