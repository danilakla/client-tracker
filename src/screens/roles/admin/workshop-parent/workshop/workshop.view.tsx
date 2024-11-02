
import { FC, memo } from 'react';
import { useMediaQuery } from 'react-responsive';
import { WrapperMobile } from '../../../../../components/wrapper-mobile';
import { WrapperDesktop } from '../../../../../components/wrapper-desktop';
import { theme } from '../../../../../ui-kit/themes/theme';
import { ActionBlockButton } from '../../../../../ui-kit/action-block-button';
import { ActionButton } from '../../../../../ui-kit/action-button';
import { GridContainer } from '../../../../../ui-kit/grid-container';
import { Spacing } from '../../../../../ui-kit/spacing';
import { Column } from '../../../../../ui-kit/column';

export type WorkshopViewProps = {
  goToGeneratorKeys: () => void;
  goToUniversityEditor: () => void;
};

export const WorkshopView: FC<WorkshopViewProps> = memo(({
  goToGeneratorKeys,
  goToUniversityEditor
}) => {
  const isMobile = useMediaQuery({maxWidth: theme.toMobileSize});

  return (
    isMobile ? 
      (<WorkshopMobileView
        goToUniversityEditor={goToUniversityEditor}
        goToGeneratorKeys={goToGeneratorKeys}
        />) :
      (<WorkshopDesktopView
        goToUniversityEditor={goToUniversityEditor}
        goToGeneratorKeys={goToGeneratorKeys}
        />)
  );
});


export const WorkshopMobileView: FC<WorkshopViewProps> = memo(({
  goToGeneratorKeys,
  goToUniversityEditor
}) => {

  return (
    <WrapperMobile role='ROLE_ADMIN' header='Мастерская'>
      <ActionButton onClick={goToGeneratorKeys} text='Генерация ключей' />
      <Spacing variant='Column' themeSpace={10} />
      <ActionButton onClick={goToUniversityEditor} text='Университет' />
      <Spacing variant='Column' themeSpace={10} />
      <ActionButton text='Участники' />
    </WrapperMobile>
  );
});

export const WorkshopDesktopView: FC<WorkshopViewProps> = memo(({
  goToGeneratorKeys,
  goToUniversityEditor
}) => {

  return (
    <WrapperDesktop role='ROLE_ADMIN' header='Мастерская' isCenter={true}>
      <Column style={{width: 'auto'}}>
        <GridContainer columns={3}>
          <ActionBlockButton onClick={goToGeneratorKeys} text='Генерация ключей' />
          <ActionBlockButton onClick={goToUniversityEditor} text='Университет' />
          <ActionBlockButton text='Участники' />
        </GridContainer>
      </Column>
    </WrapperDesktop>
  );
});