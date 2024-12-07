
import { FC, memo } from 'react';
import { useMediaQuery } from 'react-responsive';
import { WrapperMobile } from '../../../../../components/wrapper-mobile';
import { WrapperDesktop } from '../../../../../components/wrapper-desktop';
import { theme } from '../../../../../ui-kit/themes/theme';
import { UserData } from '../../../../../store/reducers/user-slice';
import { Surface } from '../../../../../ui-kit/surface';
import { Column } from '../../../../../ui-kit/column';
import { Input } from '../../../../../ui-kit/input';
import { Row } from '../../../../../ui-kit/row';
import { Spacing } from '../../../../../ui-kit/spacing';
import { Button } from '../../../../../ui-kit/button';
import { ChangePasswordState } from '../../../../../store/reducers/profile/change-password-slice';

export type ChangePasswordViewProps = {
  user: UserData;
  goToProfile: () => void;
  changePasswordState: ChangePasswordState;
  setConfirmPassword: (value: string) => void;
  setNewPassword: (value: string) => void;
  setOldPassword: (value: string) => void;
  onSave: () => void;
};

export const ChangePasswordView: FC<ChangePasswordViewProps> = memo(({
  user,
  changePasswordState,
  goToProfile,
  setConfirmPassword,
  setNewPassword,
  onSave,
  setOldPassword
}) => {
  const isMobile = useMediaQuery({maxWidth: theme.toMobileSize});

  return (
    isMobile ? 
      (<ChangePasswordMobileView
        setConfirmPassword={setConfirmPassword}
        setNewPassword={setNewPassword}
        onSave={onSave}
        setOldPassword={setOldPassword}
        changePasswordState={changePasswordState}
        goToProfile={goToProfile}
        user={user}
        />) :
      (<ChangePasswordDesktopView
        setConfirmPassword={setConfirmPassword}
        setNewPassword={setNewPassword}
        onSave={onSave}
        setOldPassword={setOldPassword}
        changePasswordState={changePasswordState}
        goToProfile={goToProfile}
        user={user}
        />)
  );
});


export const ChangePasswordMobileView: FC<ChangePasswordViewProps> = memo(({
  user,
  goToProfile,
  changePasswordState,
  setConfirmPassword,
  setNewPassword,
  setOldPassword,
  onSave
}) => {

  return (
    <WrapperMobile onBack={goToProfile} role={user.role} header='Сменить пароль'>
      <Column horizontalAlign='center'>
          <Input 
            header='Старый пароль' 
            placeholder='********' 
            error={changePasswordState.errors['oldPasswordError']}
            type='password'
            value={changePasswordState.oldPassword} setValue={setOldPassword}/>
          <Spacing variant='Column' themeSpace={30}/>
          <Input 
            header='Новый пароль' 
            placeholder='********' type='password'
            error={changePasswordState.errors['newPasswordError']}
            value={changePasswordState.newPassword} setValue={setNewPassword}/>
          <Spacing variant='Column' themeSpace={30}/>
          <Input 
            header='Подтвердите пароль' 
            placeholder='********' type='password'
            error={changePasswordState.errors['confirmPasswordError']}
            value={changePasswordState.confirmPassword} setValue={setConfirmPassword}/>
          <Spacing variant='Column' themeSpace={40}/>
          <Row>
            <Button onClick={onSave} state={changePasswordState.loading} variant='recomended' padding={[12,17]}>
              Сохранить
            </Button>
            <Spacing variant='Row' themeSpace={20}/>
            <Button onClick={goToProfile} state={'idle'} variant='attentive' padding={[12,17]}>
              Отмена
            </Button>
          </Row>
        </Column>
    </WrapperMobile>
  );
});

export const ChangePasswordDesktopView: FC<ChangePasswordViewProps> = memo(({
  user,
  goToProfile,
  changePasswordState,
  setConfirmPassword,
  setNewPassword,
  setOldPassword,
  onSave
}) => {

  return (
    <WrapperDesktop onBack={goToProfile} isCenter={true} role={user.role} header='Сменить пароль'>
      <Surface padding='40px' style={{width: 'auto'}}>
        <Column horizontalAlign='center' style={{width: 440}}>
          <Input 
            header='Старый пароль' 
            placeholder='********' 
            error={changePasswordState.errors['oldPasswordError']}
            type='password'
            value={changePasswordState.oldPassword} setValue={setOldPassword}/>
          <Spacing variant='Column' themeSpace={30}/>
          <Input 
            header='Новый пароль' 
            placeholder='********' type='password'
            error={changePasswordState.errors['newPasswordError']}
            value={changePasswordState.newPassword} setValue={setNewPassword}/>
          <Spacing variant='Column' themeSpace={30}/>
          <Input 
            header='Подтвердите пароль' 
            placeholder='********' type='password'
            error={changePasswordState.errors['confirmPasswordError']}
            value={changePasswordState.confirmPassword} setValue={setConfirmPassword}/>
          <Spacing variant='Column' themeSpace={40}/>
          <Row>
            <Button onClick={onSave} state={changePasswordState.loading} variant='recomended' padding={[12,17]}>
              Сохранить
            </Button>
            <Spacing variant='Row' themeSpace={20}/>
            <Button onClick={goToProfile} state={'idle'} variant='attentive' padding={[12,17]}>
              Отмена
            </Button>
          </Row>
        </Column>
      </Surface>
    </WrapperDesktop>
  );
});