
import { FC, memo } from 'react';
import { useMediaQuery } from 'react-responsive';
import { WrapperMobile } from '../../../../../components/wrapper-mobile';
import { WrapperDesktop } from '../../../../../components/wrapper-desktop';
import { theme } from '../../../../../ui-kit/themes/theme';
import { UserData } from '../../../../../store/reducers/user-slice';
import { UniversityInfoState } from '../../../../../store/reducers/profile/university-info-slice';
import { Surface } from '../../../../../ui-kit/surface';
import { Text } from '../../../../../ui-kit/text';
import { Column } from '../../../../../ui-kit/column';
import { Spacing } from '../../../../../ui-kit/spacing';
import { CircleLoading } from '../../../../../ui-kit/circle-loading';

export type UniversityInfoViewProps = {
  user: UserData;
  universityInfoState: UniversityInfoState;
  goToProfile: () => void;
};

export const UniversityInfoView: FC<UniversityInfoViewProps> = memo(({
  user,
  universityInfoState,
  goToProfile
}) => {
  const isMobile = useMediaQuery({maxWidth: theme.toMobileSize});

  return (
    isMobile ? 
      (<UniversityInfoMobileView
        universityInfoState={universityInfoState}
        goToProfile={goToProfile}
        user={user}
        />) :
      (<UniversityInfoDesktopView
        universityInfoState={universityInfoState}
        user={user}
        goToProfile={goToProfile}
        />)
  );
});


export const UniversityInfoMobileView: FC<UniversityInfoViewProps> = memo(({
  user,
  goToProfile,
  universityInfoState
}) => {

  return (
    <WrapperMobile onBack={goToProfile} role={user.role} header='Университет'>
      {universityInfoState.loading === 'loading' ?
        (<Column style={{position: 'absolute', height: '100vh', top: 0}}>
          <CircleLoading state={universityInfoState.loading}/>
        </Column>) :
        (<Surface padding='25px'>
          <Column>
              <Text 
                themeFont={theme.fonts.h2} 
                themeColor={theme.colors.gray}>
                Название
              </Text>
              <Spacing themeSpace={10} variant='Column' />
              <Text 
                themeFont={theme.fonts.ht2} 
                style={{
                  wordBreak: 'break-word',
                  overflow: 'hidden', 
                  textOverflow: 'ellipsis'
                }} 
                themeColor={theme.colors.nothing}>
                {universityInfoState.university.name}
              </Text>
              <Spacing themeSpace={25} variant='Column' />
              <Text themeFont={theme.fonts.h2} themeColor={theme.colors.gray}>
                Описание
              </Text>
              <Spacing themeSpace={10} variant='Column' />
              <Text 
                style={{
                  wordBreak: 'break-word',
                  overflow: 'hidden', 
                  textOverflow: 'ellipsis'
                }} 
                themeFont={theme.fonts.ht2} 
                themeColor={theme.colors.nothing}>
                {universityInfoState.university.description === '' ? 'Не указано' : universityInfoState.university.description}
              </Text>
          </Column>
      </Surface>)}
      <Spacing variant='Column' themeSpace={85} />
    </WrapperMobile>
  );
});

export const UniversityInfoDesktopView: FC<UniversityInfoViewProps> = memo(({
  user,
  goToProfile,
  universityInfoState
}) => {

  return (
    <WrapperDesktop onBack={goToProfile} isCenter={true} role={user.role} header='Университет'>
      {universityInfoState.loading === 'loading' ? (
        <Column style={{position: 'absolute', height: '100vh', top: 0}}>
          <CircleLoading state={universityInfoState.loading}/>
        </Column>) :
      (<Surface padding='40px' style={{width: 'auto'}}>
        <Column style={{width: 500}}>
            <Text 
              themeFont={theme.fonts.h2} 
              themeColor={theme.colors.gray}>
              Название
            </Text>
            <Spacing themeSpace={10} variant='Column' />
            <Text 
              themeFont={theme.fonts.h2} 
              style={{
                wordBreak: 'break-word',
                overflow: 'hidden', 
                textOverflow: 'ellipsis'
              }} 
              themeColor={theme.colors.nothing}>
              {universityInfoState.university.name === '' ? 'Не указано' : universityInfoState.university.name}
            </Text>
            <Spacing themeSpace={25} variant='Column' />
            <Text themeFont={theme.fonts.h2} themeColor={theme.colors.gray}>
              Описание
            </Text>
            <Spacing themeSpace={10} variant='Column' />
            <Text 
              style={{
                wordBreak: 'break-word',
                overflow: 'hidden', 
                textOverflow: 'ellipsis'
              }} 
              themeFont={theme.fonts.h2} 
              themeColor={theme.colors.nothing}>
              {universityInfoState.university.description === '' ? 'Не указано' : universityInfoState.university.description}
            </Text>
        </Column>
      </Surface>)}
    </WrapperDesktop>
  );
});