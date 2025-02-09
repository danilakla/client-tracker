
import { FC, memo, useCallback, useState } from 'react';
import { useMediaQuery } from 'react-responsive';
import { WrapperMobile } from '../../../../../components/wrapper-mobile';
import { WrapperDesktop } from '../../../../../components/wrapper-desktop';
import { theme } from '../../../../../ui-kit/themes/theme';
import { UserData, UserRole } from '../../../../../store/reducers/user-slice';
import { Row } from '../../../../../ui-kit/row';
import { Image } from '../../../../../ui-kit/image';

import accountLogoSVG from '../../../../../images/account-image.svg';
import { Column } from '../../../../../ui-kit/column';
import { Text } from '../../../../../ui-kit/text';
import { Spacing } from '../../../../../ui-kit/spacing';
import { ActionButton } from '../../../../../ui-kit/action-button';
import { Surface } from '../../../../../ui-kit/surface';
import { Popup } from '../../../../../ui-kit/popup';
import { Button } from '../../../../../ui-kit/button';

const roleView: Record<UserRole, string> = {
  ROLE_ADMIN: 'Администатор',
  ROLE_DEAN: 'Декан',
  ROLE_PARENTS: 'Родительский аккаунт',
  ROLE_STUDENT: 'Студент',
  ROLE_TEACHER: 'Преподаватель',
  UNDEFINED: 'Неопределено'
};

export type ProfileViewProps = {
  user: UserData;
  goChangeAccoundData: () => void;
  goChangeLogin: () => void;
  goChangePassword: () => void;
  exitAccount: () => void;
  goUniversityInfo: () => void;
};

export const ProfileView: FC<ProfileViewProps> = memo(({
  user,
  goChangeAccoundData,
  goChangeLogin,
  goChangePassword,
  goUniversityInfo,
  exitAccount
}) => {
  const isMobile = useMediaQuery({maxWidth: theme.toMobileSize});

  return (
    isMobile ? 
      (<ProfileMobileView
        goChangeAccoundData={goChangeAccoundData}
        goChangeLogin={goChangeLogin}
        exitAccount={exitAccount}
        goChangePassword={goChangePassword}
        goUniversityInfo={goUniversityInfo}
        user={user}
        />) :
      (<ProfileDesktopView
        exitAccount={exitAccount}
        goChangeAccoundData={goChangeAccoundData}
        goChangeLogin={goChangeLogin}
        goChangePassword={goChangePassword}
        goUniversityInfo={goUniversityInfo}
        user={user}
        />)
  );
});

export const ProfileMobileView: FC<ProfileViewProps> = memo(({
  user,
  goChangeAccoundData,
  goChangeLogin,
  goChangePassword,
  goUniversityInfo,
  exitAccount
}) => {

  const [isOpenExitPopup, setIsOpenExitPopup] = useState<boolean>(false);

  const controlExitPopup = useCallback(() => {
    setIsOpenExitPopup(!isOpenExitPopup);
  },[setIsOpenExitPopup,isOpenExitPopup])

  return (
    <WrapperMobile role={user.role} header='Профиль'>
      <Column horizontalAlign='center'>
        <Surface style={{maxWidth: 440}}>
          <Row style={{width: '100%', maxWidth: 440}} verticalAlign='center' horizontalAlign='flex-start'>
            <Image src={accountLogoSVG} width={95} height={95}/>
            <Spacing variant='Row' themeSpace={10} />
            <Column style={{gap: 15, overflow: 'hidden'}} verticalAlign='space-between'>
              <Text themeFont={theme.fonts.h2} themeColor={theme.colors.nothing}>
                {user.lastname} 
              </Text>
              <Text themeFont={theme.fonts.h2} themeColor={theme.colors.nothing}>
                {user.name}
              </Text>
              <Text themeFont={theme.fonts.h2} themeColor={theme.colors.nothing}>
                {user.surname}
              </Text>
              <Text themeFont={theme.fonts.ml} >
                {roleView[user.role]}
              </Text>
            </Column>
          </Row>
        </Surface>
        <Spacing variant='Column' themeSpace={25} />
        <ActionButton onClick={goChangeLogin} text='Сменить логин' />
        <Spacing variant='Column' themeSpace={10} />
        {(user.role !== 'ROLE_STUDENT' && user.role !== 'ROLE_PARENTS') && <>
          <ActionButton onClick={goChangeAccoundData} text='Учётные данные' />
          <Spacing variant='Column' themeSpace={10} />
        </>}
        {(user.role !== 'ROLE_PARENTS') && <>
          <ActionButton onClick={goChangePassword} text='Сменить пароль' />
          <Spacing variant='Column' themeSpace={10} />
        </>}
        <ActionButton onClick={goUniversityInfo} text='Университет' />
        <Spacing variant='Column' themeSpace={10} />
        <ActionButton onClick={controlExitPopup} themeFont={theme.fonts.h2} textColor={theme.colors.attentive} text='Выйти из аккаунта' />
      </Column>
      <Popup isActive={isOpenExitPopup} closePopup={controlExitPopup}>
        <Column horizontalAlign='center'>
          <Text themeFont={theme.fonts.h2} align='center'> 
            Вы уверены, что <br/>
            хотите выйти из аккаунта?
          </Text>
          <Spacing  themeSpace={25} variant='Column' />
          <Row>
            <Button onClick={exitAccount} state={'idle'} variant='attentive' padding={[12,17]}>
              Выйти
            </Button>
            <Spacing variant='Row' themeSpace={20}/>
            <Button onClick={controlExitPopup} state={'idle'} variant='recomended' padding={[12,17]}>
              Отмена
            </Button>
          </Row>
        </Column>
      </Popup>
    </WrapperMobile>
  );
});

export const ProfileDesktopView: FC<ProfileViewProps> = memo(({
  user,
  goChangeAccoundData,
  goChangeLogin,
  goChangePassword,
  exitAccount,
  goUniversityInfo
}) => {
  const [isOpenExitPopup, setIsOpenExitPopup] = useState<boolean>(false);

  const controlExitPopup = useCallback(() => {
    setIsOpenExitPopup(!isOpenExitPopup);
  },[setIsOpenExitPopup,isOpenExitPopup])

  return (
    <WrapperDesktop isCenter={true} role={user.role} header='Профиль'>
      <Surface padding={'40px'} borderColor={theme.colors.foreground} style={{width: 'auto'}}>
        <Column verticalAlign='center' style={{width: 440}}>
          <Surface borderColor={theme.colors.foreground}>
            <Row verticalAlign='center' horizontalAlign='flex-start'>
              <Image src={accountLogoSVG} width={95} height={95}/>
              <Spacing variant='Row' themeSpace={25} />
              <Column style={{gap: 15, overflow: 'hidden'}} verticalAlign='space-between'>
                <Text themeFont={theme.fonts.h2} themeColor={theme.colors.nothing}>
                  {user.lastname}
                </Text>
                <Text themeFont={theme.fonts.h2} themeColor={theme.colors.nothing}>
                  {user.name}
                </Text>
                <Text themeFont={theme.fonts.h2} themeColor={theme.colors.nothing}>
                  {user.surname}
                </Text>
                <Text themeFont={theme.fonts.ml} >
                  {roleView[user.role]}
                </Text>
              </Column>
            </Row>
          </Surface>
          <Spacing variant='Column' themeSpace={25} />
          <ActionButton onClick={goChangeLogin} text='Сменить логин' />
          <Spacing variant='Column' themeSpace={15} />
          {(user.role !== 'ROLE_STUDENT' && user.role !== 'ROLE_PARENTS') && <>
            <ActionButton onClick={goChangeAccoundData} text='Учётные данные' />
            <Spacing variant='Column' themeSpace={15} />
          </>}
          {(user.role !== 'ROLE_PARENTS') && <>
            <ActionButton onClick={goChangePassword} text='Сменить пароль' />
            <Spacing variant='Column' themeSpace={15} />
          </>}
          <ActionButton onClick={goUniversityInfo} text='Университет' />
          <Spacing variant='Column' themeSpace={15} />
          <ActionButton 
            onClick={controlExitPopup}
            themeFont={theme.fonts.h2} 
            textColor={theme.colors.attentive} 
            text='Выйти из аккаунта' />
        </Column>
      </Surface>
      <Popup isActive={isOpenExitPopup} closePopup={controlExitPopup}>
        <Column horizontalAlign='center'>
          <Text themeFont={theme.fonts.h2} align='center'> 
            Вы уверены, что <br/>
            хотите выйти из аккаунта?
          </Text>
          <Spacing  themeSpace={25} variant='Column' />
          <Row>
            <Button onClick={exitAccount} state={'idle'} variant='attentive' padding={[12,17]}>
              Выйти
            </Button>
            <Spacing variant='Row' themeSpace={20}/>
            <Button onClick={controlExitPopup} state={'idle'} variant='recomended' padding={[12,17]}>
              Отмена
            </Button>
          </Row>
        </Column>
      </Popup>
    </WrapperDesktop>
  );
});