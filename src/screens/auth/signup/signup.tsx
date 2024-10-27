import { FC, memo, useCallback } from 'react';
import { SignupProps, useSignUpAdmin, useSignUpUser } from './signup.props';
import { SignupView } from './signup.view';
import { singupSlice } from '../../../store/reducers/auth/singup-slice';
import { useAppDispatch, useTypedSelector } from '../../../hooks/use-typed-selector';
import { useLogin } from '../login/login.props';

export const Signup: FC<SignupProps> = memo(({
  typeOfSignup
}) => {

  const signupState = useTypedSelector(state => state.singup);

  const { 
    setKeyActionCreater, 
    setLoginActionCreater, 
    setPasswordActionCreater,
    setConfirmPasswordActionCreater,
    setNameUniversityActionCreater,
    reset
  } = singupSlice.actions;

  const dispatch = useAppDispatch();

  const setKey = useCallback((login: string) => {
    dispatch(setKeyActionCreater(login));
  }, [dispatch, setKeyActionCreater]);

  const  setNameUniversity = useCallback((nameUniversity: string) => {
    dispatch(setNameUniversityActionCreater(nameUniversity));
  }, [dispatch, setNameUniversityActionCreater]);

  const setLogin = useCallback((key: string) => {
    dispatch(setLoginActionCreater(key));
  }, [dispatch, setLoginActionCreater]);

  const setPassword = useCallback((password: string) => {
      dispatch(setPasswordActionCreater(password));
  }, [dispatch, setPasswordActionCreater])

  const setConfirmPassword = useCallback((confirmPassword: string) => {
    dispatch(setConfirmPasswordActionCreater(confirmPassword));
}, [dispatch, setConfirmPasswordActionCreater])

  const onSignup = useCallback(() => {
    switch(typeOfSignup){
      case 'admin':
    // dispatch(signupActionCreater(signupState.userName, signupState.password));

        break;
      case 'user':
    // dispatch(signupActionCreater(signupState.userName, signupState.password));

        break;
    }
  }, [typeOfSignup])

  const goToSignUpUser = useSignUpUser();
  const goToSignUpAdmin = useSignUpAdmin();
  const goToLogin = useLogin();

  const onChangeSignUpType = useCallback(() => {
    dispatch(reset());
    switch(typeOfSignup){
      case 'admin':
        goToSignUpUser(); 
        break;
      case 'user':
        goToSignUpAdmin(); 
        break;
      default:
        goToSignUpUser(); 
    }
  },[typeOfSignup, dispatch, reset, goToSignUpUser, goToSignUpAdmin]) 

  return (
      <SignupView 
        onChangeSignUpType={onChangeSignUpType}
        typeOfSignup={typeOfSignup}
        setNameUniversity={setNameUniversity}
        onSignup={onSignup}
        goToLogin={goToLogin}
        setKey={setKey} 
        setLogin={setLogin}
        setPassword={setPassword}
        setConfirmPassword={setConfirmPassword}
        signupState={signupState}/>
    );
});
