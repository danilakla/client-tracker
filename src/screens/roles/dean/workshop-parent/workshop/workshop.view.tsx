
import { FC, memo } from 'react';
import { useMediaQuery } from 'react-responsive';
import { theme } from '../../../../../ui-kit/themes/theme';
import { WrapperMobile } from '../../../../../components/wrapper-mobile';
import { WrapperDesktop } from '../../../../../components/wrapper-desktop';
import { Column } from '../../../../../ui-kit/column';
import { GridContainer } from '../../../../../ui-kit/grid-container';
import { ActionBlockButton } from '../../../../../ui-kit/action-block-button';
import { ActionButton } from '../../../../../ui-kit/action-button';
import { Spacing } from '../../../../../ui-kit/spacing';

export type WorkshopViewProps = {
  goToSpecialties: () => void;
  goToClassFormats: () => void;
  goToControlSubjects: () => void;
  goToGenerateStudents: () => void;
  goToDeanStudents: () => void;
  goToAttestation: () => void;
};

export const WorkshopView: FC<WorkshopViewProps> = memo(({
  goToSpecialties,
  goToClassFormats,
  goToGenerateStudents,
  goToDeanStudents,
  goToControlSubjects,
  goToAttestation
}) => {
  const isMobile = useMediaQuery({maxWidth: theme.toMobileSize});

  return (
    isMobile ? 
      (<WorkshopMobileView
        goToSpecialties={goToSpecialties}
        goToClassFormats={goToClassFormats}
        goToDeanStudents={goToDeanStudents}
        goToGenerateStudents={goToGenerateStudents}
        goToAttestation={goToAttestation}
        goToControlSubjects={goToControlSubjects}
        />) :
      (<WorkshopDesktopView
        goToSpecialties={goToSpecialties}
        goToDeanStudents={goToDeanStudents}
        goToClassFormats={goToClassFormats}
        goToGenerateStudents={goToGenerateStudents}
        goToControlSubjects={goToControlSubjects}
        goToAttestation={goToAttestation}
        />)
  );
});


export const WorkshopMobileView: FC<WorkshopViewProps> = memo(({
  goToSpecialties,
  goToClassFormats,
  goToControlSubjects,
  goToGenerateStudents,
  goToDeanStudents,
  goToAttestation
}) => {

  return (
    <WrapperMobile role='ROLE_DEAN' header='Мастерская'>
      <ActionButton onClick={goToControlSubjects} text='Предметы' />
      <Spacing variant='Column' themeSpace={10} />
      <ActionButton onClick={goToClassFormats} text='Форматы занятий' />
      <Spacing variant='Column' themeSpace={10} />
      <ActionButton onClick={goToSpecialties} text='Специальности' />
      <Spacing variant='Column' themeSpace={10} />
      <ActionButton onClick={goToGenerateStudents} text='Генерация студентов' />
      <Spacing variant='Column' themeSpace={10} />
      <ActionButton onClick={goToDeanStudents} text='Студенты' />
      <Spacing variant='Column' themeSpace={10} />
      <ActionButton onClick={goToAttestation} text='Аттестация' />
      <Spacing variant='Column' themeSpace={85} />
    </WrapperMobile>
  );
});

export const WorkshopDesktopView: FC<WorkshopViewProps> = memo(({
  goToSpecialties,
  goToClassFormats,
  goToControlSubjects,
  goToGenerateStudents,
  goToDeanStudents,
  goToAttestation
}) => {

  return (
    <WrapperDesktop role='ROLE_DEAN' header='Мастерская' isCenter={true}>
      <Column style={{width: 'auto'}}>
        <GridContainer columns={4}>
          <ActionBlockButton onClick={goToControlSubjects} text='Предметы' />
          <ActionBlockButton onClick={goToClassFormats} text='Форматы занятий' />
          <ActionBlockButton onClick={goToSpecialties} text='Специаль- ности' />
          <ActionBlockButton onClick={goToGenerateStudents} text='Генерация студентов' />
          <ActionBlockButton onClick={goToDeanStudents} text='Студенты' />
          <ActionBlockButton onClick={goToAttestation} text='Аттестация' />
        </GridContainer>
      </Column>
    </WrapperDesktop>
  );
});