
import { FC, memo } from 'react';
import { useMediaQuery } from 'react-responsive';
import { WrapperMobile } from '../../../../../components/wrapper-mobile';
import { WrapperDesktop } from '../../../../../components/wrapper-desktop';
import { theme } from '../../../../../ui-kit/themes/theme';
import { UserData } from '../../../../../store/reducers/user-slice';
import { Surface } from '../../../../../ui-kit/surface';
import { Column } from '../../../../../ui-kit/column';
import { Input } from '../../../../../ui-kit/input';
import { Spacing } from '../../../../../ui-kit/spacing';
import { Row } from '../../../../../ui-kit/row';
import { Button } from '../../../../../ui-kit/button';
import { ChangeLoginState } from '../../../../../store/reducers/profile/change-login-slice';

export type ChangeLoginViewProps = {
  user: UserData;
  goToProfile: () => void;
  changeLoginState: ChangeLoginState;
  setNewLogin: (value: string) => void;
  setOldLogin: (value: string) => void;
  onSave: () => void;
};

export const ChangeLoginView: FC<ChangeLoginViewProps> = memo(({
  user,
  changeLoginState,
  setNewLogin,
  setOldLogin,
  onSave,
  goToProfile
}) => {
  const isMobile = useMediaQuery({maxWidth: theme.toMobileSize});

  return (
    isMobile ? 
      (<ChangeLoginMobileView
        changeLoginState={changeLoginState}
        goToProfile={goToProfile}
        setNewLogin={setNewLogin}
        onSave={onSave}
        setOldLogin={setOldLogin}
        user={user}
        />) :
      (<ChangeLoginDesktopView
        changeLoginState={changeLoginState}
        goToProfile={goToProfile}
        onSave={onSave}
        setNewLogin={setNewLogin}
        setOldLogin={setOldLogin}
        user={user}
        />)
  );
});


export const ChangeLoginMobileView: FC<ChangeLoginViewProps> = memo(({
  user,
  changeLoginState,
  setNewLogin,
  goToProfile,
  onSave
}) => {

  return (
    <WrapperMobile onBack={goToProfile} role={user.role} header='Сменить логин'>
      <Column horizontalAlign='center'>
          <Input 
            header='Старый логин' 
            disabled={true}
            value={user.login} setValue={() => {}}/>
          <Spacing variant='Column' themeSpace={30}/>
          <Input 
            header='Новый логин' 
            error={changeLoginState.errors['newLoginError']}
            placeholder='example@gmail.com'
            value={changeLoginState.newLogin} setValue={setNewLogin}/>
          <Spacing variant='Column' themeSpace={40}/>
          <Row>
            <Button onClick={onSave} state={changeLoginState.loading} variant='recomended' padding={[12,17]}>
              Сохранить
            </Button>
            <Spacing variant='Row' themeSpace={20}/>
            <Button onClick={goToProfile} state={'idle'} variant='attentive' padding={[12,17]}>
              Отмена
            </Button>
          </Row>
        </Column>
        <Spacing variant='Column' themeSpace={85} />
    </WrapperMobile>
  );
});

export const ChangeLoginDesktopView: FC<ChangeLoginViewProps> = memo(({
  user,
  changeLoginState,
  setNewLogin,
  goToProfile,
  onSave
}) => {

  return (
    <WrapperDesktop onBack={goToProfile} isCenter={true} role={user.role} header='Сменить логин'>
      <Surface padding='40px' style={{width: 'auto'}}>
        <Column horizontalAlign='center' style={{width: 440}}>
          <Input 
            header='Старый логин' 
            disabled={true}
            value={user.login} setValue={() => {}}/>
          <Spacing variant='Column' themeSpace={30}/>
          <Input 
            header='Новый логин' 
            error={changeLoginState.errors['newLoginError']}
            placeholder='example@gmail.com'
            value={changeLoginState.newLogin} setValue={setNewLogin}/>
          <Spacing variant='Column' themeSpace={40}/>
          <Row>
            <Button onClick={onSave} state={changeLoginState.loading} variant='recomended' padding={[12,17]}>
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