
import { FC, memo } from 'react';
import { theme } from '../../../../../../ui-kit/themes/theme';
import { useMediaQuery } from 'react-responsive';
import { WrapperMobile } from '../../../../../../components/wrapper-mobile';
import { WrapperDesktop } from '../../../../../../components/wrapper-desktop';
import { ActionButton } from '../../../../../../ui-kit/action-button';
import { Spacing } from '../../../../../../ui-kit/spacing';
import { ActionBlockButton } from '../../../../../../ui-kit/action-block-button';
import { GridContainer } from '../../../../../../ui-kit/grid-container';
import { Column } from '../../../../../../ui-kit/column';

export type AttestationViewProps = {
  goToAttestationStart: () => void;
  goToAttestationStudents: () => void;
  goToAttestationTeachers: () => void;
  goToDeanWorkshop: () => void;
};

export const AttestationView: FC<AttestationViewProps> = memo(({
  goToAttestationStart,
  goToAttestationStudents,
  goToAttestationTeachers,
  goToDeanWorkshop
}) => {
  const isMobile = useMediaQuery({maxWidth: theme.toMobileSize});

  return (
    isMobile ? 
      (<AttestationMobileView
        goToAttestationStart={goToAttestationStart}
        goToAttestationStudents={goToAttestationStudents}
        goToAttestationTeachers={goToAttestationTeachers}
        goToDeanWorkshop={goToDeanWorkshop}
        />) :
      (<AttestationDesktopView
        goToAttestationStart={goToAttestationStart}
        goToAttestationStudents={goToAttestationStudents}
        goToAttestationTeachers={goToAttestationTeachers}
        goToDeanWorkshop={goToDeanWorkshop}
        />)
  );
});


type LocalViewProps = {
  goToAttestationStart: () => void;
  goToAttestationStudents: () => void;
  goToAttestationTeachers: () => void;
  goToDeanWorkshop: () => void;
};

export const AttestationMobileView: FC<LocalViewProps> = memo(({
  goToAttestationStart,
  goToAttestationStudents,
  goToAttestationTeachers,
  goToDeanWorkshop
}) => {

  return (
    <WrapperMobile role='ROLE_DEAN' header='Аттестация' onBack={goToDeanWorkshop}>
      <ActionButton onClick={goToAttestationStart} text='Запуск аттестации' />
      <Spacing variant='Column' themeSpace={10} />
      <ActionButton onClick={goToAttestationTeachers} text='Список преподавателей' />
      <Spacing variant='Column' themeSpace={10} />
      <ActionButton onClick={goToAttestationStudents} text='Список задолжников' />
      <Spacing variant='Column' themeSpace={85} />
    </WrapperMobile>
  );
});

export const AttestationDesktopView: FC<LocalViewProps> = memo(({
  goToAttestationStart,
  goToAttestationStudents,
  goToAttestationTeachers,
  goToDeanWorkshop
}) => {

  return (
    <WrapperDesktop role='ROLE_DEAN' header='Аттестация' onBack={goToDeanWorkshop} isCenter={true}>
      <Column style={{width: 'auto'}}>
        <GridContainer columns={3} style={{paddingBottom: 0}}>
          <ActionBlockButton onClick={goToAttestationStart} text='Запуск аттестации' />
          <ActionBlockButton onClick={goToAttestationTeachers} text='Список преподавателей' />
          <ActionBlockButton onClick={goToAttestationStudents} text='Список задолжников' />
        </GridContainer>
      </Column>
    </WrapperDesktop>
  );
});