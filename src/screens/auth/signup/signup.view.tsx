
import { FC, memo } from 'react';
import { SingupState } from '../../../store/reducers/auth/singup-slice';
import { Column } from '../../../ui-kit/column';
import { Input } from '../../../ui-kit/input';
import { Spacing } from '../../../ui-kit/spacing';
import { Image } from '../../../ui-kit/image';
import logoTracker from '../../../images/Logo.svg'
import { AuthWrapper, StyledLogo } from './signup.styled';
import { Button } from '../../../ui-kit/button';
import { Text } from '../../../ui-kit/text';
import { Link } from '../../../ui-kit/link';
import { theme } from '../../../ui-kit/themes/theme';

export type SignupViewProps = {
  setKey: (login: string) => void;
  setLogin: (key: string) => void;
  setPassword: (password: string) => void;
  setConfirmPassword: (confirmPassword: string) => void;
  onSignup: () => void;
  goToLogin: () => void;
  setNameUniversity: (nameUniversity: string) => void;
  signupState: SingupState;
  onChangeSignUpType: () => void;
  typeOfSignup: 'admin' | 'user';
};

export const SignupView: FC<SignupViewProps> = memo(({
  setKey, 
  setLogin, 
  setNameUniversity, 
  setPassword, 
  goToLogin,
  setConfirmPassword, 
  onSignup, 
  onChangeSignUpType,
  signupState,
  typeOfSignup
}) => {

  return (
    <AuthWrapper>
      <StyledLogo src={logoTracker}/>
      <Spacing variant='Column' themeSpace={35}/>
      {typeOfSignup === 'admin' && 
        <Input 
        header='Введите название университета' 
        placeholder='Белоруccкий....' error={signupState.errors.nameUniversityError}
        value={signupState.nameUniversity} setValue={setNameUniversity}/>}
      {typeOfSignup === 'user' && 
        <Input 
        header='Введите ключ' 
        placeholder='3fac%...' error={signupState.errors.keyError}
        value={signupState.key} setValue={setKey}/>}
      <Spacing variant='Column' themeSpace={25}/>
      <Input 
        header='Придумайте логин для входа' 
        placeholder='Nikola...' error={signupState.errors.loginError}
        value={signupState.login} setValue={setLogin}/>
      <Spacing variant='Column' themeSpace={25}/>
      <Input 
        header='Придумайте пароль' 
        placeholder='********' 
        type='password' error={signupState.errors.passwordError}
        value={signupState.password} setValue={setPassword}/>
      <Spacing variant='Column' themeSpace={25}/>
      <Input 
        header='Подтвердите пароль' 
        placeholder='********' 
        type='password' error={signupState.errors.confirmPasswordError}
        value={signupState.confirmPassword} setValue={setConfirmPassword}/>
      <Spacing variant='Column' themeSpace={30}/>
      <Button onClick={onSignup} variant='primary' padding={[10,17]}>
        {typeOfSignup === 'admin' ? 'Создать университет' : 'Зарегестрироваться'}
      </Button>
      <Spacing variant='Column' themeSpace={30}/>
      <Link onClick={goToLogin}>
        <Text themeFont={theme.fonts.ht2} themeColor={theme.colors.gray}>
          Войти в аккаунт
        </Text>
      </Link>
      <Spacing variant='Column' themeSpace={15}/>
      <Link onClick={onChangeSignUpType}>
        <Text themeFont={theme.fonts.ht2} themeColor={theme.colors.gray}>
          {typeOfSignup === 'admin' ? 'Зарегестрироваться' : 'Создать университет'}
        </Text>
      </Link>
    </AuthWrapper>
  );
});