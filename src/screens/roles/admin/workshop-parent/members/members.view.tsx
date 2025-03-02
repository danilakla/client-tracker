
import { FC, memo, useCallback, useState } from 'react';
import { useMediaQuery } from 'react-responsive';
import { WrapperMobile } from '../../../../../components/wrapper-mobile';
import { WrapperDesktop } from '../../../../../components/wrapper-desktop';
import { theme } from '../../../../../ui-kit/themes/theme';
import { GridContainer } from '../../../../../ui-kit/grid-container';
import { Column } from '../../../../../ui-kit/column';
import { ActionBlockButton } from '../../../../../ui-kit/action-block-button';
import { Search } from '../../../../../ui-kit/search';
import { Spacing } from '../../../../../ui-kit/spacing';
import { ActionButton } from '../../../../../ui-kit/action-button';
import { Toggle } from '../../../../../ui-kit/toggle';
import { Surface } from '../../../../../ui-kit/surface';
import { Row } from '../../../../../ui-kit/row';
import { Text } from '../../../../../ui-kit/text';
import { Button } from '../../../../../ui-kit/button';
import { DeanInfoState, MembersState, TeacherInfoState } from '../../../../../store/reducers/roles/admin/members-slice';
import { CircleLoading } from '../../../../../ui-kit/circle-loading';
import { Popup } from '../../../../../ui-kit/popup';
import accountLogoSVG from '../../../../../images/account-image.svg';
import { Textarea } from '../../../../../ui-kit/textarea';
import { Image } from '../../../../../ui-kit/image';
import { Select } from '../../../../../ui-kit/select';
import { ItemOfSelectType } from '../../../../../ui-kit/select/select';
import { ScreenContainer } from './members.styled';
import { ItemsContainerMobile } from '../../../dean/workshop-parent/subjects-parent/control-subjects/control-subjects.styled';

export type MembersViewProps = {
  goToWorkshop: () => void;
  setSelectedNewResponsible: (value: ItemOfSelectType) => void;
  setSearchText: (value: string) => void;
  adminMembersState: MembersState;
  setSelectedDean: (value: DeanInfoState) => void;
  onDelete: (toggle: 'left' | 'right', onSuccess?: () => void) => void;
  recoverPassword: (id: number, onSuccess: () => void) => void;
  setSelectedTeacher: (value: TeacherInfoState) => void;  
  filteredListDeans: DeanInfoState[] | undefined;
  clearErrors: () => void;
  filteredListTeachers: TeacherInfoState[] | undefined;
};

export const MembersView: FC<MembersViewProps> = memo(({
  goToWorkshop,
  adminMembersState,
  setSelectedDean,
  setSearchText,
  clearErrors, 
  setSelectedTeacher,
  filteredListDeans,
  setSelectedNewResponsible,
  onDelete,
  recoverPassword,
  filteredListTeachers
}) => {
  const isMobile = useMediaQuery({maxWidth: theme.toMobileSize});

  const [toggle, setToggle] = useState<"left" | "right">("left");
  const onClickToggle = useCallback(() => {
      setSearchText('');
      setToggle(toggle === "left" ? "right" : "left");
  }, [toggle,setSearchText]);


  const [currentScreen, setCurrentScreen] = useState<'members' | 'details'>('members');

  const openDescriptionDean = useCallback((item: DeanInfoState) => {
    setSelectedDean(item);
    setCurrentScreen('details');
  },[setSelectedDean])

  const openDescriptionTeacher = useCallback((item: TeacherInfoState) => {
    setSelectedTeacher(item);
    setCurrentScreen('details');
  },[setSelectedTeacher])

  const closeDescription = useCallback(() => {
    setCurrentScreen('members');
  },[])

  const [isOpenConfirmPopup, setIsOpenConfirmPopup] = useState<boolean>(false);
  const [isOpenPasswordPopup, setIsOpenPasswordPopup] = useState<boolean>(false);
  const [isOpenDropPopup, setIsOpenDropPopup] = useState<boolean>(false);

  const controlDropPopup = useCallback(() => {
    clearErrors();
    setIsOpenDropPopup(!isOpenDropPopup);
    setSelectedNewResponsible({
      name: 'Не указано',
      value: '-1'
    })
  },[clearErrors, setIsOpenDropPopup, setSelectedNewResponsible, isOpenDropPopup])

  const controlConfirmPopup = useCallback(() => {
    setIsOpenConfirmPopup(!isOpenConfirmPopup);
  },[setIsOpenConfirmPopup, isOpenConfirmPopup])

  const openPasswordPopup = useCallback(() => {
    setIsOpenConfirmPopup(false);
    setIsOpenPasswordPopup(true);
  },[setIsOpenConfirmPopup, setIsOpenPasswordPopup])

  const confirmRecovery = useCallback(() => {
    recoverPassword(
      toggle === 'left' ? 
        adminMembersState.selectedDean.idAccount : 
        adminMembersState.selectedTeacher.idAccount,
      openPasswordPopup);
  },[
    toggle, 
    recoverPassword,
    adminMembersState.selectedDean.idAccount,
    adminMembersState.selectedTeacher.idAccount,
    openPasswordPopup
  ])
  
  const closePopups = useCallback(() => {
    setIsOpenConfirmPopup(false);
    setIsOpenPasswordPopup(false);
  },[])

  const returnBack = useCallback(() => {
    setIsOpenDropPopup(false);
    setCurrentScreen('members');
  },[])

  const onClickDelete = useCallback(() => {
    onDelete(toggle, returnBack);
  },[onDelete, toggle, returnBack])

  const resultDean = adminMembersState.selectedDean.flpName.split(' ');
  const resultTeacher = adminMembersState.selectedTeacher.flpName.split(' ');

  const headers = {
    members: 'Участники',
    details: toggle === 'left' ? 'Декан' : 'Преподаватель',
  };
  const handleBackActions = {
    members: goToWorkshop,
    details: () => setCurrentScreen('members'),
  };

  return (
    <>
    {
      isMobile ? 
      (<WrapperMobile onBack={handleBackActions[currentScreen]} role='ROLE_ADMIN' header={headers[currentScreen]}>
          {currentScreen === 'members' && <ListOfMembersView
            isMobile={isMobile}
            onClickToggle={onClickToggle}
            toggle={toggle}
            setSearchText={setSearchText}
            filteredListDeans={filteredListDeans}
            filteredListTeachers={filteredListTeachers}
            openDescriptionDean={openDescriptionDean}
            openDescriptionTeacher={openDescriptionTeacher}
            adminMembersState={adminMembersState}
          />}
          {currentScreen === 'details' && <MemberInfoView
            isMobile={isMobile}
            faculty={adminMembersState.selectedDean.faculty}
            toggle={toggle}
            closeDescription={closeDescription}
            controlDropPopup={controlDropPopup}
            login={toggle === 'left' ? adminMembersState.selectedDean.login : adminMembersState.selectedTeacher.login}
            controlConfirmPopup={controlConfirmPopup}
            resultDean={resultDean}
            resultTeacher={resultTeacher}
          />}
      </WrapperMobile>) :
      (
        <WrapperDesktop 
          isCenter={currentScreen === 'details'} 
          onBack={handleBackActions[currentScreen]} 
          role='ROLE_ADMIN' header={headers[currentScreen]}>
          <Column style={{position: 'absolute', height: window.innerHeight, top: 0, zIndex: -1}}>
            <CircleLoading state={adminMembersState.loading}/>
          </Column>
          {adminMembersState.loading !== 'loading' && <Column style={{width: 'auto'}} horizontalAlign='center'>
            {
              currentScreen === 'members' && <ListOfMembersView
                  isMobile={isMobile}
                  onClickToggle={onClickToggle}
                  toggle={toggle}
                  setSearchText={setSearchText}
                  filteredListDeans={filteredListDeans}
                  filteredListTeachers={filteredListTeachers}
                  openDescriptionDean={openDescriptionDean}
                  openDescriptionTeacher={openDescriptionTeacher}
                  adminMembersState={adminMembersState}
                />
            }
            {currentScreen === 'details' && <MemberInfoView
                isMobile={isMobile}
                faculty={adminMembersState.selectedDean.faculty}
                toggle={toggle}
                closeDescription={closeDescription}
                login={toggle === 'left' ? adminMembersState.selectedDean.login : adminMembersState.selectedTeacher.login}
                controlDropPopup={controlDropPopup}
                controlConfirmPopup={controlConfirmPopup}
                resultDean={resultDean}
                resultTeacher={resultTeacher}
              />}
          </Column>}
        </WrapperDesktop>
      )
    }
    <ConfirmRecoveryPopupView
      isOpenConfirmPopup={isOpenConfirmPopup}
      controlConfirmPopup={controlConfirmPopup}
      confirmRecovery={confirmRecovery}
      state={adminMembersState.loadingNewPassword}/>
    <NewPasswordPopupView
      isOpenPasswordPopup={isOpenPasswordPopup}
      closePopups={closePopups}
      newPassword={adminMembersState.newPassword}/>
    <DropPopupView
      selectedNewResponsible={adminMembersState.selectedNewResponsible}
      setSelectedNewResponsible={setSelectedNewResponsible}
      isOpenDropPopup={isOpenDropPopup}
      state={adminMembersState.loadingDelete}
      onClickDelete={onClickDelete}
      itemsForSelect={toggle === 'left' ? 
        adminMembersState.itemsForSelectDean : 
        adminMembersState.itemsForSelectTeachers}
      error={adminMembersState.errors['selectedNewResponsibleError']}
      controlDropPopup={controlDropPopup}/>
    </>
  );
});

type MemberDescriptionViewProps = {
  isMobile?: boolean;
  isDean: boolean;
  faculty?: string;
  data: string[];
}

export const MemberDescriptionView: FC<MemberDescriptionViewProps> = memo(({
  data,
  faculty,
  isDean
}) => {

  return (
      <>
      <Text themeFont={theme.fonts.ht1} style={{
        paddingLeft: 7,
        wordBreak: 'break-word'
      }}>
        {data[0]}
      </Text>
      <Text themeFont={theme.fonts.ht1} style={{
        paddingLeft: 7,
        wordBreak: 'break-word'
      }}>
        {data[1]}
      </Text>
      <Text themeFont={theme.fonts.ht1} style={{
        paddingLeft: 7,
        wordBreak: 'break-word'
      }}>
        {data[2]}
      </Text>
      {isDean && <Text themeFont={theme.fonts.ht1} style={{
        paddingLeft: 7,
        wordBreak: 'break-word'
      }}>
        <b>Факультет</b> - {faculty}
      </Text>}
      </>
  );
});



type ConfirmRecoveryPopupViewProps = {
  isOpenConfirmPopup: boolean;
  controlConfirmPopup: () => void;
  confirmRecovery: () => void;
  state: "loading" | "idle" | "success" | "error";
}

export const ConfirmRecoveryPopupView: FC<ConfirmRecoveryPopupViewProps> = memo(({
  isOpenConfirmPopup,
  controlConfirmPopup,
  confirmRecovery,
  state
}) => {

  return (
    <Popup isActive={isOpenConfirmPopup} closePopup={controlConfirmPopup}>
      <Column horizontalAlign='center'>
        <Text themeFont={theme.fonts.h2} align='center'> 
          Вы уверены, что <br/>
          хотите сбросить пароль?
        </Text>
        <Spacing  themeSpace={25} variant='Column' />
        <Row>
          <Button onClick={confirmRecovery} state={state} variant='recomended' padding={[12,17]}>
            Сбросить
          </Button>
          <Spacing variant='Row' themeSpace={20}/>
          <Button onClick={controlConfirmPopup} variant='attentive' padding={[12,17]}>
            Отмена
          </Button>
        </Row>
      </Column>
    </Popup>
  );
});


type NewPasswordPopupViewProps = {
  isOpenPasswordPopup: boolean;
  closePopups: () => void;
  newPassword: string;
}

export const NewPasswordPopupView: FC<NewPasswordPopupViewProps> = memo(({
  isOpenPasswordPopup,
  closePopups,
  newPassword
}) => {

  return (
    <Popup isActive={isOpenPasswordPopup} closePopup={closePopups}>
      <Column horizontalAlign='center'>
        <Textarea width={220} isCopy={true} value={newPassword} placeholder='' disabled={true} header='Новый пароль' />
        <Spacing themeSpace={35} variant='Column' />
        <Button onClick={closePopups} state={'idle'} variant='primary' padding={[12,17]}>
          Вернуться назад
        </Button>
      </Column>
    </Popup>
  );
});

type DropPopupViewProps = {
  isOpenDropPopup: boolean;
  controlDropPopup: () => void;
  onClickDelete: () => void;
  error: string | null;
  state: "loading" | "idle" | "success" | "error";
  setSelectedNewResponsible: (value: ItemOfSelectType) => void
  selectedNewResponsible: ItemOfSelectType
  itemsForSelect: ItemOfSelectType[]
}

export const DropPopupView: FC<DropPopupViewProps> = memo(({
  isOpenDropPopup,
  controlDropPopup,
  onClickDelete,
  setSelectedNewResponsible,
  selectedNewResponsible,
  itemsForSelect,
  error,
  state
}) => {

  return (
    <Popup style={{ width: 'calc(100% - 50px)', maxWidth: 440 }} isActive={isOpenDropPopup} padding='30px' closePopup={controlDropPopup}>
      <Column horizontalAlign='center' >
        <Select
          header='Перенести данные на' 
          includeSearch={true}
          items={itemsForSelect}
          setValue={setSelectedNewResponsible} 
          selectedItem={selectedNewResponsible}/>
        <Column style={{height: 25}} verticalAlign='center' horizontalAlign='center'>
          <Text themeFont={theme.fonts.ht2} themeColor={theme.colors.attentive}>
            {error}
          </Text>
        </Column>
        <Spacing themeSpace={15} variant='Column' />
        <Button state={state} onClick={onClickDelete} variant='attentive' padding={[12,17]}>
          Удалить
        </Button>
      </Column>
    </Popup>
  );
});



type MemberInfoViewProps = {
  isMobile: boolean;
  toggle: "left" | "right";
  closeDescription: () => void;
  controlDropPopup: () => void;
  controlConfirmPopup: () => void;
  resultDean: string[];
  resultTeacher: string[];
  login: string;
  faculty: string;
}

export const MemberInfoView: FC<MemberInfoViewProps> = memo(({
  isMobile,
  toggle,
  closeDescription,
  faculty,
  controlDropPopup,
  controlConfirmPopup,
  login,
  resultDean,
  resultTeacher
}) => {

  return (
    isMobile ?
    (<Column horizontalAlign='center'>
      <Surface style={{maxWidth: 440}}>
        <Row verticalAlign='center' style={{width: '100%'}} horizontalAlign='space-between'>
          <Image src={accountLogoSVG} width={95} height={95}/>
          <Spacing themeSpace={10} variant='Row' />
          <Column style={{gap: 15}} verticalAlign='space-between'>
          <MemberDescriptionView 
            isDean={toggle === 'left'}
            data={toggle === 'left' ? resultDean : resultTeacher}
            faculty={faculty}
            />
          </Column>
        </Row>
        <Spacing themeSpace={10} variant='Column' />
        <Textarea 
          height={55}
          isCopy={true} 
          value={login} 
          placeholder='Логин' 
          disabled={true} header='Логин' />
      </Surface>
      <Spacing themeSpace={15} variant='Column' />
      <ActionButton onClick={controlConfirmPopup} text='Сбросить пароль' />
      <Spacing variant='Column' themeSpace={10} />
      <ActionButton 
        themeFont={theme.fonts.h2} 
        textColor={theme.colors.attentive} 
        onClick={controlDropPopup} 
        text='Удалить' />
      <Spacing variant='Column' themeSpace={85} />
    </Column>) : 
    (<Surface padding='25px'>
      <Column horizontalAlign='center' style={{position: 'relative', width: 440}}>
        <Surface>
          <Row verticalAlign='center' style={{width: '100%'}} horizontalAlign='space-between'>
            <Image src={accountLogoSVG} width={95} height={95}/>
            <Spacing themeSpace={10} variant='Row' />
            <Column style={{gap: 15}} verticalAlign='space-between'>
              <MemberDescriptionView 
                isDean={toggle === 'left'}
                data={toggle === 'left' ? resultDean : resultTeacher}
                faculty={faculty}
                />
            </Column>
          </Row>
          <Spacing themeSpace={10} variant='Column' />
          <Textarea 
            height={55}
            isCopy={true} 
            value={login} 
            placeholder='Логин' 
            disabled={true} header='Логин' />
        </Surface>
        <Spacing themeSpace={15} variant='Column' />
        <ActionButton onClick={controlConfirmPopup} text='Сбросить пароль' />
        <Spacing variant='Column' themeSpace={15} />
        <ActionButton 
          themeFont={theme.fonts.h2} 
          textColor={theme.colors.attentive} 
          onClick={controlDropPopup} 
          text='Удалить' />
      </Column>
    </Surface>)
  );
});

type ListOfMembersViewProps = {
  isMobile: boolean;
  onClickToggle: () => void;
  toggle: "left" | "right";
  openDescriptionDean: (item: DeanInfoState) => void;
  openDescriptionTeacher: (item: TeacherInfoState) => void;
  setSearchText: (value: string) => void;
  filteredListDeans: DeanInfoState[] | undefined;
  filteredListTeachers: TeacherInfoState[] | undefined;
  adminMembersState: MembersState;
}

export const ListOfMembersView: FC<ListOfMembersViewProps> = memo(({
  isMobile,
  onClickToggle,
  setSearchText,
  toggle,
  filteredListDeans,
  filteredListTeachers,
  openDescriptionDean,
  openDescriptionTeacher,
  adminMembersState,
}) => {

  return (
    isMobile ? 
      (<Column horizontalAlign='center' style={{height: '100%'}}>
        <Toggle varinat={toggle} onButtonClick={onClickToggle}   leftText='Деканы' rightText='Преподаватели'/>
        <Spacing themeSpace={10} variant='Column' />
        <Search value={adminMembersState.searchText} setValue={setSearchText}/>
        <Spacing themeSpace={20} variant='Column' />
        <ItemsContainerMobile>
        {
          toggle === 'left' ? (
            filteredListDeans?.map((item, index) =>
              <ActionButton key={index} onClick={() => openDescriptionDean(item)} text={item.flpName} />)
          ) : (
            filteredListTeachers?.map((item, index) =>
              <ActionButton key={index} onClick={() => openDescriptionTeacher(item)} text={item.flpName} />))
        }
        </ItemsContainerMobile>
      </Column>)
       : (
      <Column horizontalAlign='center' style={{width: 695, height: '100%'}}>
        <Toggle varinat={toggle} onButtonClick={onClickToggle}   leftText='Деканы' rightText='Преподаватели'/>
        <Spacing themeSpace={35} variant='Column' />
        <Search isMobile={false} value={adminMembersState.searchText} setValue={setSearchText}/>
        <Spacing themeSpace={30} variant='Column' />
        <GridContainer columns={4}>
          {
            toggle === 'left' ? (
              filteredListDeans?.map((item, index) =>
                <ActionBlockButton key={index} onClick={() => openDescriptionDean(item)} text={item.flpName} />)
            ) : (
              filteredListTeachers?.map((item, index) =>
                <ActionBlockButton key={index} onClick={() => openDescriptionTeacher(item)} text={item.flpName} />))
          }
        </GridContainer>
      </Column>)
  );
});