import { FC, memo, useCallback, useEffect, useRef } from 'react';
import { ChangePasswordProps } from './change-password.props';
import { ChangePasswordView } from './change-password.view';
import { useUser } from '../../../../../hooks/user-hook';
import { useProfile } from '../profile/profile.props';
import { useAppDispatch, useTypedSelector } from '../../../../../hooks/use-typed-selector';
import { changePasswordActionCreator, changePasswordSlice } from '../../../../../store/reducers/profile/change-password-slice';

export const ChangePassword: FC<ChangePasswordProps> = memo(() => {
  const {user, authToken} = useUser();
  const changePasswordState = useTypedSelector(state => state.changePassword);

  const goToProfile = useProfile();

  const { 
    setConfirmPasswordActionCreater,
    setNewPasswordActionCreater,
    setOldPasswordActionCreater,
    reset
  } = changePasswordSlice.actions;

  const dispatch = useAppDispatch();

  const setConfirmPassword = useCallback((value: string) => {
    dispatch(setConfirmPasswordActionCreater(value));
  }, [dispatch, setConfirmPasswordActionCreater]);

  const setNewPassword = useCallback((value: string) => {
    dispatch(setNewPasswordActionCreater(value));
  }, [dispatch, setNewPasswordActionCreater]);

  const setOldPassword = useCallback((value: string) => {
    dispatch(setOldPasswordActionCreater(value));
  }, [dispatch, setOldPasswordActionCreater]);

  const onSave = useCallback(() => {
    dispatch(changePasswordActionCreator({
      newPassword: changePasswordState.newPassword,
      oldPassword: changePasswordState.oldPassword,
      authToken: authToken,
      confirmPassword: changePasswordState.confirmPassword,
      onSuccess: goToProfile
    }));
  },[
    dispatch,
    changePasswordState.newPassword,
    changePasswordState.oldPassword,
    changePasswordState.confirmPassword,
    authToken,
    goToProfile
  ]);

  const isInizialized = useRef(true);

  useEffect(() => {
    if (isInizialized.current) {
      isInizialized.current = false;
      console.log('set');
    } else return () => {
      console.log('cleared');
      dispatch(reset());
    };
  }, [dispatch,reset]);

  return (
      <ChangePasswordView 
        changePasswordState={changePasswordState}
        goToProfile={goToProfile}
        user={user}
        onSave={onSave}
        setConfirmPassword={setConfirmPassword}
        setNewPassword={setNewPassword}
        setOldPassword={setOldPassword}
        />
    );
});
