
import { FC, memo } from 'react';
import { useMediaQuery } from 'react-responsive';
import { WrapperMobile } from '../../../../../components/wrapper-mobile';
import { WrapperDesktop } from '../../../../../components/wrapper-desktop';
import { theme } from '../../../../../ui-kit/themes/theme';
import { UserData } from '../../../../../store/reducers/user-slice';
import { Surface } from '../../../../../ui-kit/surface';
import { Input } from '../../../../../ui-kit/input';
import { Spacing } from '../../../../../ui-kit/spacing';
import { Column } from '../../../../../ui-kit/column';
import { Row } from '../../../../../ui-kit/row';
import { Button } from '../../../../../ui-kit/button';
import { ChangeAccountDataState } from '../../../../../store/reducers/profile/change-account-data-slice';

export type ChangeAccoundDataViewProps = {
  user: UserData;
  goToProfile: () => void;
  setName: (value: string) => void;
  setLastname: (value: string) => void;
  setSurname: (value: string) => void;
  onSave: () => void;
  changeAccountDataState: ChangeAccountDataState;
};

export const ChangeAccoundDataView: FC<ChangeAccoundDataViewProps> = memo(({
  user,
  goToProfile,
  setLastname,
  setName,
  setSurname,
  onSave,
  changeAccountDataState
}) => {
  const isMobile = useMediaQuery({maxWidth: theme.toMobileSize});

  return (
    isMobile ? 
      (<ChangeAccoundDataMobileView
        user={user}
        setLastname={setLastname}
        setName={setName}
        onSave={onSave}
        setSurname={setSurname}
        changeAccountDataState={changeAccountDataState}
        goToProfile={goToProfile}
        />) :
      (<ChangeAccoundDataDesktopView
        user={user}
        setLastname={setLastname}
        setName={setName}
        onSave={onSave}
        setSurname={setSurname}
        changeAccountDataState={changeAccountDataState}
        goToProfile={goToProfile}
        />)
  );
});


export const ChangeAccoundDataMobileView: FC<ChangeAccoundDataViewProps> = memo(({
  user,
  changeAccountDataState,
  setLastname,
  setName,
  setSurname,
  goToProfile,
  onSave
}) => {

  return (
    <WrapperMobile onBack={goToProfile} role={user.role} header='Учётные данные'>
      <Column horizontalAlign='center'>
        <Input 
          header='Фамилия' 
          placeholder='Иванов' error={changeAccountDataState.errors['lastnameError']}
          value={changeAccountDataState.lastname} setValue={setLastname}/>
        <Spacing variant='Column' themeSpace={30}/>
        <Input 
          header='Имя' 
          placeholder='Иванов' error={changeAccountDataState.errors['nameError']}
          value={changeAccountDataState.name} setValue={setName}/>
        <Spacing variant='Column' themeSpace={30}/>
        <Input 
          header='Отчество' 
          placeholder='Иванов' error={changeAccountDataState.errors['surnameError']}
          value={changeAccountDataState.surname} setValue={setSurname}/>
        <Spacing variant='Column' themeSpace={40}/>
        <Row>
          <Button onClick={onSave} state={changeAccountDataState.loading} variant='recomended' padding={[12,17]}>
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

export const ChangeAccoundDataDesktopView: FC<ChangeAccoundDataViewProps> = memo(({
  user,
  changeAccountDataState,
  setLastname,
  setName,
  setSurname,
  goToProfile,
  onSave
}) => {

  return (
    <WrapperDesktop onBack={goToProfile} isCenter={true} role={user.role} header='Учётные данные'>
      <Surface padding='40px' style={{width: 'auto'}}>
        <Column horizontalAlign='center' style={{width: 440}}>
          <Input 
            header='Фамилия' 
            placeholder='Иванов' error={changeAccountDataState.errors['lastnameError']}
            value={changeAccountDataState.lastname} setValue={setLastname}/>
          <Spacing variant='Column' themeSpace={30}/>
          <Input 
            header='Имя' 
            placeholder='Иванов' error={changeAccountDataState.errors['nameError']}
            value={changeAccountDataState.name} setValue={setName}/>
          <Spacing variant='Column' themeSpace={30}/>
          <Input 
            header='Отчество' 
            placeholder='Иванов' error={changeAccountDataState.errors['surnameError']}
            value={changeAccountDataState.surname} setValue={setSurname}/>
          <Spacing variant='Column' themeSpace={40}/>
          <Row>
            <Button onClick={onSave} state={changeAccountDataState.loading} variant='recomended' padding={[12,17]}>
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