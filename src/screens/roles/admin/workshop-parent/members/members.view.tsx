
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

export type MembersViewProps = {
  goToWorkshop: () => void;
  setSearchText: (value: string) => void;
  adminMembersState: MembersState;
  setSelectedDean: (value: DeanInfoState) => void;
  setSelectedTeacher: (value: TeacherInfoState) => void;  
};

export const MembersView: FC<MembersViewProps> = memo(({
  goToWorkshop,
  adminMembersState,
  setSelectedDean,
  setSearchText,
  setSelectedTeacher
}) => {
  const isMobile = useMediaQuery({maxWidth: theme.toMobileSize});

  return (
    isMobile ? 
      (<MembersMobileView
        setSearchText={setSearchText}
        adminMembersState={adminMembersState}
        setSelectedDean={setSelectedDean}
        setSelectedTeacher={setSelectedTeacher}
        goToWorkshop={goToWorkshop}
        />) :
      (<MembersDesktopView
        setSearchText={setSearchText}
        adminMembersState={adminMembersState}
        setSelectedDean={setSelectedDean}
        setSelectedTeacher={setSelectedTeacher}
        goToWorkshop={goToWorkshop}
        />)
  );
});


export const MembersMobileView: FC<MembersViewProps> = memo(({
  goToWorkshop,
  setSearchText,
  setSelectedTeacher,
  setSelectedDean,
  adminMembersState
}) => {
  const [toggle, setToggle] = useState<"left" | "right">("left");
  const onClickToggle = useCallback(() => {
      setToggle(toggle === "left" ? "right" : "left");
      setSearchText('');
  }, [toggle, setSearchText]);

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
          <ActionButton 
            onClick={closeDescription}
            themeFont={theme.fonts.h2}
            textColor={theme.colors.attentive} 
            isShowArrow={false} 
            text='Вернуться назад' />
          <Spacing themeSpace={25} variant='Column' />
          <Surface style={{maxWidth: 440}} borderRadius='10px'>
            <Row verticalAlign='center' horizontalAlign='flex-start'>
              <Column style={{gap: 15}} verticalAlign='space-between'>
                <Text themeFont={theme.fonts.ht1} style={{
                  wordBreak: 'break-word'
                }}>
                  <b>ФИО</b> - {toggle === 'left' ? adminMembersState.selectedDean.flpName : adminMembersState.selectedTeacher.flpName}
                </Text>

                { toggle === 'left' && <Text themeFont={theme.fonts.ht1} style={{
                  wordBreak: 'break-word'
                }}>
                  <b>Факультет</b> - {adminMembersState.selectedDean.faculty}
                </Text>}
              </Column>
            </Row>
          </Surface>
          <Spacing themeSpace={25} variant='Column' />
          <Row>
            <Button variant='primary' padding={[12,17]}>
              Сбросить пароль
            </Button>
            <Spacing variant='Row' themeSpace={20}/>
            <Button state={'idle'} variant='secondary' padding={[12,17]}>
              Удалить
            </Button>
          </Row>
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
            adminMembersState.listDeans.map((item) => <>
              <ActionButton onClick={() => openDescriptionDean(item)} text={item.flpName} />
              <Spacing themeSpace={10} variant='Column' />
            </>)
          ) : (
            adminMembersState.listTeachers.map((item) => <>
              <ActionButton onClick={() => openDescriptionTeacher(item)} text={item.flpName} />
              <Spacing themeSpace={10} variant='Column' />
             </>))
        }
        <Spacing themeSpace={75} variant='Column' />
      </Column>
    </WrapperMobile>
  );
});

export const MembersDesktopView: FC<MembersViewProps> = memo(({
  goToWorkshop,
  setSelectedTeacher,
  setSelectedDean,
  setSearchText,
  adminMembersState
}) => {

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

  return (
    <WrapperDesktop isCenter={isShowDescription} onBack={goToWorkshop} role='ROLE_ADMIN' header='Участники'>
      <Column style={{position: 'absolute', height: '100vh', top: 0, zIndex: -1}}>
        <CircleLoading state={adminMembersState.loading}/>
      </Column>
      {adminMembersState.loading !== 'loading' && <Column style={{width: 'auto'}} horizontalAlign='center'>
        {
          isShowDescription ? (<>
            <Surface padding='25px'>
              <ActionButton 
                width={'440px'}
                onClick={closeDescription}
                themeFont={theme.fonts.h2}
                textColor={theme.colors.attentive} 
                isShowArrow={false} 
                text='Вернуться назад' />
              <Spacing themeSpace={35} variant='Column' />
              <Column horizontalAlign='center' style={{position: 'relative'}}>
                <Column style={{gap: 15}} verticalAlign='space-between'>
                  <Text themeFont={theme.fonts.ht1} style={{
                    paddingLeft: 7,
                    wordBreak: 'break-word'
                  }}>
                    <b>ФИО</b> - {toggle === 'left' ? adminMembersState.selectedDean.flpName : adminMembersState.selectedTeacher.flpName}
                  </Text>

                  { toggle === 'left' && <Text themeFont={theme.fonts.ht1} style={{
                    wordBreak: 'break-word',
                    paddingLeft: 7
                  }}>
                    <b>Факультет</b> - {adminMembersState.selectedDean.faculty}
                  </Text>}
                </Column>
                <Spacing themeSpace={35} variant='Column' />
                <Row>
                  <Button variant='primary' padding={[12,17]}>
                    Сбросить пароль
                  </Button>
                  <Spacing variant='Row' themeSpace={20}/>
                  <Button state={'idle'} variant='secondary' padding={[12,17]}>
                    Удалить
                  </Button>
                </Row>
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
                  adminMembersState.listDeans.map((item) =>
                    <ActionBlockButton onClick={() => openDescriptionDean(item)} text={item.flpName} />)
                ) : (
                  adminMembersState.listTeachers.map((item) =>
                    <ActionBlockButton onClick={() => openDescriptionTeacher(item)} text={item.flpName} />))
              }
            </GridContainer>
          </Column>)
        }
      </Column>}
    </WrapperDesktop>
  );
});