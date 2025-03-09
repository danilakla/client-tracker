
import { FC, memo, useCallback, useState } from 'react';
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
import { Input } from '../../../../../ui-kit/input';
import { SpecialtyInfo, SpecialtyState } from '../../../../../store/reducers/roles/dean/specialties-slice';
import { ConfirmDeletePopup } from '../../../../../components/confirm-delete-popup';
import { CircleLoading } from '../../../../../ui-kit/circle-loading';
import { Modal } from '../../../../../ui-kit/modal';
import { ItemsContainerMobile } from '../subjects-parent/control-subjects/control-subjects.styled';

export type SpecialtiesViewProps = {
  goToWorkshop: () => void;
  setSearchTextAction: (value: string) => void;
  setSelectedSpecialty: (value: SpecialtyInfo) => void
  clearAllErrors: () => void;
  setNewNameOfSpecialty: (value: string) => void;
  filteredSpecialities: SpecialtyInfo[];
  deanSpecialtiesState: SpecialtyState;
  addSpecialtyAction: (onSuccess?: () => void) => void;
  deleteSpecialty: (onSuccess?: () => void) => void;
  updateSpecialty: (onSuccess?: () => void) => void;
};

export const SpecialtiesView: FC<SpecialtiesViewProps> = memo(({
  goToWorkshop,
  setSearchTextAction,
  setNewNameOfSpecialty,
  setSelectedSpecialty,
  addSpecialtyAction,
  deleteSpecialty,
  clearAllErrors,
  updateSpecialty,
  filteredSpecialities,
  deanSpecialtiesState
}) => {
  const isMobile = useMediaQuery({maxWidth: theme.toMobileSize});

  const [isOpenEditor, setIsOpenEditor] = useState<boolean>(false);
  const [isOpenAdd, setIsOpenAdd] = useState<boolean>(false);
  const [isOpenConfirmDelete, setIsOpenConfirmDelete] = useState<boolean>(false);

  const openEditor = useCallback(()=>{
    setIsOpenEditor(true);
  },[])

  const onCancelDelete = useCallback(()=>{
    setIsOpenConfirmDelete(false);
  },[])

  const closeAfterDelete = useCallback(()=>{
    setIsOpenConfirmDelete(false);
    setIsOpenEditor(false);
    setNewNameOfSpecialty('');
    clearAllErrors();
  },[clearAllErrors, setNewNameOfSpecialty])

  const onDelete = useCallback(()=>{
    deleteSpecialty(closeAfterDelete);
  },[deleteSpecialty, closeAfterDelete])

  const closeAdd = useCallback(()=>{
    setIsOpenAdd(false);
    setNewNameOfSpecialty('');
    clearAllErrors();
  },[setNewNameOfSpecialty, clearAllErrors])

  const closeEdit = useCallback(()=>{
    setIsOpenEditor(false);
    setNewNameOfSpecialty('');
    clearAllErrors();
  },[setNewNameOfSpecialty, clearAllErrors])

  const openConfirmDelete = useCallback(()=>{
    setIsOpenConfirmDelete(true);
  },[])

  const onClickAdd = useCallback(()=>{
    addSpecialtyAction(closeAdd);
  },[addSpecialtyAction, closeAdd])

  const openCreator = useCallback(()=>{
    setIsOpenAdd(true);
  },[])

  const onClickCard = useCallback((value: SpecialtyInfo)=>{
    setSelectedSpecialty(value);
    openEditor();
  },[setSelectedSpecialty, openEditor])
  
  const onClickSave = useCallback(()=>{
    updateSpecialty(closeEdit);
  },[updateSpecialty, closeEdit])

  return (
    isMobile ? 
      (<SpecialtiesMobileView
        onClickAdd={onClickAdd}
        setNewNameOfSpecialty={setNewNameOfSpecialty}
        isOpenConfirmDelete={isOpenConfirmDelete}
        isOpenEditor={isOpenEditor}
        closeAdd={closeAdd}
        setSearchTextAction={setSearchTextAction}
        onCancelDelete={onCancelDelete}
        openCreator={openCreator}
        onClickCard={onClickCard}
        openConfirmDelete={openConfirmDelete}
        onClickSave={onClickSave}
        filteredSpecialities={filteredSpecialities}
        closeEdit={closeEdit}
        isOpenAdd={isOpenAdd}
        onDelete={onDelete}
        goToWorkshop={goToWorkshop}
        deanSpecialtiesState={deanSpecialtiesState}
        />) :
      (<SpecialtiesDesktopView
        onClickAdd={onClickAdd}
        setNewNameOfSpecialty={setNewNameOfSpecialty}
        isOpenConfirmDelete={isOpenConfirmDelete}
        isOpenEditor={isOpenEditor}
        closeAdd={closeAdd}
        setSearchTextAction={setSearchTextAction}
        onCancelDelete={onCancelDelete}
        openCreator={openCreator}
        onClickCard={onClickCard}
        openConfirmDelete={openConfirmDelete}
        onClickSave={onClickSave}
        filteredSpecialities={filteredSpecialities}
        closeEdit={closeEdit}
        isOpenAdd={isOpenAdd}
        onDelete={onDelete}
        goToWorkshop={goToWorkshop}
        deanSpecialtiesState={deanSpecialtiesState}
        />)
  );
});


type LocalViewData = {
  isOpenEditor: boolean;
  isOpenConfirmDelete: boolean;
  onClickSave: () => void;
  goToWorkshop: () => void;
  isOpenAdd: boolean;
  onDelete: () => void;
  openCreator: () => void;
  openConfirmDelete: () => void;
  onClickAdd: () => void;
  filteredSpecialities: SpecialtyInfo[]
  setNewNameOfSpecialty: (value: string) => void;
  setSearchTextAction: (value: string) => void;
  onCancelDelete: () => void;
  deanSpecialtiesState: SpecialtyState
  onClickCard: (value: SpecialtyInfo) => void;
  closeAdd: () => void;
  closeEdit: () => void;
}

export const SpecialtiesMobileView: FC<LocalViewData> = memo(({
  goToWorkshop,
  isOpenConfirmDelete,
  isOpenEditor,
  isOpenAdd,
  openCreator,
  onClickAdd,
  filteredSpecialities,
  setSearchTextAction,
  closeAdd,
  onCancelDelete,
  onClickSave,
  onClickCard,
  openConfirmDelete,
  onDelete,
  closeEdit,
  setNewNameOfSpecialty,
  deanSpecialtiesState
}) => {

  return (
    <WrapperMobile onBack={goToWorkshop} role='ROLE_DEAN' header='Специальности'>
      {deanSpecialtiesState.loading === 'loading' && 
        <Column style={{position: 'absolute', height: '100dvh', top: 0}}>
          <CircleLoading state={deanSpecialtiesState.loading}/>
        </Column>
      }
      <Row style={{width: '100%', maxWidth: 440}}>
        <Search value={deanSpecialtiesState.searchText} setValue={setSearchTextAction}/>
        <Spacing themeSpace={10} variant='Row' />
        <Button onClick={openCreator} variant='primary' padding={[12,10]}>
          Добавить
        </Button>
      </Row>
      <Spacing themeSpace={20} variant='Column' />
      <ItemsContainerMobile>
      {filteredSpecialities.map((item, index) =>
          <ActionButton key={index} onClick={() => onClickCard(item)} text={item.name}/>)}
      </ItemsContainerMobile>
      <Modal isActive={isOpenAdd} closeModal={closeAdd}>
        <Column horizontalAlign='center'>
          <Input 
            header='Введите название' 
            placeholder='Программ....'
            error={deanSpecialtiesState.errors['newNameOfSpecialtyError']}
            value={deanSpecialtiesState.newNameOfSpecialty} 
            setValue={setNewNameOfSpecialty}/>
          <Spacing  themeSpace={25} variant='Column' />
          <Row>
            <Button 
              onClick={onClickAdd} 
              state={deanSpecialtiesState.loadingAction} 
              variant='recomended' padding={[12,17]}>
              Добавить
            </Button>
            <Spacing variant='Row' themeSpace={20}/>
            <Button onClick={closeAdd} variant='attentive' padding={[12,17]}>
              Отмена
            </Button>
          </Row>
        </Column>
      </Modal>
      <Modal themeColor={theme.colors.surface} isActive={isOpenEditor} closeModal={closeEdit}>
        <Column horizontalAlign='center'>
          <Text themeFont={theme.fonts.h2}  align='center'> 
            Редактирование формата занятия
          </Text>
          <Spacing variant='Column' themeSpace={35}/>
          <Input 
            header='Название' 
            placeholder='Программная инженерия....'
            error={deanSpecialtiesState.errors['newNameOfSpecialtyError']}
            value={deanSpecialtiesState.newNameOfSpecialty} 
            setValue={setNewNameOfSpecialty}/>
          <Spacing  themeSpace={25} variant='Column' />
          <Row>
            <Button 
              onClick={onClickSave} 
              state={deanSpecialtiesState.loadingAction} 
              variant='recomended' padding={[12,17]}>
              Сохранить
            </Button>
            <Spacing variant='Row' themeSpace={20}/>
            <Button onClick={closeEdit} variant='attentive' padding={[12,17]}>
              Отмена
            </Button>
          </Row>
          <Spacing variant='Column' themeSpace={35}/>
          <Button style={{width: '100%', maxWidth: 440}} 
            onClick={openConfirmDelete} 
            state={'idle'} 
            variant='attentive' padding={[12,17]}>
            Удалить
          </Button>
        </Column>
      </Modal>
      <ConfirmDeletePopup 
        cancelDelete={onCancelDelete}
        isActive={isOpenConfirmDelete} 
        state={deanSpecialtiesState.loadingDelete}
        onDelete={onDelete} />
    </WrapperMobile>
  );
});

export const SpecialtiesDesktopView: FC<LocalViewData> = memo(({
  goToWorkshop,
  isOpenConfirmDelete,
  isOpenEditor,
  isOpenAdd,
  openCreator,
  onClickAdd,
  filteredSpecialities,
  setSearchTextAction,
  closeAdd,
  onCancelDelete,
  onClickSave,
  onClickCard,
  openConfirmDelete,
  onDelete,
  closeEdit,
  setNewNameOfSpecialty,
  deanSpecialtiesState
}) => {

  return (
    <WrapperDesktop onBack={goToWorkshop} role='ROLE_DEAN' header='Специальности'>
      {deanSpecialtiesState.loading === 'loading' && 
        <Column style={{position: 'absolute', height: '100dvh', top: 0}}>
          <CircleLoading state={deanSpecialtiesState.loading}/>
        </Column>
      }
      <Column horizontalAlign='center' style={{width: 695, height: '100%'}}>
        <Row style={{width: '100%'}}>
          <Search isMobile={false} 
            value={deanSpecialtiesState.searchText} 
            setValue={setSearchTextAction}/>
          <Spacing themeSpace={20} variant='Row' />
          <Button onClick={openCreator} variant='primary' padding={[12,17]}>
            Добавить
          </Button>
        </Row>
        <Spacing themeSpace={30} variant='Column' />
        <GridContainer columns={4}>
          {filteredSpecialities.map((item, index) =>
            <ActionBlockButton key={index} text={item.name} onClick={() => onClickCard(item)} />)}
        </GridContainer>
      </Column>
      <Popup isActive={isOpenAdd} closePopup={closeAdd}>
        <Column horizontalAlign='center' style={{width: 440}}>
          <Input 
            header='Введите название' 
            placeholder='Программная инженерия....'
            error={deanSpecialtiesState.errors['newNameOfSpecialtyError']}
            value={deanSpecialtiesState.newNameOfSpecialty} 
            setValue={setNewNameOfSpecialty}/>
          <Spacing  themeSpace={25} variant='Column' />
          <Row>
            <Button 
              onClick={onClickAdd} 
              state={deanSpecialtiesState.loadingAction} 
              variant='recomended' padding={[12,17]}>
              Добавить
            </Button>
            <Spacing variant='Row' themeSpace={20}/>
            <Button onClick={closeAdd} variant='attentive' padding={[12,17]}>
              Отмена
            </Button>
          </Row>
        </Column>
      </Popup>
      <Popup 
        themeColor={theme.colors.secondary} 
        isActive={isOpenEditor} 
        closePopup={closeEdit} padding='35px'>
        <Column horizontalAlign='center'>
          <Column horizontalAlign='center' style={{width: 440}}>
          <Input 
            header='Название' 
            placeholder='Программная инженерия....'
            error={deanSpecialtiesState.errors['newNameOfSpecialtyError']}
            value={deanSpecialtiesState.newNameOfSpecialty} 
            setValue={setNewNameOfSpecialty}/>
          <Spacing  themeSpace={25} variant='Column' />
          <Row>
            <Button 
              onClick={onClickSave} 
              state={deanSpecialtiesState.loadingAction} 
              variant='recomended' padding={[12,17]}>
              Сохранить
            </Button>
            <Spacing variant='Row' themeSpace={20}/>
            <Button onClick={closeEdit} variant='attentive' padding={[12,17]}>
              Отмена
            </Button>
          </Row>
        </Column>
        <Spacing variant='Column' themeSpace={30}/>
        <Button 
           width={340} 
          onClick={openConfirmDelete} 
          state={'idle'} variant='attentive' padding={[12,17]}>
          Удалить
        </Button>
        </Column>
      </Popup>
      <ConfirmDeletePopup 
        cancelDelete={onCancelDelete}
        state={deanSpecialtiesState.loadingDelete}
        isActive={isOpenConfirmDelete} 
        onDelete={onDelete} />
    </WrapperDesktop>
  );
});