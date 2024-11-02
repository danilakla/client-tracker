import { FC, memo, useCallback } from 'react';
import { SignupProps } from './signup.props';
import { SignupView } from './signup.view';
import { signUpActionCreator, signUpAdminAndCreateUniversityActionCreator, singupSlice } from '../../../store/reducers/auth/singup-slice';
import { useAppDispatch, useTypedSelector } from '../../../hooks/use-typed-selector';
import { useLogInParent, useLogInUser } from '../login/login.props';
import { ItemOfSelectType } from '../../../ui-kit/select/select';
import { useNavigate } from 'react-router-dom';

export const Signup: FC<SignupProps> = memo(({
}) => {

  const signupState = useTypedSelector(state => state.singup);

  const { 
    setKeyActionCreater, 
    setLoginActionCreater, 
    setPasswordActionCreater,
    setConfirmPasswordActionCreater,
    setNameUniversityActionCreater,
    setNameActionCreater,
    setRoleActionCreater,
    setLastnameActionCreater,
    setSurnameActionCreater,
    reset
  } = singupSlice.actions;

  const dispatch = useAppDispatch();

  const setKey = useCallback((login: string) => {
    dispatch(setKeyActionCreater(login));
  }, [dispatch, setKeyActionCreater]);

  const  setNameUniversity = useCallback((nameUniversity: string) => {
    dispatch(setNameUniversityActionCreater(nameUniversity));
  }, [dispatch, setNameUniversityActionCreater]);

  const setLogin = useCallback((login: string) => {
    dispatch(setLoginActionCreater(login));
  }, [dispatch, setLoginActionCreater]);

  const setName = useCallback((name: string) => {
    dispatch(setNameActionCreater(name));
  }, [dispatch, setNameActionCreater]);

  const setLastname = useCallback((lastname: string) => {
    dispatch(setLastnameActionCreater(lastname));
  }, [dispatch, setLastnameActionCreater]);

  const setSurname = useCallback((surname: string) => {
    dispatch(setSurnameActionCreater(surname));
  }, [dispatch, setSurnameActionCreater]);

  const setPassword = useCallback((password: string) => {
      dispatch(setPasswordActionCreater(password));
  }, [dispatch, setPasswordActionCreater])

  const setRole = useCallback((role: ItemOfSelectType) => {
    dispatch(reset());
    dispatch(setRoleActionCreater(role));
  }, [dispatch, setRoleActionCreater, reset])

  const setConfirmPassword = useCallback((confirmPassword: string) => {
    dispatch(setConfirmPasswordActionCreater(confirmPassword));
  }, [dispatch, setConfirmPasswordActionCreater])

  const navigate = useNavigate();

  const onSignup = useCallback(() => {
    switch(signupState.role.value){
      case 'ADMIN':
        dispatch(signUpAdminAndCreateUniversityActionCreator({
            login: signupState.login, 
            password: signupState.password, 
            confirmPassword: signupState.confirmPassword,
            name: signupState.name, 
            role: signupState.role.value,
            lastname: signupState.lastname, 
            surname: signupState.surname,
            universityName: signupState.nameUniversity,
            onSuccess: () => navigate('/')
        }));
        break;
      default:
        dispatch(signUpActionCreator({
          login: signupState.login, 
          password: signupState.password, 
          key: signupState.key,
          confirmPassword: signupState.confirmPassword,
          name: signupState.name, 
          role: signupState.role.value,
          lastname: signupState.lastname, 
          surname: signupState.surname,
          onSuccess: () => navigate('/')
        }));
        break;
    }
  }, [
    dispatch,
    signupState.login,
    signupState.key, 
    signupState.password, 
    signupState.confirmPassword,
    signupState.name, 
    navigate,
    signupState.role.value,
    signupState.lastname, 
    signupState.surname,
    signupState.nameUniversity
  ])

  const goToLogInUser = useLogInUser();
  const goToLogInParent = useLogInParent();

  return (
      <SignupView 
        setLastname={setLastname}
        setSurname={setSurname}
        setName={setName}
        setRole={setRole}
        setNameUniversity={setNameUniversity}
        onSignup={onSignup}
        goToLogInUser={goToLogInUser}
        goToLogInParent={goToLogInParent}
        setKey={setKey} 
        setLogin={setLogin}
        setPassword={setPassword}
        setConfirmPassword={setConfirmPassword}
        signupState={signupState}/>
    );
});
