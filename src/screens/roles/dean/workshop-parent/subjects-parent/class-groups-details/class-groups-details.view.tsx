
import { FC, memo } from 'react';
import { useMediaQuery } from 'react-responsive';
import { theme } from '../../../../../../ui-kit/themes/theme';
import { WrapperMobile } from '../../../../../../components/wrapper-mobile';
import { Row } from '../../../../../../ui-kit/row';
import { Search } from '../../../../../../ui-kit/search';
import { Button } from '../../../../../../ui-kit/button';
import { Spacing } from '../../../../../../ui-kit/spacing';
import { ActionButton } from '../../../../../../ui-kit/action-button';
import { WrapperDesktop } from '../../../../../../components/wrapper-desktop';
import { Column } from '../../../../../../ui-kit/column';
import { GridContainer } from '../../../../../../ui-kit/grid-container';
import { ActionBlockButton } from '../../../../../../ui-kit/action-block-button';
import { Select } from '../../../../../../ui-kit/select';
import { СlassGroupDetailsState } from '../../../../../../store/reducers/roles/dean/subjects-parent/class-group-details-slice';
import { Input } from '../../../../../../ui-kit/input';
import { Modal } from '../../../../../../ui-kit/modal';
import { ItemOfSelectType } from '../../../../../../ui-kit/select/select';

export type ClassGroupsDetailsViewProps = {
  goToClassGroups: () => void;
  deanClassGroupDetailsState: СlassGroupDetailsState;
  setSelectedClassFormat: (value: ItemOfSelectType) => void;
  setDescription: (value: string) => void;
  setSelectedTeacher: (value: ItemOfSelectType) => void;
  type: "add" | "edit";
};

export const ClassGroupsDetailsView: FC<ClassGroupsDetailsViewProps> = memo(({
  goToClassGroups,
  deanClassGroupDetailsState,
  setSelectedClassFormat,
  setDescription,
  setSelectedTeacher,
  type
}) => {
  const isMobile = useMediaQuery({maxWidth: theme.toMobileSize});

  return (
    isMobile ? 
      (<ClassGroupsDetailsMobileView
        setSelectedClassFormat={setSelectedClassFormat}
        setSelectedTeacher={setSelectedTeacher}
        setDescription={setDescription}
        deanClassGroupDetailsState={deanClassGroupDetailsState}
        goToClassGroups={goToClassGroups}
        type={type}
        // goToWorkshop={goToWorkshop}
        />) :
      (<ClassGroupsDetailsDesktopView
        setDescription={setDescription}
        setSelectedClassFormat={setSelectedClassFormat}
        setSelectedTeacher={setSelectedTeacher}
        deanClassGroupDetailsState={deanClassGroupDetailsState}
        goToClassGroups={goToClassGroups}
        type={type}
        // goToWorkshop={goToWorkshop}
        />)
  );
});

type LocalViewProps = {
  goToClassGroups: () => void;
  type: "add" | "edit";
  setSelectedClassFormat: (value: ItemOfSelectType) => void;
  setSelectedTeacher: (value: ItemOfSelectType) => void;
  setDescription: (value: string) => void;
  deanClassGroupDetailsState: СlassGroupDetailsState;
};

export const ClassGroupsDetailsMobileView: FC<LocalViewProps> = memo(({
  goToClassGroups,
  deanClassGroupDetailsState,
  setDescription,
  setSelectedClassFormat,
  type,
  setSelectedTeacher
}) => {

  return (
    <WrapperMobile onBack={goToClassGroups} role='ROLE_DEAN' 
      header={'Группа занятий'}>
      <Row>
        <Button onClick={() => {}} variant='recomended' padding={[12,17]}>
          {type === 'add' ? 'Добавить' : 'Сохранить'}
        </Button>
        <Spacing themeSpace={25} variant='Row' />
        <Button onClick={goToClassGroups} variant='attentive' padding={[12,17]}>
          Отмена
        </Button>
      </Row>
      <Spacing themeSpace={20} variant='Column' />
      <Input 
          header='Введите описание' 
          placeholder='Белоруccкий....' error={deanClassGroupDetailsState.errors['descriptionError']}
          value={deanClassGroupDetailsState.description} setValue={setDescription}/>
      <Spacing themeSpace={25} variant='Column' />
      <Select 
        header='Выберите преподавателя' 
        includeSearch={true}
        items={deanClassGroupDetailsState.teachers} 
        selectedItem={deanClassGroupDetailsState.selectedTeacher} 
        setValue={setSelectedTeacher}/>
      <Spacing themeSpace={25} variant='Column' />
      <Select 
        header='Выберите формат занятия' 
        includeSearch={true}
        items={deanClassGroupDetailsState.classFormats} 
        selectedItem={deanClassGroupDetailsState.selectedClassFormat} 
        setValue={setSelectedClassFormat}/>
      <Spacing themeSpace={25} variant='Column' />
      <Button onClick={() => {}} variant='primary' padding={[12,17]}>
        Редактировать группы
      </Button>
      <Spacing themeSpace={25} variant='Column' />
      <ActionButton text='1 курс - 6.1 группа' isShowArrow={false} />
      <Spacing themeSpace={10} variant='Column' />
      <ActionButton text='1 курс - 6.1 группа' isShowArrow={false} />
      <Spacing themeSpace={10} variant='Column' />
      <ActionButton text='1 курс - 6.1 группа' isShowArrow={false} />
      <Spacing themeSpace={10} variant='Column' />
      <ActionButton text='1 курс - 6.1 группа' isShowArrow={false} />
      <Spacing themeSpace={10} variant='Column' />
      <ActionButton text='1 курс - 6.1 группа' isShowArrow={false} />
    </WrapperMobile>
  );
});

export const ClassGroupsDetailsDesktopView: FC<LocalViewProps> = memo(({
}) => {

  return (
    <WrapperDesktop onBack={() => {}} role='ROLE_DEAN' header='Предметы'>
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