
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
import { Select } from '../../../ui-kit/select';
import { ItemOfSelectType } from '../../../ui-kit/select/select';

const roles = [
  {
    name: 'Преподаватель',
    value: 'teacher'
  },
  {
    name: 'Студент',
    value: 'student'
  },
  {
    name: 'Родитель',
    value: 'parent'
  },
  {
    name: 'Деканат',
    value: 'dean'
  },
  {
    name: 'Администратор',
    value: 'admin'
  },
]

export type LoginViewProps = {
  setRole: (role: ItemOfSelectType) => void;
  setLogin: (login: string) => void;
  setParentKey: (parentKey: string) => void;
  setPassword: (password: string) => void;
  onLogin: () => void;
  goToSignUpUser: () => void;
  goToSignUpAdmin: () => void;
  loginState: LoginState;
};

export const LoginView: FC<LoginViewProps> = memo(({
  setRole, 
  setLogin, 
  setParentKey, 
  setPassword, 
  onLogin, 
  loginState, 
  goToSignUpUser, 
  goToSignUpAdmin
}) => {

  

  return (
    <AuthWrapper>
      <StyledLogo src={logoTracker}/>
      <Spacing variant='Column' themeSpace={35}/>
      <Select header='Выберите роль' items={roles} selectedItem={loginState.role} setValue={setRole}/>
      <Spacing variant='Column' themeSpace={25}/>
      {
        loginState.role.value === 'parent' ? 
        (<>
          <Input 
            header='Родительский код' 
            placeholder='3fac%...' error={loginState.errors.parentKeyError}
            value={loginState.parentKey} setValue={setParentKey}/>
          <Spacing variant='Column' themeSpace={25}/>
        </>) : (<>
          <Input 
            header='Логин' 
            placeholder='Nikola...' error={loginState.errors.loginError}
            value={loginState.login} setValue={setLogin}/>
          <Spacing variant='Column' themeSpace={25}/>
          <Input 
            header='Пароль' 
            placeholder='********' 
            type='password' error={loginState.errors.passwordError}
            value={loginState.password} setValue={setPassword}/>
        </>)
      }
      <Spacing variant='Column' themeSpace={35}/>
      <Button state={loginState.loading} onClick={onLogin} variant='primary' padding={[10,17]}>
        Войти в аккаунт
      </Button>
      <Spacing variant='Column' themeSpace={30}/>
      <Link onClick={goToSignUpUser}>
        <Text themeFont={theme.fonts.ht2} themeColor={theme.colors.gray}>
          Зарегестрироваться
        </Text>
      </Link>
      <Spacing variant='Column' themeSpace={15}/>
      <Link onClick={goToSignUpAdmin}>
        <Text themeFont={theme.fonts.ht2} themeColor={theme.colors.gray}>
          Создать университет
        </Text>
      </Link>
    </AuthWrapper>
  );
});