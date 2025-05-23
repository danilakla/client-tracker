
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
import { Select } from '../../../../../../ui-kit/select';
import { SubgroupDetails, СlassGroupDetailsState } from '../../../../../../store/reducers/roles/dean/subjects-parent/class-group-details-slice';
import { Input } from '../../../../../../ui-kit/input';
import { Modal } from '../../../../../../ui-kit/modal';
import { ItemOfSelectType } from '../../../../../../ui-kit/select/select';
import { ActionExistbleButton } from '../../../../../../ui-kit/action-existble-button';
import { ScrollView } from '../../../../../../ui-kit/scroll-view';
import { ItemsContainerMobile } from '../control-subjects/control-subjects.styled';
import { CircleLoading } from '../../../../../../ui-kit/circle-loading';
import { Popup } from '../../../../../../ui-kit/popup';
import { Text } from '../../../../../../ui-kit/text';
import { Surface } from '../../../../../../ui-kit/surface';
import { ConfirmDeletePopup } from '../../../../../../components/confirm-delete-popup';
import { ActionButtonSwitch } from '../../../../../../ui-kit/action-button-switch';

export type ClassGroupsDetailsViewProps = {
  goToClassGroups: () => void;
  deanClassGroupDetailsState: СlassGroupDetailsState;
  setSelectedClassFormat: (value: ItemOfSelectType) => void;
  setDescription: (value: string) => void;
  switchIsMany: () => void;
  setSelectedTeacher: (value: ItemOfSelectType) => void;
  type: "add" | "edit";
  setSearchText: (value: string) => void;
  filteredSubgroups: SubgroupDetails[];
  createClassGroup: () => void;
  deleteClassGroup: () => void;
  filteredSubgroupsWindow: SubgroupDetails[];
  setSearchTextWindow: (value: string) => void;
  updateClassGroup: () => void;
  switchIsExistByIndex: (value: number) => void;
  switchHasApplyAttestation: () => void;
};

export const ClassGroupsDetailsView: FC<ClassGroupsDetailsViewProps> = memo(({
  goToClassGroups,
  deanClassGroupDetailsState,
  setSelectedClassFormat,
  setDescription,
  switchHasApplyAttestation,
  setSelectedTeacher,
  switchIsMany,
  deleteClassGroup,
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

  const [isOpenDeletePopup, setIsOpenDeletePopup] = useState<boolean>(false);
  const openDeletePopup = useCallback(() => {
    setIsOpenDeletePopup(true);
  },[])
  const closeDeletePopup = useCallback(() => {
    setIsOpenDeletePopup(false);
  },[])

  return (
    <>{
      isMobile ? 
      (<ClassGroupsDetailsMobileView
        controlSubroupsWindow={controlSubroupsWindow}
        isOpenSubgroups={isOpenSubgroups}
        setSelectedClassFormat={setSelectedClassFormat}
        setSelectedTeacher={setSelectedTeacher}
        switchHasApplyAttestation={switchHasApplyAttestation}
        setSearchText={setSearchText}
        updateClassGroup={updateClassGroup}
        setSearchTextWindow={setSearchTextWindow}
        setDescription={setDescription}
        filteredSubgroups={filteredSubgroups}
        switchIsExistByIndex={switchIsExistByIndex}
        filteredSubgroupsWindow={filteredSubgroupsWindow}
        deanClassGroupDetailsState={deanClassGroupDetailsState}
        goToClassGroups={goToClassGroups}
        switchIsMany={switchIsMany}
        openDeletePopup={openDeletePopup}
        createClassGroup={createClassGroup}
        type={type}
        />) :
      (<ClassGroupsDetailsDesktopView
        controlSubroupsWindow={controlSubroupsWindow}
        isOpenSubgroups={isOpenSubgroups}
        setDescription={setDescription}
        filteredSubgroups={filteredSubgroups}
        switchIsExistByIndex={switchIsExistByIndex}
        switchIsMany={switchIsMany}
        updateClassGroup={updateClassGroup}
        switchHasApplyAttestation={switchHasApplyAttestation}
        filteredSubgroupsWindow={filteredSubgroupsWindow}
        openDeletePopup={openDeletePopup}
        setSearchText={setSearchText}
        setSearchTextWindow={setSearchTextWindow}
        setSelectedClassFormat={setSelectedClassFormat}
        createClassGroup={createClassGroup}
        setSelectedTeacher={setSelectedTeacher}
        deanClassGroupDetailsState={deanClassGroupDetailsState}
        goToClassGroups={goToClassGroups}
        type={type}
        />)
    }
    <ConfirmDeletePopup 
        cancelDelete={closeDeletePopup}
        isActive={isOpenDeletePopup} 
        state={deanClassGroupDetailsState.loadingDelete}
        onDelete={deleteClassGroup} /></>
    
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
  switchHasApplyAttestation: () => void;
  switchIsExistByIndex: (value: number) => void;
  switchIsMany: () => void;
  filteredSubgroupsWindow: SubgroupDetails[];
  setSearchText: (value: string) => void;
  setSearchTextWindow: (value: string) => void;
  openDeletePopup: () => void;
};

export const ClassGroupsDetailsMobileView: FC<LocalViewProps> = memo(({
  goToClassGroups,
  createClassGroup,
  deanClassGroupDetailsState,
  filteredSubgroups,
  switchHasApplyAttestation,
  filteredSubgroupsWindow,
  setDescription,
  controlSubroupsWindow,
  setSelectedClassFormat,
  setSearchText,
  setSearchTextWindow,
  updateClassGroup,
  switchIsMany,
  isOpenSubgroups,
  switchIsExistByIndex,
  openDeletePopup,
  type,
  setSelectedTeacher
}) => {

  const filteredSubgroupsExists = filteredSubgroups.filter(item => item.isExist); 

  return (
    <WrapperMobile onBack={goToClassGroups} role='ROLE_DEAN' 
      header={'Группа занятий'}>
      {
        deanClassGroupDetailsState.loading === 'loading' ? 
        (<Column style={{position: 'absolute', height: '100dvh', top: 0}}>
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
              placeholder='Матем....' error={deanClassGroupDetailsState.errors['descriptionError']}
              value={deanClassGroupDetailsState.description} setValue={setDescription}/>
          <Spacing themeSpace={25} variant='Column' />
          <Select 
            header='Выберите преподавателя' 
            includeSearch={true}
            items={deanClassGroupDetailsState.teachers} 
            selectedItem={deanClassGroupDetailsState.selectedTeacher} 
            setValue={setSelectedTeacher}/>
          <Column style={{height: 25, flexShrink: 0}}>
            <Text themeFont={theme.fonts.ht2} themeColor={theme.colors.attentive}>
              {deanClassGroupDetailsState.errors['teacherError']}
            </Text>
          </Column>
          <Select 
            header='Выберите формат занятия' 
            includeSearch={true}
            items={deanClassGroupDetailsState.classFormats} 
            selectedItem={deanClassGroupDetailsState.selectedClassFormat} 
            setValue={setSelectedClassFormat}/>
          <Column style={{height: 25, flexShrink: 0}}>
            <Text themeFont={theme.fonts.ht2} themeColor={theme.colors.attentive}>
              {deanClassGroupDetailsState.errors['classFormatError']}
            </Text>
          </Column>
          <ActionButtonSwitch  
                  width={'100%'}
                  text='Включить в аттестацию'
                  isLeft={!deanClassGroupDetailsState.hasApplyAttestation} 
                  onClick={switchHasApplyAttestation} />
          <Spacing themeSpace={20} variant='Column' />
          <ActionButtonSwitch  
            disable={type === 'edit'} 
            text='Совместные занятия'
            isLeft={!deanClassGroupDetailsState.isMany} 
            onClick={switchIsMany} />
          <Spacing themeSpace={20} variant='Column' />
          <Column style={{maxWidth: 440}}>
            <Text themeColor={theme.colors.gray} themeFont={theme.fonts.h3}>
              Назначенные подгруппы
            </Text>
            <Spacing variant='Column' themeSpace={5}/>
            <Row style={{width: '100%'}}>
              <Search value={deanClassGroupDetailsState.searchText} setValue={setSearchText}/>
              <Spacing themeSpace={10} variant='Row' />
              <Button onClick={controlSubroupsWindow} variant='primary' padding={[12,17]}>
                Редактировать
              </Button>
            </Row>
          </Column>
          <Spacing themeSpace={10} variant='Column' />
          <ScrollView style={{maxHeight: 340, flexShrink: 0, maxWidth: 440}}>
            <Column horizontalAlign='center'>
              <ItemsContainerMobile style={{paddingBottom: 0}}>
                {filteredSubgroupsExists.length === 0 && <Text themeFont={theme.fonts.ht2}>
                  Совпадений не найдено или подгруппы не назначены
                </Text>}
                {filteredSubgroupsExists.map((item, index) => 
                <ActionButton key={index} text={item.subgroupNumber} isShowArrow={false}/>)}
              </ItemsContainerMobile>
            </Column>
          </ScrollView>
          <Spacing themeSpace={20} variant='Column' />
         {type === 'edit' && 
          <Button onClick={openDeletePopup} variant='attentive' padding={[12,17]}>
            Удалить группу занятий
          </Button>}
          <Spacing variant='Column' themeSpace={85} />
        </>)
      }
      <Modal padding='none' isActive={isOpenSubgroups} closeModal={controlSubroupsWindow}>
        <Column horizontalAlign='center' padding={25}>
          <Search value={deanClassGroupDetailsState.searchTextWindow} setValue={setSearchTextWindow}/>
          <Spacing themeSpace={15} variant='Column' />
          <Text themeColor={theme.colors.gray} themeFont={theme.fonts.h3}>
            Переназначить подгруппы
          </Text>
          <Spacing variant='Column' themeSpace={10}/>
          <ScrollView style={{maxHeight: 400, position: 'relative', maxWidth: 440}}>
            <Column horizontalAlign='center'>
              <ItemsContainerMobile style={{paddingBottom: 0}}>
              {filteredSubgroupsWindow.length === 0 && <Text themeFont={theme.fonts.ht2}>
                  Совпадений не найдено
                </Text>}
              {filteredSubgroupsWindow.map((item, index) => 
                  <ActionExistbleButton key={index} onClick={() => switchIsExistByIndex(index)} text={item.subgroupNumber} exist={item.isExist}/>)}
              </ItemsContainerMobile>
            </Column>
          </ScrollView>
          </Column>
      </Modal>
    </WrapperMobile>
  );
});

export const ClassGroupsDetailsDesktopView: FC<LocalViewProps> = memo(({
  goToClassGroups,
  createClassGroup,
  deanClassGroupDetailsState,
  switchHasApplyAttestation,
  filteredSubgroups,
  filteredSubgroupsWindow,
  setDescription,
  controlSubroupsWindow,
  setSelectedClassFormat,
  setSearchText,
  setSearchTextWindow,
  switchIsMany,
  updateClassGroup,
  isOpenSubgroups,
  openDeletePopup,
  switchIsExistByIndex,
  type,
  setSelectedTeacher
}) => {
  const filteredSubgroupsExists = filteredSubgroups.filter(item => item.isExist); 

  return (
    <WrapperDesktop onBack={goToClassGroups} role='ROLE_DEAN' header='Группа занятий' isCenter={true}>
      {
        deanClassGroupDetailsState.loading === 'loading' ? 
        (<Column style={{position: 'absolute', height: '100dvh', top: 0}}>
          <CircleLoading state={deanClassGroupDetailsState.loading}/>
        </Column>) : (<>
          <Row >
            <Column style={{width: 'auto'}}>
              <Row>
                  <Button 
                    state={deanClassGroupDetailsState.loadingAdd} 
                    onClick={type === 'add' ? createClassGroup : updateClassGroup} 
                    variant='recomended' padding={[12,17]}>
                    {type === 'add' ? 'Добавить группу занятий' : 'Сохранить изменения'}
                  </Button>
                  <Spacing themeSpace={20} variant='Row' />
                  <Button  onClick={openDeletePopup} variant='attentive' padding={[12,17]}>
                    Удалить группу занятий
                  </Button>
              </Row>
              <Spacing themeSpace={20} variant='Column' />
              <Surface style={{width: 500}}>
                <Spacing themeSpace={20} variant='Column' />
                <Input 
                    header='Введите описание' 
                    placeholder='Матем....' error={deanClassGroupDetailsState.errors['descriptionError']}
                    value={deanClassGroupDetailsState.description} setValue={setDescription}/>
                <Spacing themeSpace={25} variant='Column' />
                <Select 
                  header='Выберите преподавателя' 
                  includeSearch={true}
                  items={deanClassGroupDetailsState.teachers} 
                  selectedItem={deanClassGroupDetailsState.selectedTeacher} 
                  setValue={setSelectedTeacher}/>
                <Column style={{height: 25}}>
                  <Text themeFont={theme.fonts.ht2} themeColor={theme.colors.attentive}>
                    {deanClassGroupDetailsState.errors['teacherError']}
                  </Text>
                </Column>
                <Select 
                  header='Выберите формат занятия' 
                  includeSearch={true}
                  items={deanClassGroupDetailsState.classFormats} 
                  selectedItem={deanClassGroupDetailsState.selectedClassFormat} 
                  setValue={setSelectedClassFormat}/>
                <Column style={{height: 25}}>
                  <Text themeFont={theme.fonts.ht2} themeColor={theme.colors.attentive}>
                    {deanClassGroupDetailsState.errors['classFormatError']}
                  </Text>
                </Column>
                <ActionButtonSwitch  
                  width={'100%'}
                  text='Включить в аттестацию'
                  isLeft={!deanClassGroupDetailsState.hasApplyAttestation} 
                  onClick={switchHasApplyAttestation} />
              </Surface>
            </Column>
          <Spacing themeSpace={25} variant='Row' />
            <Surface >
              <ActionButtonSwitch  
                disable={type === 'edit'}
                text='Совместные занятия'
                isLeft={!deanClassGroupDetailsState.isMany} 
                onClick={switchIsMany} />
              <Spacing themeSpace={15} variant='Column' />
              <Text themeColor={theme.colors.gray} themeFont={theme.fonts.h3}>
                Назначенные подгруппы
              </Text>
              <Spacing variant='Column' themeSpace={5}/>
              <Row style={{width: '100%', flexShrink: 0}}>
                <Search value={deanClassGroupDetailsState.searchText} setValue={setSearchText}/>
                <Spacing themeSpace={10} variant='Row' />
                <Button onClick={controlSubroupsWindow}  variant='primary' padding={[12,17]}>
                  Редактировать
                </Button>
              </Row>
              <Spacing themeSpace={15} variant='Column' />
              <ScrollView style={{height: 255}}>
                <Column horizontalAlign='center'>
                  <ItemsContainerMobile style={{paddingBottom: 0}}>
                  {filteredSubgroupsExists.length === 0 && <Text align='center' themeFont={theme.fonts.ht2}>
                    Совпадений не найдено<br/> или подгруппы не назначены
                  </Text>}
                  {filteredSubgroupsExists.map((item, index) => 
                      <ActionButton key={index} text={item.subgroupNumber} isShowArrow={false}/>)}
                  </ItemsContainerMobile>
                </Column>
              </ScrollView>
            </Surface>
          </Row>
        </>)
      }
      <Popup padding='none' isActive={isOpenSubgroups} closePopup={controlSubroupsWindow}>
          <Column style={{width: 440}} horizontalAlign='center' padding={25}>
          <Search value={deanClassGroupDetailsState.searchTextWindow} setValue={setSearchTextWindow}/>
          <Spacing themeSpace={15} variant='Column' />
          <Text themeColor={theme.colors.gray} themeFont={theme.fonts.h3}>
            Переназначить подгруппы
          </Text>
          <Spacing variant='Column' themeSpace={10}/>
          <ScrollView style={{maxHeight: 400, position: 'relative'}}>
          <Column horizontalAlign='center'>
          <ItemsContainerMobile style={{paddingBottom: 0}}>
          {filteredSubgroupsWindow.length === 0 && <Text themeFont={theme.fonts.ht2}>
              Совпадений не найдено
            </Text>}
          {filteredSubgroupsWindow.map((item, index) => 
              <ActionExistbleButton key={index} onClick={() => switchIsExistByIndex(index)} text={item.subgroupNumber} exist={item.isExist}/>)}
          </ItemsContainerMobile>
          </Column>
          </ScrollView>
          </Column>
      </Popup>
    </WrapperDesktop>
  );
});