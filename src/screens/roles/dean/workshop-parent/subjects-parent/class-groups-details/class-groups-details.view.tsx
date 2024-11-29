
import { FC, memo, useCallback, useState } from 'react';
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
import { SubgroupDetails, СlassGroupDetailsState } from '../../../../../../store/reducers/roles/dean/subjects-parent/class-group-details-slice';
import { Input } from '../../../../../../ui-kit/input';
import { Modal } from '../../../../../../ui-kit/modal';
import { ItemOfSelectType } from '../../../../../../ui-kit/select/select';
import { ActionExistbleButton } from '../../../../../../ui-kit/action-existble-button';
import { ScrollView } from '../../../../../../ui-kit/scroll-view';
import { ItemsContainerMobile } from '../control-subjects/control-subjects.styled';
import { CircleLoading } from '../../../../../../ui-kit/circle-loading';

export type ClassGroupsDetailsViewProps = {
  goToClassGroups: () => void;
  deanClassGroupDetailsState: СlassGroupDetailsState;
  setSelectedClassFormat: (value: ItemOfSelectType) => void;
  setDescription: (value: string) => void;
  setSelectedTeacher: (value: ItemOfSelectType) => void;
  type: "add" | "edit";
  setSearchText: (value: string) => void;
  filteredSubgroups: SubgroupDetails[];
  createClassGroup: () => void;
  filteredSubgroupsWindow: SubgroupDetails[];
  setSearchTextWindow: (value: string) => void;
  updateClassGroup: () => void;
  switchIsExistByIndex: (value: number) => void;
};

export const ClassGroupsDetailsView: FC<ClassGroupsDetailsViewProps> = memo(({
  goToClassGroups,
  deanClassGroupDetailsState,
  setSelectedClassFormat,
  setDescription,
  setSelectedTeacher,
  createClassGroup,
  updateClassGroup,
  setSearchText,
  filteredSubgroups,
  switchIsExistByIndex,
  filteredSubgroupsWindow,
  setSearchTextWindow,
  type
}) => {
  const isMobile = useMediaQuery({maxWidth: theme.toMobileSize});

  const [isOpenSubgroups, setIsOpenSubgroups] = useState<boolean>(false);
  const controlSubroupsWindow = useCallback(() => {
    setIsOpenSubgroups(!isOpenSubgroups);
    setSearchTextWindow('');
  },[isOpenSubgroups, setSearchTextWindow])

  return (
    isMobile ? 
      (<ClassGroupsDetailsMobileView
        controlSubroupsWindow={controlSubroupsWindow}
        isOpenSubgroups={isOpenSubgroups}
        setSelectedClassFormat={setSelectedClassFormat}
        setSelectedTeacher={setSelectedTeacher}
        setSearchText={setSearchText}
        updateClassGroup={updateClassGroup}
        setSearchTextWindow={setSearchTextWindow}
        setDescription={setDescription}
        filteredSubgroups={filteredSubgroups}
        switchIsExistByIndex={switchIsExistByIndex}
        filteredSubgroupsWindow={filteredSubgroupsWindow}
        deanClassGroupDetailsState={deanClassGroupDetailsState}
        goToClassGroups={goToClassGroups}
        createClassGroup={createClassGroup}
        type={type}
        />) :
      (<ClassGroupsDetailsDesktopView
        controlSubroupsWindow={controlSubroupsWindow}
        isOpenSubgroups={isOpenSubgroups}
        setDescription={setDescription}
        filteredSubgroups={filteredSubgroups}
        switchIsExistByIndex={switchIsExistByIndex}
        updateClassGroup={updateClassGroup}
        filteredSubgroupsWindow={filteredSubgroupsWindow}
        setSearchText={setSearchText}
        setSearchTextWindow={setSearchTextWindow}
        setSelectedClassFormat={setSelectedClassFormat}
        createClassGroup={createClassGroup}
        setSelectedTeacher={setSelectedTeacher}
        deanClassGroupDetailsState={deanClassGroupDetailsState}
        goToClassGroups={goToClassGroups}
        type={type}
        />)
  );
});

type LocalViewProps = {
  goToClassGroups: () => void;
  type: "add" | "edit";
  isOpenSubgroups: boolean;
  controlSubroupsWindow: () => void;
  setSelectedClassFormat: (value: ItemOfSelectType) => void;
  setSelectedTeacher: (value: ItemOfSelectType) => void;
  setDescription: (value: string) => void;
  createClassGroup: () => void;
  updateClassGroup: () => void;
  deanClassGroupDetailsState: СlassGroupDetailsState;
  filteredSubgroups: SubgroupDetails[];
  switchIsExistByIndex: (value: number) => void;
  filteredSubgroupsWindow: SubgroupDetails[];
  setSearchText: (value: string) => void;
  setSearchTextWindow: (value: string) => void;
};

export const ClassGroupsDetailsMobileView: FC<LocalViewProps> = memo(({
  goToClassGroups,
  createClassGroup,
  deanClassGroupDetailsState,
  filteredSubgroups,
  filteredSubgroupsWindow,
  setDescription,
  controlSubroupsWindow,
  setSelectedClassFormat,
  setSearchText,
  setSearchTextWindow,
  updateClassGroup,
  isOpenSubgroups,
  switchIsExistByIndex,
  type,
  setSelectedTeacher
}) => {

  const filteredSubgroupsExists = filteredSubgroups.filter(item => item.isExist); 

  return (
    <WrapperMobile onBack={goToClassGroups} role='ROLE_DEAN' 
      header={'Группа занятий'}>
      {
        deanClassGroupDetailsState.loading === 'loading' ? 
        (<Column style={{position: 'absolute', height: '100vh', top: 0}}>
          <CircleLoading state={deanClassGroupDetailsState.loading}/>
        </Column>) : (<>
          <Row>
            <Button 
              state={deanClassGroupDetailsState.loadingAdd} 
              onClick={type === 'add' ? createClassGroup : updateClassGroup} 
              variant='recomended' padding={[12,17]}>
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
          <Button onClick={controlSubroupsWindow} variant='primary' padding={[12,17]}>
            Редактировать группы
          </Button>
          <Spacing themeSpace={15} variant='Column' />
          {filteredSubgroupsExists.length > 0 && <Search value={deanClassGroupDetailsState.searchText} setValue={setSearchText}/>}
          <Spacing themeSpace={10} variant='Column' />
          <ItemsContainerMobile>
          {
            filteredSubgroupsExists.map((item, index) => 
              <ActionButton text={item.subgroupNumber} isShowArrow={false}/>)
          }
          </ItemsContainerMobile>
        </>)
      }
      <Modal padding='none' isActive={isOpenSubgroups} closeModal={controlSubroupsWindow}>
        <ScrollView style={{maxHeight: 300, position: 'relative'}}>
          <Column horizontalAlign='center' padding={25}>
          <Search value={deanClassGroupDetailsState.searchTextWindow} setValue={setSearchTextWindow}/>
          <Spacing themeSpace={10} variant='Column' />
          <ItemsContainerMobile>
          {
            filteredSubgroupsWindow.map((item, index) => 
              <ActionExistbleButton onClick={() => switchIsExistByIndex(index)} text={item.subgroupNumber} exist={item.isExist}/>)
          }
          </ItemsContainerMobile>
          </Column>
        </ScrollView>
      </Modal>
    </WrapperMobile>
  );
});

export const ClassGroupsDetailsDesktopView: FC<LocalViewProps> = memo(() => {

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