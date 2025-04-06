
import { FC, memo } from 'react';
import { Input } from '../../../ui-kit/input';
import { Spacing } from '../../../ui-kit/spacing';
import { Button } from '../../../ui-kit/button';
import { LoginState } from '../../../store/reducers/auth/login-slice';
import { AuthWrapper, StyledLogo } from './login.styled';
import logoTracker from '../../../images/Logo.svg'
import { Text } from '../../../ui-kit/text';
import { theme } from '../../../ui-kit/themes/theme';
import { Link } from '../../../ui-kit/link';

export type LoginViewProps = {
  setLogin: (login: string) => void;
  setParentKey: (parentKey: string) => void;
  setPassword: (password: string) => void;
  onLogin: () => void;
  onChangeLogInType: () => void;
  typeOfLogin: "parent" | "other";
  goToSignUpAndReset: () => void;
  loginState: LoginState;
};

export const LoginView: FC<LoginViewProps> = memo(({
  setLogin, 
  setParentKey, 
  setPassword, 
  onLogin, 
  onChangeLogInType,
  typeOfLogin,
  loginState, 
  goToSignUpAndReset
}) => {

  return (
    <AuthWrapper>
      <StyledLogo src={logoTracker}/>
      <Spacing variant='Column' themeSpace={35}/>
      {
        typeOfLogin === 'parent' ? 
        (<>
          <Input 
            header='Родительский код' 
            placeholder='3fac%...' error={loginState.errors["parentKeyError"]}
            value={loginState.parentKey} setValue={setParentKey}/>
        </>) : (<>
          <Input 
            header='Логин' 
            placeholder='Nikola...' error={loginState.errors["loginError"]}
            value={loginState.login} setValue={setLogin}/>
          <Spacing variant='Column' themeSpace={30}/>
          <Input 
            header='Пароль' 
            placeholder='********' 
            type='password' error={loginState.errors["passwordError"]}
            value={loginState.password} setValue={setPassword}/>
        </>)
      }
      <Spacing variant='Column' themeSpace={40}/>
      <Button state={loginState.loading} onClick={onLogin} variant='primary' padding={[12,17]}>
        Войти в аккаунт
      </Button>
      <Spacing variant='Column' themeSpace={30}/>
      <Link onClick={onChangeLogInType}>
        <Text themeFont={theme.fonts.ht2} themeColor={theme.colors.gray}>
          {typeOfLogin === 'other' ? 'Родительский аккаунт' : 'Войти в аккаунт'}
        </Text>
      </Link>
      <Spacing variant='Column' themeSpace={15}/>
      <Link onClick={goToSignUpAndReset}>
        <Text themeFont={theme.fonts.ht2} themeColor={theme.colors.gray}>
         Зарегистрироваться
        </Text>
      </Link>
    </AuthWrapper>
  );
});