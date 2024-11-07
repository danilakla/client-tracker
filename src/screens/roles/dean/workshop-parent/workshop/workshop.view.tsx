
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
};

export const WorkshopView: FC<WorkshopViewProps> = memo(({
  goToSpecialties,
  goToClassFormats,
  goToControlSubjects
}) => {
  const isMobile = useMediaQuery({maxWidth: theme.toMobileSize});

  return (
    isMobile ? 
      (<WorkshopMobileView
        goToSpecialties={goToSpecialties}
        goToClassFormats={goToClassFormats}
        goToControlSubjects={goToControlSubjects}
        />) :
      (<WorkshopDesktopView
        goToSpecialties={goToSpecialties}
        goToClassFormats={goToClassFormats}
        goToControlSubjects={goToControlSubjects}
        />)
  );
});


export const WorkshopMobileView: FC<WorkshopViewProps> = memo(({
  goToSpecialties,
  goToClassFormats,
  goToControlSubjects
}) => {

  return (
    <WrapperMobile role='ROLE_DEAN' header='Мастерская'>
      <ActionButton onClick={goToControlSubjects} text='Предметы' />
      <Spacing variant='Column' themeSpace={10} />
      <ActionButton onClick={goToClassFormats} text='Форматы занятий' />
      <Spacing variant='Column' themeSpace={10} />
      <ActionButton onClick={goToSpecialties} text='Специальности' />
    </WrapperMobile>
  );
});

export const WorkshopDesktopView: FC<WorkshopViewProps> = memo(({
  goToSpecialties,
  goToClassFormats,
  goToControlSubjects
}) => {

  return (
    <WrapperDesktop role='ROLE_DEAN' header='Мастерская' isCenter={true}>
      <Column style={{width: 'auto'}}>
        <GridContainer columns={3}>
          <ActionBlockButton onClick={goToControlSubjects} text='Предметы' />
          <ActionBlockButton onClick={goToClassFormats} text='Форматы занятий' />
          <ActionBlockButton onClick={goToSpecialties} text='Специаль- ности' />
        </GridContainer>
      </Column>
    </WrapperDesktop>
  );
});