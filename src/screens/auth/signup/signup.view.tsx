import { FC, memo } from 'react';
import { SingupState } from '../../../store/reducers/auth/singup-slice';
import { Input } from '../../../ui-kit/input';
import { Spacing } from '../../../ui-kit/spacing';
import logoTracker from '../../../images/Logo.svg'
import { AuthWrapper, StyledLogo } from './signup.styled';
import { Button } from '../../../ui-kit/button';
import { Text } from '../../../ui-kit/text';
import { Link } from '../../../ui-kit/link';
import { theme } from '../../../ui-kit/themes/theme';
import { ItemOfSelectType, Select } from '../../../ui-kit/select/select';

const data = [
  {
    name: 'Преподаватель',
    value: 'TEACHER',
  },
  {
    name: 'Декан',
    value: 'DEAN',
  },
  {
    name: 'Администратор',
    value: 'ADMIN',
  }
]

export type SignupViewProps = {
  setKey: (login: string) => void;
  setLogin: (key: string) => void;
  setPassword: (password: string) => void;
  setConfirmPassword: (confirmPassword: string) => void;
  onSignup: () => void;
  goToLogInUser: () => void;
  setRole: (role: ItemOfSelectType) => void;
  goToLogInParent: () => void;
  setNameUniversity: (nameUniversity: string) => void;
  signupState: SingupState;
  setName: (key: string) => void;
  setLastname: (key: string) => void;
  setSurname: (key: string) => void;
};

export const SignupView: FC<SignupViewProps> = memo(({
  setKey, 
  setLogin, 
  setNameUniversity, 
  setPassword, 
  goToLogInUser,
  setName,
  setLastname,
  setRole,
  setSurname,
  goToLogInParent,
  setConfirmPassword, 
  onSignup, 
  signupState
}) => {

  return (
    <AuthWrapper>
      <StyledLogo src={logoTracker}/>
      <Spacing variant='Column' themeSpace={35}/>
      <Select header='Выберите роль' items={data} selectedItem={signupState.role} setValue={setRole}/>
      <Spacing variant='Column' themeSpace={30}/>
      {signupState.role.value === 'ADMIN' ? (<>
        <Input 
          header='Введите название университета' 
          placeholder='Белоруccкий....' error={signupState.errors['nameUniversityError']}
          value={signupState.nameUniversity} setValue={setNameUniversity}/>
      </>) : (
        <Input 
          header='Введите ключ' 
          placeholder='3fac%...' error={signupState.errors['keyError']}
          value={signupState.key} setValue={setKey}/>
        )}
      <Spacing variant='Column' themeSpace={30}/>
      <Input 
        header='Введите электроную почту' 
        placeholder='ivanov@gmail.com' error={signupState.errors['loginError']}
        value={signupState.login} setValue={setLogin}/>
      <Spacing variant='Column' themeSpace={30}/>
      <Input 
        header='Введите фамилию' 
        placeholder='Иванов' error={signupState.errors['lastnameError']}
        value={signupState.lastname} setValue={setLastname}/>
      <Spacing variant='Column' themeSpace={30}/>
      <Input 
        header='Введите имя' 
        placeholder='Иван' error={signupState.errors['nameError']}
        value={signupState.name} setValue={setName}/>
      <Spacing variant='Column' themeSpace={30}/>
      <Input 
        header='Введите отчество' 
        placeholder='Иванович' error={signupState.errors['surnamenameError']}
        value={signupState.surname} setValue={setSurname}/>
      <Spacing variant='Column' themeSpace={30}/>
      <Input 
        header='Придумайте пароль' 
        placeholder='********' 
        type='password' error={signupState.errors['passwordError']}
        value={signupState.password} setValue={setPassword}/>
      <Spacing variant='Column' themeSpace={30}/>
      <Input 
        header='Подтвердите пароль' 
        placeholder='********' 
        type='password' error={signupState.errors['confirmPasswordError']}
        value={signupState.confirmPassword} setValue={setConfirmPassword}/>
      <Spacing variant='Column' themeSpace={30}/>
      <Button onClick={onSignup} variant='primary' padding={[12,17]}>
        Зарегестрироваться
      </Button>
      <Spacing variant='Column' themeSpace={30}/>
      <Link onClick={goToLogInUser}>
        <Text themeFont={theme.fonts.ht2} themeColor={theme.colors.gray}>
          Войти в аккаунт
        </Text>
      </Link>
      <Spacing variant='Column' themeSpace={15}/>
      <Link onClick={goToLogInParent}>
        <Text themeFont={theme.fonts.ht2} themeColor={theme.colors.gray}>
          Родительский аккаунт
        </Text>
      </Link>
      <Spacing variant='Column' themeSpace={15}/>
    </AuthWrapper>
  );
});