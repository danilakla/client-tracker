import { FC, memo, useCallback } from 'react';
import { LoginProps } from './login.props';
import { LoginView } from './login.view';
import { useAppDispatch, useTypedSelector } from '../../../hooks/use-typed-selector';
import { loginActionCreator, loginSlice } from '../../../store/reducers/auth/login-slice';
import { useSignUpAdmin, useSignUpUser } from '../signup/signup.props';
import { ItemOfSelectType } from '../../../ui-kit/select/select';
import { useNavigate } from 'react-router-dom';

export const Login: FC<LoginProps> = memo(() => {
  const loginState = useTypedSelector(state => state.login);
  
  const { 
    setParentKeyActionCreater, 
    setLoginActionCreater,
    setPasswordActionCreater,
    setRoleActionCreater,
    reset
  } = loginSlice.actions;

  const dispatch = useAppDispatch();

  const setLogin = useCallback((login: string) => {
    dispatch(setLoginActionCreater(login));
  }, [dispatch, setLoginActionCreater]);

  const setRole = useCallback((role: ItemOfSelectType) => {
    dispatch(setRoleActionCreater(role));
    dispatch(reset());
  }, [dispatch, reset,setRoleActionCreater]);

  const setParentKey = useCallback((parentKey: string) => {
    dispatch(setParentKeyActionCreater(parentKey));
  }, [dispatch, setParentKeyActionCreater]);

  const setPassword = useCallback((password: string) => {
      dispatch(setPasswordActionCreater(password));
  }, [dispatch, setPasswordActionCreater])

  const navigate = useNavigate();

  const onLogin = useCallback(() => {
    dispatch(loginActionCreator({
      login: loginState.login,
      password: loginState.password,
      onSuccess: () => navigate('/')
    }));
  }, [dispatch, loginState.password, loginState.login, navigate])

  const goToSignUpUser = useSignUpUser();
  const goToSignUpAdmin = useSignUpAdmin();

  const goToSignUpUserAndReset = useCallback(() => {
    goToSignUpUser();
    reset();
  },[goToSignUpUser, reset]);

  const goToSignUpAdminAndReset = useCallback(() => {
    goToSignUpAdmin();
    reset();
  },[goToSignUpAdmin, reset]);

  return (
      <LoginView 
        onLogin={onLogin} 
        loginState={loginState} 
        setPassword={setPassword} 
        setLogin={setLogin}
        goToSignUpAdmin={goToSignUpAdminAndReset}
        goToSignUpUser={goToSignUpUserAndReset}
        setParentKey={setParentKey}
        setRole={setRole}/>
    );
});
