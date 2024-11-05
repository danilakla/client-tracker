
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
  filteredListTeachers: TeacherInfoState[] | undefined;
};

export const MembersView: FC<MembersViewProps> = memo(({
  goToWorkshop,
  adminMembersState,
  setSelectedDean,
  setSearchText,
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


  const [isShowDescription, setIsShowDescription] = useState<boolean>(false);

  const openDescriptionDean = useCallback((item: DeanInfoState) => {
    setSelectedDean(item);
    setIsShowDescription(true);
  },[setSelectedDean])

  const openDescriptionTeacher = useCallback((item: TeacherInfoState) => {
    setSelectedTeacher(item);
    setIsShowDescription(true);
  },[setSelectedTeacher])

  const closeDescription = useCallback(() => {
    setIsShowDescription(false);
  },[])

  const [isOpenConfirmPopup, setIsOpenConfirmPopup] = useState<boolean>(false);
  const [isOpenPasswordPopup, setIsOpenPasswordPopup] = useState<boolean>(false);
  const [isOpenDropPopup, setIsOpenDropPopup] = useState<boolean>(false);

  const controlDropPopup = useCallback(() => {
    setIsOpenDropPopup(!isOpenDropPopup);
    setSelectedNewResponsible({
      name: 'Не указано',
      value: '-1'
    })
  },[setIsOpenDropPopup, setSelectedNewResponsible, isOpenDropPopup])

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
    setIsShowDescription(false);
  },[])

  const onClickDelete = useCallback(() => {
    onDelete(toggle, returnBack);
  },[onDelete, toggle, returnBack])

  const resultDean = adminMembersState.selectedDean.flpName.split(' ');
  const resultTeacher = adminMembersState.selectedTeacher.flpName.split(' ');

  return (
    isMobile ? 
      (<MembersMobileView
          onClickToggle={onClickToggle}
          toggle={toggle}
          returnBack={returnBack}
          isShowDescription={isShowDescription}
          isOpenConfirmPopup={isOpenConfirmPopup}
          setSelectedNewResponsible={setSelectedNewResponsible}
          isOpenDropPopup={isOpenDropPopup}
          setSearchText={setSearchText}
          filteredListDeans={filteredListDeans}
          filteredListTeachers={filteredListTeachers}
          openDescriptionDean={openDescriptionDean}
          openDescriptionTeacher={openDescriptionTeacher}
          openPasswordPopup={openPasswordPopup}
          isOpenPasswordPopup={isOpenPasswordPopup}
          goToWorkshop={goToWorkshop}
          confirmRecovery={confirmRecovery}
          adminMembersState={adminMembersState}
          closeDescription={closeDescription}
          closePopups={closePopups}
          controlDropPopup={controlDropPopup}
          onClickDelete={onClickDelete}
          controlConfirmPopup={controlConfirmPopup}
          resultDean={resultDean}
          resultTeacher={resultTeacher}
        />) :
      (<MembersDesktopView
          onClickToggle={onClickToggle}
          toggle={toggle}
          returnBack={returnBack}
          isShowDescription={isShowDescription}
          isOpenConfirmPopup={isOpenConfirmPopup}
          setSelectedNewResponsible={setSelectedNewResponsible}
          isOpenDropPopup={isOpenDropPopup}
          setSearchText={setSearchText}
          filteredListDeans={filteredListDeans}
          filteredListTeachers={filteredListTeachers}
          openDescriptionDean={openDescriptionDean}
          openDescriptionTeacher={openDescriptionTeacher}
          openPasswordPopup={openPasswordPopup}
          isOpenPasswordPopup={isOpenPasswordPopup}
          goToWorkshop={goToWorkshop}
          confirmRecovery={confirmRecovery}
          adminMembersState={adminMembersState}
          closeDescription={closeDescription}
          closePopups={closePopups}
          controlDropPopup={controlDropPopup}
          onClickDelete={onClickDelete}
          controlConfirmPopup={controlConfirmPopup}
          resultDean={resultDean}
          resultTeacher={resultTeacher}
        />)
  );
});

type ParametersViewType = {
  onClickToggle: () => void;
  toggle: "left" | "right";
  isShowDescription: boolean;
  openDescriptionDean: (item: DeanInfoState) => void;
  openDescriptionTeacher: (item: TeacherInfoState) => void;
  closeDescription: () => void;
  setSearchText: (value: string) => void;
  filteredListDeans: DeanInfoState[] | undefined;
  filteredListTeachers: TeacherInfoState[] | undefined;
  isOpenConfirmPopup: boolean;
  isOpenPasswordPopup: boolean;
  isOpenDropPopup: boolean;
  setSelectedNewResponsible: (value: ItemOfSelectType) => void;
  goToWorkshop: () => void;
  controlDropPopup: () => void;
  controlConfirmPopup: () => void;
  openPasswordPopup: () => void;
  confirmRecovery: () => void;
  closePopups: () => void;
  adminMembersState: MembersState;
  returnBack: () => void;
  onClickDelete: () => void;
  resultDean: string[];
  resultTeacher: string[];
} 

export const MembersMobileView: FC<ParametersViewType> = memo(({
  onClickToggle,
  toggle,
  isShowDescription,
  isOpenConfirmPopup,
  setSelectedNewResponsible,
  isOpenDropPopup,
  setSearchText,
  filteredListDeans,
  filteredListTeachers,
  openDescriptionDean,
  openDescriptionTeacher,
  openPasswordPopup,
  isOpenPasswordPopup,
  goToWorkshop,
  confirmRecovery,
  adminMembersState,
  closeDescription,
  closePopups,
  controlDropPopup,
  onClickDelete,
  controlConfirmPopup,
  resultDean,
  resultTeacher
}) => {
  return (
    <WrapperMobile onBack={goToWorkshop} role='ROLE_ADMIN' header='Участники'>
      <Column style={{position: 'absolute', height: '100vh', top: 0, zIndex: -1}}>
        <CircleLoading state={adminMembersState.loading}/>
      </Column>
      <Column horizontalAlign='center' style={{
          position: 'absolute', 
          padding: '0px 25px',
          transform: isShowDescription ? 'translateX(0%)' : 'translateX(100%)',
          transition: 'transform 0.3s ease'
        }}>
          <Surface style={{maxWidth: 440}}>
            <Row verticalAlign='center' style={{width: '100%'}} horizontalAlign='space-between'>
              <Image src={accountLogoSVG} width={95} height={95}/>
              <Spacing themeSpace={10} variant='Row' />
              <Column style={{gap: 15}} verticalAlign='space-between'>
              {
                toggle  === 'left' ? <>
                  <Text themeFont={theme.fonts.ht1} style={{
                    paddingLeft: 7,
                    wordBreak: 'break-word'
                  }}>
                    {resultDean[0]}
                  </Text>
                  <Text themeFont={theme.fonts.ht1} style={{
                    paddingLeft: 7,
                    wordBreak: 'break-word'
                  }}>
                    {resultDean[1]}
                  </Text>
                  <Text themeFont={theme.fonts.ht1} style={{
                    paddingLeft: 7,
                    wordBreak: 'break-word'
                  }}>
                    {resultDean[2]}
                  </Text>
                  <Text themeFont={theme.fonts.ht1} style={{
                    paddingLeft: 7,
                    wordBreak: 'break-word'
                  }}>
                    <b>Факультет</b> - {adminMembersState.selectedDean.faculty}
                  </Text>
                </> : <>
                <Text themeFont={theme.fonts.ht1} style={{
                    paddingLeft: 7,
                    wordBreak: 'break-word'
                  }}>
                    {resultTeacher[0]}
                  </Text>
                  <Text themeFont={theme.fonts.ht1} style={{
                    paddingLeft: 7,
                    wordBreak: 'break-word'
                  }}>
                    {resultTeacher[1]}
                  </Text>
                  <Text themeFont={theme.fonts.ht1} style={{
                    paddingLeft: 7,
                    wordBreak: 'break-word'
                  }}>
                    {resultTeacher[2]}
                  </Text>
                </>
              }
              </Column>
            </Row>
          </Surface>
          <Spacing themeSpace={25} variant='Column' />
          <ActionButton onClick={controlConfirmPopup} text='Сбросить пароль' />
          <Spacing variant='Column' themeSpace={10} />
          <ActionButton onClick={closeDescription} text='Вернуться назад' />
          <Spacing themeSpace={10} variant='Column' />
          <ActionButton 
            themeFont={theme.fonts.h2} 
            textColor={theme.colors.attentive} 
            onClick={controlDropPopup} 
            text='Удалить' />
      </Column>
      <Column horizontalAlign='center' style={{
          position: 'absolute', 
          transform: isShowDescription ? 'translateX(-100%)' : 'translateX(0)',
          padding: '0px 25px',
          height: isShowDescription ? '100%' : 'auto',
          overflow: isShowDescription ? 'hidden' : 'auto',
          transition: 'transform 0.3s ease'
        }}>
        <Toggle varinat={toggle} onButtonClick={onClickToggle}   leftText='Деканы' rightText='Преподаватели'/>
        <Spacing themeSpace={10} variant='Column' />
        <Search value={adminMembersState.searchText} setValue={setSearchText}/>
        <Spacing themeSpace={20} variant='Column' />
        {
          toggle === 'left' ? (
            filteredListDeans?.map((item) => <>
              <ActionButton onClick={() => openDescriptionDean(item)} text={item.flpName} />
              <Spacing themeSpace={10} variant='Column' />
            </>)
          ) : (
            filteredListTeachers?.map((item) => <>
              <ActionButton onClick={() => openDescriptionTeacher(item)} text={item.flpName} />
              <Spacing themeSpace={10} variant='Column' />
             </>))
        }
        <Spacing themeSpace={75} variant='Column' />
      </Column>
      <Popup isActive={isOpenConfirmPopup} closePopup={controlConfirmPopup}>
        <Column horizontalAlign='center'>
          <Text themeFont={theme.fonts.h2} align='center'> 
            Вы уверены, что <br/>
            хотите сбросить пароль?
          </Text>
          <Spacing  themeSpace={25} variant='Column' />
          <Row>
            <Button onClick={confirmRecovery} state={adminMembersState.loadingNewPassword} variant='recomended' padding={[12,17]}>
              Сбросить
            </Button>
            <Spacing variant='Row' themeSpace={20}/>
            <Button onClick={controlConfirmPopup} state={'idle'} variant='attentive' padding={[12,17]}>
              Отмена
            </Button>
          </Row>
        </Column>
      </Popup>
      <Popup isActive={isOpenPasswordPopup} closePopup={closePopups}>
        <Column horizontalAlign='center'>
          <Textarea width={220} isCopy={true} value={adminMembersState.newPassword} placeholder='' disabled={true} header='Новый пароль' />
          <Spacing themeSpace={35} variant='Column' />
          <Button onClick={closePopups} state={'idle'} variant='primary' padding={[12,17]}>
            Вернуться назад
          </Button>
        </Column>
      </Popup>
      <Popup style={{ width: 'calc(100% - 50px)' }} isActive={isOpenDropPopup} padding='30px' closePopup={controlDropPopup}>
        <Column horizontalAlign='center' >
          <Select
            header='Перенести данные на' 
            includeSearch={true}
            items={toggle === 'left' ? adminMembersState.itemsForSelectDean : adminMembersState.itemsForSelectTeachers}
            setValue={setSelectedNewResponsible} 
            selectedItem={adminMembersState.selectedNewResponsible}/>
          <Column style={{height: 25}} verticalAlign='center' horizontalAlign='center'>
            <Text themeFont={theme.fonts.ht2} themeColor={theme.colors.attentive}>
              {adminMembersState.errors['selectedNewResponsibleError']}
            </Text>
          </Column>
          <Spacing themeSpace={15} variant='Column' />
          <Button state={adminMembersState.loadingDelete} onClick={onClickDelete} variant='attentive' padding={[12,17]}>
            Удалить
          </Button>
        </Column>
      </Popup>
    </WrapperMobile>
  );
});

export const MembersDesktopView: FC<ParametersViewType> = memo(({
  onClickToggle,
  toggle,
  isShowDescription,
  isOpenConfirmPopup,
  setSelectedNewResponsible,
  isOpenDropPopup,
  setSearchText,
  filteredListDeans,
  filteredListTeachers,
  openDescriptionDean,
  openDescriptionTeacher,
  openPasswordPopup,
  isOpenPasswordPopup,
  goToWorkshop,
  confirmRecovery,
  adminMembersState,
  closeDescription,
  closePopups,
  controlDropPopup,
  onClickDelete,
  controlConfirmPopup,
  resultDean,
  resultTeacher
}) => {
  return (
    <WrapperDesktop isCenter={isShowDescription} onBack={goToWorkshop} role='ROLE_ADMIN' header='Участники'>
      <Column style={{position: 'absolute', height: '100vh', top: 0, zIndex: -1}}>
        <CircleLoading state={adminMembersState.loading}/>
      </Column>
      {adminMembersState.loading !== 'loading' && <Column style={{width: 'auto'}} horizontalAlign='center'>
        {
          isShowDescription ? (<>
            <Surface padding='40px'>
              <Column horizontalAlign='center' style={{position: 'relative', width: 440}}>
                <Surface>
                  <Row verticalAlign='center' style={{width: '100%'}} horizontalAlign='space-between'>
                    <Image src={accountLogoSVG} width={95} height={95}/>
                    <Spacing themeSpace={10} variant='Row' />
                    <Column style={{gap: 15}} verticalAlign='space-between'>
                      {
                        toggle  === 'left' ? <>
                          <Text themeFont={theme.fonts.ht1} style={{
                            paddingLeft: 7,
                            wordBreak: 'break-word'
                          }}>
                            {resultDean[0]}
                          </Text>
                          <Text themeFont={theme.fonts.ht1} style={{
                            paddingLeft: 7,
                            wordBreak: 'break-word'
                          }}>
                            {resultDean[1]}
                          </Text>
                          <Text themeFont={theme.fonts.ht1} style={{
                            paddingLeft: 7,
                            wordBreak: 'break-word'
                          }}>
                            {resultDean[2]}
                          </Text>
                          <Text themeFont={theme.fonts.ht1} style={{
                            paddingLeft: 7,
                            wordBreak: 'break-word'
                          }}>
                            <b>Факультет</b> - {adminMembersState.selectedDean.faculty}
                          </Text>
                        </> : <>
                        <Text themeFont={theme.fonts.ht1} style={{
                            paddingLeft: 7,
                            wordBreak: 'break-word'
                          }}>
                            {resultTeacher[0]}
                          </Text>
                          <Text themeFont={theme.fonts.ht1} style={{
                            paddingLeft: 7,
                            wordBreak: 'break-word'
                          }}>
                            {resultTeacher[1]}
                          </Text>
                          <Text themeFont={theme.fonts.ht1} style={{
                            paddingLeft: 7,
                            wordBreak: 'break-word'
                          }}>
                            {resultTeacher[2]}
                          </Text>
                        </>
                      }
                    </Column>
                  </Row>
                </Surface>
                <Spacing themeSpace={30} variant='Column' />
                <ActionButton onClick={controlConfirmPopup} text='Сбросить пароль' />
                <Spacing variant='Column' themeSpace={15} />
                <ActionButton onClick={closeDescription} text='Вернуться назад' />
                <Spacing variant='Column' themeSpace={15} />
                <ActionButton 
                  themeFont={theme.fonts.h2} 
                  textColor={theme.colors.attentive} 
                  onClick={controlDropPopup} 
                  text='Удалить' />
              </Column>
            </Surface>
          </>) : (<Column horizontalAlign='center' style={{width: 695}}>
            <Toggle varinat={toggle} onButtonClick={onClickToggle}   leftText='Деканы' rightText='Преподаватели'/>
            <Spacing themeSpace={35} variant='Column' />
            <Search isMobile={false} value={adminMembersState.searchText} setValue={setSearchText}/>
            <Spacing themeSpace={30} variant='Column' />
            <GridContainer columns={4}>
              {
                toggle === 'left' ? (
                  filteredListDeans?.map((item) =>
                    <ActionBlockButton onClick={() => openDescriptionDean(item)} text={item.flpName} />)
                ) : (
                  filteredListTeachers?.map((item) =>
                    <ActionBlockButton onClick={() => openDescriptionTeacher(item)} text={item.flpName} />))
              }
            </GridContainer>
          </Column>)
        }
      </Column>}
      <Popup isActive={isOpenConfirmPopup} closePopup={controlConfirmPopup}>
        <Column horizontalAlign='center'>
          <Text themeFont={theme.fonts.h2} align='center'> 
            Вы уверены, что <br/>
            хотите сбросить пароль?
          </Text>
          <Spacing  themeSpace={25} variant='Column' />
          <Row>
            <Button onClick={confirmRecovery} state={adminMembersState.loadingNewPassword} variant='recomended' padding={[12,17]}>
              Сбросить
            </Button>
            <Spacing variant='Row' themeSpace={20}/>
            <Button onClick={controlConfirmPopup} state={'idle'} variant='attentive' padding={[12,17]}>
              Отмена
            </Button>
          </Row>
        </Column>
      </Popup>
      <Popup isActive={isOpenPasswordPopup} closePopup={closePopups}>
        <Column horizontalAlign='center'>
          <Textarea width={350} isCopy={true} value={adminMembersState.newPassword} placeholder='' disabled={true} header='Новый пароль' />
          <Spacing themeSpace={35} variant='Column' />
          <Button onClick={closePopups} variant='primary' padding={[12,17]}>
            Вернуться назад
          </Button>
        </Column>
      </Popup>
      <Popup isActive={isOpenDropPopup} padding='30px' closePopup={controlDropPopup}>
        <Column horizontalAlign='center' style={{width: 440}}>
          <Select
            header='Перенести данные на' 
            includeSearch={true}
            items={toggle === 'left' ? adminMembersState.itemsForSelectDean : adminMembersState.itemsForSelectTeachers}
            setValue={setSelectedNewResponsible} 
            selectedItem={adminMembersState.selectedNewResponsible}/>
          <Column style={{height: 25}} verticalAlign='center' horizontalAlign='center'>
            <Text themeFont={theme.fonts.ht2} themeColor={theme.colors.attentive}>
              {adminMembersState.errors['selectedNewResponsibleError']}
            </Text>
          </Column>
          <Spacing themeSpace={15} variant='Column' />
          <Button state={adminMembersState.loadingDelete} onClick={onClickDelete} variant='attentive' padding={[12,17]}>
            Удалить
          </Button>
        </Column>
      </Popup>
    </WrapperDesktop>
  );
});