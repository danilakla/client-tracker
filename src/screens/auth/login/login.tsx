import { FC, memo, useCallback } from 'react';
import { LoginProps, useLogInParent, useLogInUser } from './login.props';
import { LoginView } from './login.view';
import { useAppDispatch, useTypedSelector } from '../../../hooks/use-typed-selector';
import { loginUserActionCreator, loginSlice, loginParentActionCreator } from '../../../store/reducers/auth/login-slice';
import { useSignUpAdmin, useSignUpUser } from '../signup/signup.props';
import { useNavigate } from 'react-router-dom';

export const Login: FC<LoginProps> = memo(({typeOfLogin}) => {
  const loginState = useTypedSelector(state => state.login);
  
  const { 
    setParentKeyActionCreater, 
    setLoginActionCreater,
    setPasswordActionCreater,
    reset
  } = loginSlice.actions;

  const dispatch = useAppDispatch();

  const setLogin = useCallback((login: string) => {
    dispatch(setLoginActionCreater(login));
  }, [dispatch, setLoginActionCreater]);

  const setParentKey = useCallback((parentKey: string) => {
    dispatch(setParentKeyActionCreater(parentKey));
  }, [dispatch, setParentKeyActionCreater]);

  const setPassword = useCallback((password: string) => {
      dispatch(setPasswordActionCreater(password));
  }, [dispatch, setPasswordActionCreater])

  const navigate = useNavigate();

  const onLogin = useCallback(() => {
    switch(typeOfLogin){
      case 'parent':
        dispatch(loginParentActionCreator({
          token: loginState.parentKey,
          onSuccess: () => navigate('/')
        }));
        break;
      default:
        dispatch(loginUserActionCreator({
          login: loginState.login,
          password: loginState.password,
          onSuccess: () => navigate('/')
        }));
    }
  }, [
    dispatch, 
    typeOfLogin, 
    loginState.password, 
    loginState.login, 
    navigate,
    loginState.parentKey])

  const goToSignUpUser = useSignUpUser();
  const goToSignUpAdmin = useSignUpAdmin();
  const goToLogInUser= useLogInUser();
  const goToLogInParent= useLogInParent();

  const goToSignUpUserAndReset = useCallback(() => {
    goToSignUpUser();
    dispatch(reset());
  },[dispatch, goToSignUpUser, reset]);

  const goToSignUpAdminAndReset = useCallback(() => {
    goToSignUpAdmin();
    dispatch(reset());
  },[dispatch, goToSignUpAdmin, reset]);

  const onChangeLogInType = useCallback(() => {
    dispatch(reset());
    switch(typeOfLogin){
      case 'other':
        goToLogInParent(); 
        break;
      case 'parent':
        goToLogInUser(); 
        break;
      default:
        goToLogInUser(); 
    }
  },[typeOfLogin, goToLogInParent, reset, goToLogInUser, dispatch]) 

  return (
      <LoginView 
        onChangeLogInType={onChangeLogInType}
        onLogin={onLogin} 
        loginState={loginState} 
        setPassword={setPassword} 
        setLogin={setLogin}
        typeOfLogin={typeOfLogin}
        goToSignUpAdmin={goToSignUpAdminAndReset}
        goToSignUpUser={goToSignUpUserAndReset}
        setParentKey={setParentKey}
        />
    );
});
