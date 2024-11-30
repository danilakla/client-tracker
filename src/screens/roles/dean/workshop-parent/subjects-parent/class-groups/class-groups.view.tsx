
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
import { Text } from '../../../../../../ui-kit/text';
import { ClassGroupInfo, ClassGroupsState } from '../../../../../../store/reducers/roles/dean/subjects-parent/class-groups-slice';
import { ItemsContainerMobile } from '../control-subjects/control-subjects.styled';
import { Modal } from '../../../../../../ui-kit/modal';
import { Input } from '../../../../../../ui-kit/input';
import { Textarea } from '../../../../../../ui-kit/textarea';
import { ConfirmDeletePopup } from '../../../../../../components/confirm-delete-popup';
import { CircleLoading } from '../../../../../../ui-kit/circle-loading';
import { Popup } from '../../../../../../ui-kit/popup';

export type ClassGroupsViewProps = {
  goToControlSubjects: () => void;
  deanClassGroupsState: ClassGroupsState;
  setName: (value: string) => void;
  goToClassGroupEdit: (value: number) => void;
  setDescription: (value: string) => void;
  setSearchText: (value: string) => void;
  goToClassGroupAdd: () => void;
  clearAllErrors: () => void;
  deleteSubject: (onSuccess: () => void) => void;
  updateSubject: (onSuccess: () => void) => void;
  filteredClassGroups: ClassGroupInfo[];
};

export const ClassGroupsView: FC<ClassGroupsViewProps> = memo(({
  goToControlSubjects,
  deanClassGroupsState,
  setName,
  goToClassGroupEdit,
  setDescription,
  goToClassGroupAdd,
  clearAllErrors,
  deleteSubject,
  updateSubject,
  setSearchText,
  filteredClassGroups
}) => {
  const isMobile = useMediaQuery({maxWidth: theme.toMobileSize});

  const [isOpenUpdateWindow, setIsOpenUpdateWindow] = useState<boolean>(false);

  const openUpdateWindow = useCallback(() => {
    setName(deanClassGroupsState.selectedSubject?.name || '');
    setDescription(deanClassGroupsState.selectedSubject?.description || '');
    setIsOpenUpdateWindow(true);
  },[deanClassGroupsState.selectedSubject, setName, setDescription])

  const closeUpdateWindow = useCallback(() => {
    setIsOpenUpdateWindow(false);
    setName('');
    setDescription('');
    clearAllErrors();
  },[clearAllErrors, setDescription, setName])

  const onClickUpdate = useCallback(() => {
    updateSubject(closeUpdateWindow);
  },[updateSubject, closeUpdateWindow])

  const [isOpenConfirmDelete, setIsOpenConfirmDelete] = useState<boolean>(false);

  const onCancelDelete = useCallback(()=>{
    setIsOpenConfirmDelete(false);
  },[])

  const openDeleteConfirm = useCallback(()=>{
    setIsOpenConfirmDelete(true);
  },[])

  const closeAfterDelete = useCallback(()=>{
    setIsOpenConfirmDelete(false);
    goToControlSubjects();
  },[goToControlSubjects])

  const onDelete = useCallback(()=>{
    deleteSubject(closeAfterDelete);
  },[deleteSubject, closeAfterDelete])

  return (
    <>
      {isMobile ? 
      (<ClassGroupsMobileView
        filteredClassGroups={filteredClassGroups}
        goToControlSubjects={goToControlSubjects}
        deanClassGroupsState={deanClassGroupsState}
        isOpenUpdateWindow={isOpenUpdateWindow}
        openUpdateWindow={openUpdateWindow}
        goToClassGroupEdit={goToClassGroupEdit}
        closeUpdateWindow={closeUpdateWindow}
        onClickUpdate={onClickUpdate}
        goToClassGroupAdd={goToClassGroupAdd}
        setName={setName}
        openDeleteConfirm={openDeleteConfirm}
        setDescription={setDescription}
        setSearchText={setSearchText}
        />) :
      (<ClassGroupsDesktopView
        filteredClassGroups={filteredClassGroups}
        goToControlSubjects={goToControlSubjects}
        deanClassGroupsState={deanClassGroupsState}
        isOpenUpdateWindow={isOpenUpdateWindow}
        goToClassGroupAdd={goToClassGroupAdd}
        openDeleteConfirm={openDeleteConfirm}
        openUpdateWindow={openUpdateWindow}
        closeUpdateWindow={closeUpdateWindow}
        onClickUpdate={onClickUpdate}
        goToClassGroupEdit={goToClassGroupEdit}
        setName={setName}
        setDescription={setDescription}
        setSearchText={setSearchText}
        />)}
      <ConfirmDeletePopup 
        cancelDelete={onCancelDelete}
        isActive={isOpenConfirmDelete} 
        state={deanClassGroupsState.loadingDelete}
        onDelete={onDelete} />
    </>
  );
});

type LocalViewProps = {
  goToControlSubjects: () => void;
  deanClassGroupsState: ClassGroupsState;
  filteredClassGroups: ClassGroupInfo[];
  isOpenUpdateWindow: boolean;
  openUpdateWindow: () => void;
  closeUpdateWindow: () => void;
  goToClassGroupEdit: (value: number) => void;
  openDeleteConfirm: () => void;
  goToClassGroupAdd: () => void;
  onClickUpdate: () => void;
  setName: (value: string) => void;
  setDescription: (value: string) => void;
  setSearchText: (value: string) => void;
};

export const ClassGroupsMobileView: FC<LocalViewProps> = memo(({
  goToControlSubjects,
  deanClassGroupsState,
  filteredClassGroups,
  openDeleteConfirm,
  goToClassGroupAdd,
  isOpenUpdateWindow,
  openUpdateWindow,
  closeUpdateWindow,
  onClickUpdate,
  goToClassGroupEdit,
  setName,
  setDescription,
  setSearchText
}) => {

  return (
    <WrapperMobile onBack={goToControlSubjects} role='ROLE_DEAN' header={deanClassGroupsState.selectedSubject?.name}>
      {deanClassGroupsState.loading === 'loading' ? 
        (<Column style={{position: 'absolute', height: '100vh', top: 0}}>
          <CircleLoading state={deanClassGroupsState.loading}/>
        </Column>) : (<>
        <ActionButton onClick={openUpdateWindow} text={'Информация'} />
        <Spacing themeSpace={10} variant='Column' />
        <ActionButton onClick={openDeleteConfirm}
          themeFont={theme.fonts.h2} 
          textColor={theme.colors.attentive} 
          text={'Удалить предмет'} />
        <Spacing themeSpace={25} variant='Column' />
        <Text themeFont={theme.fonts.ht1}> 
          Группы занятий
        </Text>
        <Spacing themeSpace={10} variant='Column' />
        <Row style={{width: '100%', maxWidth: 440}}>
          <Search value={deanClassGroupsState.searchText} setValue={setSearchText}/>
          <Spacing themeSpace={10} variant='Row' />
          <Button onClick={goToClassGroupAdd} borderRaius={10} variant='primary' padding={[12,10]}>
            Добавить
          </Button>
        </Row>
        <Spacing themeSpace={20} variant='Column' />
        <ItemsContainerMobile>
          {filteredClassGroups.map((item) => <>
            <ActionButton onClick={() => goToClassGroupEdit(item.idClassGroup)} text={item.description} />
            </>)}
        </ItemsContainerMobile>
        </>)
      }
      <Modal isActive={isOpenUpdateWindow} closeModal={closeUpdateWindow}> 
        <Column horizontalAlign='center'>
          <Input 
            header='Введите название' 
            placeholder='Матем....'
            error={deanClassGroupsState.errors['nameError']}
            value={deanClassGroupsState.name} 
            setValue={setName}/>
          <Spacing  themeSpace={25} variant='Column' />
          <Textarea
            value={deanClassGroupsState.description}
            placeholder='Данный ...' 
            height={150} setValue={setDescription}
            error={deanClassGroupsState.errors['descriptionError']}
            header='Введите описание' />
          <Spacing  themeSpace={25} variant='Column' />
          <Row>
            <Button 
              onClick={onClickUpdate} 
              state={deanClassGroupsState.loadingUpdate} 
              variant='recomended' padding={[12,17]}>
              Сохранить
            </Button>
            <Spacing variant='Row' themeSpace={20}/>
            <Button onClick={closeUpdateWindow} variant='attentive' padding={[12,17]}>
              Отмена
            </Button>
          </Row>
        </Column>
      </Modal>
    </WrapperMobile>
  );
});

export const ClassGroupsDesktopView: FC<LocalViewProps> = memo(({
  goToControlSubjects,
  deanClassGroupsState,
  filteredClassGroups,
  openDeleteConfirm,
  goToClassGroupAdd,
  isOpenUpdateWindow,
  openUpdateWindow,
  closeUpdateWindow,
  onClickUpdate,
  goToClassGroupEdit,
  setName,
  setDescription,
  setSearchText
}) => {

  return (
    <WrapperDesktop onBack={goToControlSubjects} role='ROLE_DEAN' header={deanClassGroupsState.selectedSubject?.name}>
      <Row style={{width: 695}}>
        <ActionButton isShowArrow={false} onClick={openUpdateWindow} text={'Информация'} />
        <Spacing themeSpace={25} variant='Row' />
        <ActionButton isShowArrow={false} onClick={openDeleteConfirm}
          themeFont={theme.fonts.h2} 
          textColor={theme.colors.attentive} 
          text={'Удалить предмет'} />
      </Row>
      <Spacing themeSpace={25} variant='Column' />
      <Text themeFont={theme.fonts.ht1}> 
        Группы занятий
      </Text>
      <Spacing themeSpace={10} variant='Column' />
      <Column horizontalAlign='center' style={{width: 695}}>
        <Row style={{width: '100%'}}>
          <Search isMobile={false} value={deanClassGroupsState.searchText} setValue={setSearchText}/>
          <Spacing themeSpace={20} variant='Row' />
          <Button onClick={goToClassGroupAdd} borderRaius={10} variant='primary' padding={[12,17]}>
            Добавить
          </Button>
        </Row>
        <Spacing themeSpace={30} variant='Column' />
        <GridContainer columns={4}>
          {filteredClassGroups.map((item) => <>
            <ActionBlockButton onClick={() => goToClassGroupEdit(item.idClassGroup)} text={item.description} />
            </>)}
        </GridContainer>
      </Column>
      <Popup isActive={isOpenUpdateWindow} closePopup={closeUpdateWindow}> 
        <Column horizontalAlign='center' style={{width: 440}}>
          <Input 
            header='Введите название' 
            placeholder='Матем....'
            error={deanClassGroupsState.errors['nameError']}
            value={deanClassGroupsState.name} 
            setValue={setName}/>
          <Spacing  themeSpace={25} variant='Column' />
          <Textarea
            value={deanClassGroupsState.description}
            placeholder='Данный ...' 
            height={150} setValue={setDescription}
            error={deanClassGroupsState.errors['descriptionError']}
            header='Введите описание' />
          <Spacing  themeSpace={25} variant='Column' />
          <Row>
            <Button 
              onClick={onClickUpdate} 
              state={deanClassGroupsState.loadingUpdate} 
              variant='recomended' padding={[12,17]}>
              Сохранить
            </Button>
            <Spacing variant='Row' themeSpace={20}/>
            <Button onClick={closeUpdateWindow} variant='attentive' padding={[12,17]}>
              Отмена
            </Button>
          </Row>
        </Column>
      </Popup>
    </WrapperDesktop>
  );
});