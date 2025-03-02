
import { FC, memo, useCallback, useState } from 'react';
import { useMediaQuery } from 'react-responsive';
import { WrapperMobile } from '../../../../../components/wrapper-mobile';
import { WrapperDesktop } from '../../../../../components/wrapper-desktop';
import { theme } from '../../../../../ui-kit/themes/theme';
import { Search } from '../../../../../ui-kit/search';
import { Spacing } from '../../../../../ui-kit/spacing';
import { GridContainer } from '../../../../../ui-kit/grid-container';
import { ActionBlockButton } from '../../../../../ui-kit/action-block-button';
import { Column } from '../../../../../ui-kit/column';
import { ActionButton } from '../../../../../ui-kit/action-button';
import { Row } from '../../../../../ui-kit/row';
import { Button } from '../../../../../ui-kit/button';
import { Popup } from '../../../../../ui-kit/popup';
import { Text } from '../../../../../ui-kit/text';
import { Input } from '../../../../../ui-kit/input';
import { Modal } from '../../../../../ui-kit/modal';
import { ClassFormatInfo, ClassFormatsState } from '../../../../../store/reducers/roles/dean/class-formats-slice';
import { Textarea } from '../../../../../ui-kit/textarea';
import { CircleLoading } from '../../../../../ui-kit/circle-loading';
import { ConfirmDeletePopup } from '../../../../../components/confirm-delete-popup';
import { ItemsContainerMobile } from '../subjects-parent/control-subjects/control-subjects.styled';

export type ClassFormatsViewProps = {
  goToWorkshop: () => void;
  setSearchTextAction: (value: string) => void;
  deanClassFormatsState: ClassFormatsState;
  setSelectedClassFormat: (value: ClassFormatInfo) => void;
  clearAllErrors: () => void;
  setNewInfoOfClassFormat: (value: string) => void;
  filteredListFormats: ClassFormatInfo[];
  addClassFormat: (onSuccess?: () => void) => void
  setNewNameOfClassFormat: (value: string) => void;
  updateClassFormat: (onSuccess?: () => void) => void;
  deleteClassFormat: (onSuccess?: () => void) => void;
};

export const ClassFormatsView: FC<ClassFormatsViewProps> = memo(({
  goToWorkshop,
  setSelectedClassFormat,
  setSearchTextAction,
  setNewInfoOfClassFormat,
  setNewNameOfClassFormat,
  updateClassFormat,
  addClassFormat,
  clearAllErrors,
  filteredListFormats,
  deleteClassFormat,
  deanClassFormatsState
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
    setNewInfoOfClassFormat('');
    setNewNameOfClassFormat('');
    clearAllErrors();
  },[clearAllErrors, setNewNameOfClassFormat, setNewInfoOfClassFormat])

  const onDelete = useCallback(()=>{
    deleteClassFormat(closeAfterDelete);
  },[deleteClassFormat, closeAfterDelete])

  const closeAdd = useCallback(()=>{
    setIsOpenAdd(false);
    setNewInfoOfClassFormat('');
    setNewNameOfClassFormat('');
    clearAllErrors();
  },[setNewInfoOfClassFormat, clearAllErrors, setNewNameOfClassFormat])

  const closeEdit = useCallback(()=>{
    setIsOpenEditor(false);
    setNewInfoOfClassFormat('');
    setNewNameOfClassFormat('');
    clearAllErrors();
  },[setNewInfoOfClassFormat, clearAllErrors, setNewNameOfClassFormat])

  const openConfirmDelete = useCallback(()=>{
    setIsOpenConfirmDelete(true);
  },[])

  const onClickAdd = useCallback(()=>{
    addClassFormat(closeAdd);
  },[addClassFormat, closeAdd])

  const openCreator = useCallback(()=>{
    setIsOpenAdd(true);
  },[])

  const onClickCard = useCallback((value: ClassFormatInfo)=>{
    setSelectedClassFormat(value);
    openEditor();
  },[setSelectedClassFormat, openEditor])
  
  const onClickSave = useCallback(()=>{
    updateClassFormat(closeEdit);
  },[updateClassFormat, closeEdit])

  return (
    isMobile ? 
      (<ClassFormatsMobileView
        onClickAdd={onClickAdd}
        setNewInfoOfClassFormat={setNewInfoOfClassFormat}
        setNewNameOfClassFormat={setNewNameOfClassFormat}
        isOpenConfirmDelete={isOpenConfirmDelete}
        isOpenEditor={isOpenEditor}
        closeAdd={closeAdd}
        setSearchTextAction={setSearchTextAction}
        onCancelDelete={onCancelDelete}
        openCreator={openCreator}
        onClickCard={onClickCard}
        openConfirmDelete={openConfirmDelete}
        onClickSave={onClickSave}
        filteredListFormats={filteredListFormats}
        closeEdit={closeEdit}
        isOpenAdd={isOpenAdd}
        onDelete={onDelete}
        goToWorkshop={goToWorkshop}
        deanClassFormatsState={deanClassFormatsState}
        />) :
      (<ClassFormatsDesktopView
        onClickAdd={onClickAdd}
        onDelete={onDelete}
        onClickSave={onClickSave}
        filteredListFormats={filteredListFormats}
        openConfirmDelete={openConfirmDelete}
        setNewInfoOfClassFormat={setNewInfoOfClassFormat}
        setNewNameOfClassFormat={setNewNameOfClassFormat}
        setSearchTextAction={setSearchTextAction}
        isOpenConfirmDelete={isOpenConfirmDelete}
        isOpenEditor={isOpenEditor}
        openCreator={openCreator}
        onClickCard={onClickCard}
        isOpenAdd={isOpenAdd}
        closeAdd={closeAdd}
        onCancelDelete={onCancelDelete}
        closeEdit={closeEdit}
        goToWorkshop={goToWorkshop}
        deanClassFormatsState={deanClassFormatsState}
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
  filteredListFormats: ClassFormatInfo[];
  setNewInfoOfClassFormat: (value: string) => void;
  setNewNameOfClassFormat: (value: string) => void;
  setSearchTextAction: (value: string) => void;
  onCancelDelete: () => void;
  deanClassFormatsState: ClassFormatsState;
  onClickCard: (value: ClassFormatInfo) => void;
  closeAdd: () => void;
  closeEdit: () => void;
}

export const ClassFormatsMobileView: FC<LocalViewData> = memo(({
  goToWorkshop,
  isOpenConfirmDelete,
  isOpenEditor,
  isOpenAdd,
  openCreator,
  onClickAdd,
  filteredListFormats,
  setSearchTextAction,
  closeAdd,
  onCancelDelete,
  onClickSave,
  onClickCard,
  openConfirmDelete,
  onDelete,
  closeEdit,
  setNewNameOfClassFormat,
  setNewInfoOfClassFormat,
  deanClassFormatsState
}) => {

  return (
    <WrapperMobile onBack={goToWorkshop} role='ROLE_DEAN' header='Форматы занятий'>
      {deanClassFormatsState.loading === 'loading' && 
        <Column style={{position: 'absolute', height: window.innerHeight, top: 0}}>
          <CircleLoading state={deanClassFormatsState.loading}/>
        </Column>
      }
      <Row style={{width: '100%', maxWidth: 440}}>
        <Search value={deanClassFormatsState.searchText} setValue={setSearchTextAction}/>
        <Spacing themeSpace={10} variant='Row' />
        <Button onClick={openCreator} variant='primary' padding={[12,10]}>
          Добавить
        </Button>
      </Row>
      <Spacing themeSpace={20} variant='Column' />
      <ItemsContainerMobile>
      {filteredListFormats.map((item, index) =>
          <ActionButton key={index} onClick={() => onClickCard(item)} text={item.formatName} />)}
      </ItemsContainerMobile>
      <Modal isActive={isOpenAdd} closeModal={closeAdd}>
        <Column horizontalAlign='center'>
          <Input 
            header='Введите название' 
            placeholder='Лекция....'
            error={deanClassFormatsState.errors['newNameOfClassFormatError']}
            value={deanClassFormatsState.newNameOfClassFormat} 
            setValue={setNewNameOfClassFormat}/>
          <Spacing  themeSpace={25} variant='Column' />
          <Textarea
            value={deanClassFormatsState.newInfoOfClassFormat} 
            placeholder='Данный ...' 
            height={200} setValue={setNewInfoOfClassFormat}
            error={deanClassFormatsState.errors['newInfoOfClassFormatError']}
            header='Описание' />
          <Spacing  themeSpace={25} variant='Column' />
          <Row>
            <Button 
              onClick={onClickAdd} 
              state={deanClassFormatsState.loadingAction} 
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
            placeholder='Лекция....'
            error={deanClassFormatsState.errors['newNameOfClassFormatError']}
            value={deanClassFormatsState.newNameOfClassFormat} 
            setValue={setNewNameOfClassFormat}/>
          <Spacing  themeSpace={25} variant='Column' />
          <Textarea
            value={deanClassFormatsState.newInfoOfClassFormat} 
            placeholder='Данный ...' 
            height={100} setValue={setNewInfoOfClassFormat}
            error={deanClassFormatsState.errors['newInfoOfClassFormatError']}
            header='Описание' />
          <Spacing  themeSpace={25} variant='Column' />
          <Row>
            <Button 
              onClick={onClickSave} 
              state={deanClassFormatsState.loadingAction} 
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
        state={deanClassFormatsState.loadingDelete}
        onDelete={onDelete} />
    </WrapperMobile>
  );
});

export const ClassFormatsDesktopView: FC<LocalViewData> = memo(({
  goToWorkshop,
  isOpenConfirmDelete,
  isOpenEditor,
  closeAdd,
  openCreator,
  openConfirmDelete,
  isOpenAdd,
  setSearchTextAction,
  onDelete,
  filteredListFormats,
  setNewNameOfClassFormat,
  onClickAdd,
  setNewInfoOfClassFormat,
  onCancelDelete,
  onClickCard,
  onClickSave,
  closeEdit,
  deanClassFormatsState
}) => {

  return (
    <WrapperDesktop onBack={goToWorkshop} role='ROLE_DEAN' header='Форматы занятий'>
      {deanClassFormatsState.loading === 'loading' && 
        <Column style={{position: 'absolute', height: window.innerHeight, top: 0}}>
          <CircleLoading state={deanClassFormatsState.loading}/>
        </Column>
      }
      <Column horizontalAlign='center' style={{width: 695, height: '100%'}}>
        <Row style={{width: '100%'}}>
          <Search isMobile={false} 
            value={deanClassFormatsState.searchText} 
            setValue={setSearchTextAction}/>
          <Spacing themeSpace={20} variant='Row' />
          <Button onClick={openCreator} variant='primary' padding={[12,17]}>
            Добавить
          </Button>
        </Row>
        <Spacing themeSpace={30} variant='Column' />
        <GridContainer columns={4}>
          {filteredListFormats.map((item, index) =>
            <ActionBlockButton key={index} text={item.formatName} onClick={() => onClickCard(item)} />)}
        </GridContainer>
      </Column>
      <Popup isActive={isOpenAdd} closePopup={closeAdd}>
        <Column horizontalAlign='center' style={{width: 440}}>
          <Input 
            header='Введите название' 
            placeholder='Лекция....'
            error={deanClassFormatsState.errors['newNameOfClassFormatError']}
            value={deanClassFormatsState.newNameOfClassFormat} 
            setValue={setNewNameOfClassFormat}/>
          <Spacing  themeSpace={25} variant='Column' />
          <Textarea
            value={deanClassFormatsState.newInfoOfClassFormat} 
            placeholder='Данный ...' 
            height={200} setValue={setNewInfoOfClassFormat}
            error={deanClassFormatsState.errors['newInfoOfClassFormatError']}
            header='Описание' />
          <Spacing  themeSpace={25} variant='Column' />
          <Row>
            <Button 
              onClick={onClickAdd} 
              state={deanClassFormatsState.loadingAction} 
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
            placeholder='Лекция....'
            error={deanClassFormatsState.errors['newNameOfClassFormatError']}
            value={deanClassFormatsState.newNameOfClassFormat} 
            setValue={setNewNameOfClassFormat}/>
          <Spacing  themeSpace={25} variant='Column' />
          <Textarea
            value={deanClassFormatsState.newInfoOfClassFormat} 
            placeholder='Данный ...' 
            height={100} setValue={setNewInfoOfClassFormat}
            error={deanClassFormatsState.errors['newInfoOfClassFormatError']}
            header='Описание' />
          <Spacing  themeSpace={25} variant='Column' />
          <Row>
            <Button 
              onClick={onClickSave} 
              state={deanClassFormatsState.loadingAction} 
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
        state={deanClassFormatsState.loadingDelete}
        isActive={isOpenConfirmDelete} 
        onDelete={onDelete} />
    </WrapperDesktop>
  );
});