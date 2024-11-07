
import { FC, memo } from 'react';
import { useMediaQuery } from 'react-responsive';
import { theme } from '../../../../../ui-kit/themes/theme';
import { WrapperMobile } from '../../../../../components/wrapper-mobile';
import { WrapperDesktop } from '../../../../../components/wrapper-desktop';
import { ActionButton } from '../../../../../ui-kit/action-button';
import { Spacing } from '../../../../../ui-kit/spacing';
import { Search } from '../../../../../ui-kit/search';
import { Row } from '../../../../../ui-kit/row';
import { Button } from '../../../../../ui-kit/button';
import { GridContainer } from '../../../../../ui-kit/grid-container';
import { ActionBlockButton } from '../../../../../ui-kit/action-block-button';
import { Column } from '../../../../../ui-kit/column';
import { Popup } from '../../../../../ui-kit/popup';
import { Text } from '../../../../../ui-kit/text';
import { Surface } from '../../../../../ui-kit/surface';
import { Input } from '../../../../../ui-kit/input';

export type SpecialtiesViewProps = {
  goToWorkshop: () => void;
};

export const SpecialtiesView: FC<SpecialtiesViewProps> = memo(({
  goToWorkshop
}) => {
  const isMobile = useMediaQuery({maxWidth: theme.toMobileSize});

  return (
    isMobile ? 
      (<SpecialtiesMobileView
        goToWorkshop={goToWorkshop}
        />) :
      (<SpecialtiesDesktopView
        goToWorkshop={goToWorkshop}
        />)
  );
});


export const SpecialtiesMobileView: FC<SpecialtiesViewProps> = memo(({
  goToWorkshop
}) => {

  return (
    <WrapperMobile onBack={goToWorkshop} role='ROLE_DEAN' header='Специальности'>
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

export const SpecialtiesDesktopView: FC<SpecialtiesViewProps> = memo(({
  goToWorkshop
}) => {

  return (
    <WrapperDesktop onBack={goToWorkshop} role='ROLE_DEAN' header='Специальности'>
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
      <Popup isActive={false} closePopup={()=>{}}>
        <Column horizontalAlign='center'>
          <Text themeColor={theme.colors.attentive} themeFont={theme.fonts.h2} align='center'> 
            Вы уверены, <br/>
            что хотите удалить?
          </Text>
          <Spacing  themeSpace={25} variant='Column' />
          <Row>
            <Button onClick={()=>{}} state={'idle'} variant='attentive' padding={[12,17]}>
              Удалить
            </Button>
            <Spacing variant='Row' themeSpace={20}/>
            <Button onClick={()=>{}} state={'idle'} variant='recomended' padding={[12,17]}>
              Отмена
            </Button>
          </Row>
        </Column>
      </Popup>
      <Popup isActive={false} closePopup={()=>{}}>
        <Column horizontalAlign='center'>
          <Input 
            width={340}
            header='Введите название' 
            placeholder='Информационных....'
            value={'sadas'} setValue={() => {}}/>
          <Spacing  themeSpace={25} variant='Column' />
          <Row>
            <Button onClick={()=>{}} state={'idle'} variant='recomended' padding={[12,17]}>
              Добавить
            </Button>
            <Spacing variant='Row' themeSpace={20}/>
            <Button onClick={()=>{}} state={'idle'} variant='attentive' padding={[12,17]}>
              Отмена
            </Button>
          </Row>
        </Column>
      </Popup>
      <Popup themeColor={theme.colors.surface} isActive={false} closePopup={()=>{}} padding='35px'>
        <Column horizontalAlign='center'>
          <Text themeFont={theme.fonts.h1}  align='center'> 
            Редактирование
          </Text>
          <Spacing variant='Column' themeSpace={20}/>
          <Surface borderColor={theme.colors.foreground} style={{boxShadow: '0 0px 16px rgba(0, 0, 0, 0.2)'}}>
            <Column horizontalAlign='center'>
              <Input 
                header='Изменить название' 
                placeholder='Информационных....'
                value={'sadas'} setValue={() => {}}/>
              <Spacing  themeSpace={25} variant='Column' />
              <Row>
                <Button onClick={()=>{}} state={'idle'} variant='recomended' padding={[12,17]}>
                  Сохранить
                </Button>
                <Spacing variant='Row' themeSpace={20}/>
                <Button onClick={()=>{}} state={'idle'} variant='attentive' padding={[12,17]}>
                  Отмена
                </Button>
              </Row>
            </Column>
          </Surface>
          <Spacing variant='Column' themeSpace={30}/>
          <Button borderRaius={10} width={340} onClick={()=>{}} state={'idle'} variant='attentive' padding={[12,17]}>
            Удалить
          </Button>
        </Column>
      </Popup>
    </WrapperDesktop>
  );
});