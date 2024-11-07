
import { FC, memo } from 'react';
import { useMediaQuery } from 'react-responsive';
import { theme } from '../../../../../ui-kit/themes/theme';
import { WrapperMobile } from '../../../../../components/wrapper-mobile';
import { WrapperDesktop } from '../../../../../components/wrapper-desktop';
import { ActionBlockButton } from '../../../../../ui-kit/action-block-button';
import { Column } from '../../../../../ui-kit/column';
import { GridContainer } from '../../../../../ui-kit/grid-container';
import { Search } from '../../../../../ui-kit/search';
import { Spacing } from '../../../../../ui-kit/spacing';
import { Button } from '../../../../../ui-kit/button';
import { Row } from '../../../../../ui-kit/row';
import { ActionButton } from '../../../../../ui-kit/action-button';
import { Popup } from '../../../../../ui-kit/popup';
import { Text } from '../../../../../ui-kit/text';

export type ControlSubjectsViewProps = {
  goToWorkshop: () => void;
};

export const ControlSubjectsView: FC<ControlSubjectsViewProps> = memo(({
  goToWorkshop
}) => {
  const isMobile = useMediaQuery({maxWidth: theme.toMobileSize});

  return (
    isMobile ? 
      (<ControlSubjectsMobileView
        goToWorkshop={goToWorkshop}
        />) :
      (<ControlSubjectsDesktopView
        goToWorkshop={goToWorkshop}
        />)
  );
});


export const ControlSubjectsMobileView: FC<ControlSubjectsViewProps> = memo(({
  goToWorkshop
}) => {

  return (
    <WrapperMobile onBack={goToWorkshop} role='ROLE_DEAN' header='Предметы'>
      <Row style={{width: '100%', maxWidth: 440}}>
        <Search value={''} setValue={()=>{}}/>
        <Spacing themeSpace={10} variant='Row' />
        <Button borderRaius={10} variant='primary' padding={[12,10]}>
          Добавить
        </Button>
      </Row>
      <Spacing themeSpace={20} variant='Column' />
      <ActionButton text={'sadasdasd'} />
      <Spacing themeSpace={10} variant='Column' />
      <ActionButton text={'sadasdasd'} />
      <Spacing themeSpace={10} variant='Column' />
      <ActionButton text={'sadasdasd'} />
      <Spacing themeSpace={10} variant='Column' />
      <ActionButton text={'sadasdasd'} />
      <Spacing themeSpace={10} variant='Column' />
      <ActionButton text={'sadasdasd'} />
      <Spacing themeSpace={10} variant='Column' />
      <ActionButton text={'sadasdasd'} />
      <Spacing themeSpace={10} variant='Column' /> 
      <ActionButton text={'sadasdasd'} />
      <Spacing themeSpace={10} variant='Column' />
      <ActionButton text={'sadasdasd'} />
      <Spacing themeSpace={10} variant='Column' />
      <ActionButton text={'sadasdasd'} />
      <Spacing themeSpace={10} variant='Column' />
      <ActionButton text={'sadasdasd'} />
      <Spacing themeSpace={10} variant='Column' />
      <ActionButton text={'sadasdasd'} />
      <Spacing themeSpace={10} variant='Column' />
      <ActionButton text={'sadasdasd'} />
      <Spacing themeSpace={10} variant='Column' />
      <ActionButton text={'sadasdasd'} />
      <Spacing themeSpace={10} variant='Column' />
      <ActionButton text={'sadasdasd'} />
      <Spacing themeSpace={10} variant='Column' />
    </WrapperMobile>
  );
});

export const ControlSubjectsDesktopView: FC<ControlSubjectsViewProps> = memo(({
  goToWorkshop
}) => {

  return (
    <WrapperDesktop onBack={goToWorkshop} role='ROLE_DEAN' header='Предметы'>
      <Column horizontalAlign='center' style={{width: 695}}>
        <Row style={{width: '100%'}}>
          <Search isMobile={false} value={''} setValue={()=>{}}/>
          <Spacing themeSpace={20} variant='Row' />
          <Button borderRaius={10} variant='primary' padding={[12,17]}>
            Добавить
          </Button>
        </Row>
        <Spacing themeSpace={30} variant='Column' />
        <GridContainer columns={4}>
          <ActionBlockButton text={'sadasdas'} />
          <ActionBlockButton text={'sadasdas'} />
          <ActionBlockButton text={'sadasdas'} />
          <ActionBlockButton text={'sadasdas'} />
          <ActionBlockButton text={'sadasdas'} />
          <ActionBlockButton text={'sadasdas'} />
          <ActionBlockButton text={'sadasdas'} />
          <ActionBlockButton text={'sadasdas'} />
          <ActionBlockButton text={'sadasdas'} />
          <ActionBlockButton text={'sadasdas'} />
          <ActionBlockButton text={'sadasdas'} />
          <ActionBlockButton text={'sadasdas'} />
          <ActionBlockButton text={'sadasdas'} />
          <ActionBlockButton text={'sadasdas'} />
          <ActionBlockButton text={'sadasdas'} />
          <ActionBlockButton text={'sadasdas'} />
        </GridContainer>
      </Column>
     
    </WrapperDesktop>
  );
});