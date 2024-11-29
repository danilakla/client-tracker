
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
import { Modal } from '../../../../../../ui-kit/modal';
import { Input } from '../../../../../../ui-kit/input';
import { Textarea } from '../../../../../../ui-kit/textarea';
import { ControlSubjectsState, SubjectInfo } from '../../../../../../store/reducers/roles/dean/subjects-parent/control-subjects-slice';
import { ItemsContainerMobile } from './control-subjects.styled';
import { CircleLoading } from '../../../../../../ui-kit/circle-loading';

export type ControlSubjectsViewProps = {
  goToWorkshop: () => void;
  createSubject: (onSuccess?: () => void) => void;
  deanControlSubjectsState: ControlSubjectsState;
  setName: (value: string) => void;
  filteredSubjects: SubjectInfo[];
  clearAllErrors: () => void;
  setDescription: (value: string) => void;
  goClassGroups: (value: SubjectInfo) => void;
  setSearchText: (value: string) => void;
};

export const ControlSubjectsView: FC<ControlSubjectsViewProps> = memo(({
  goToWorkshop,
  deanControlSubjectsState,
  setName,
  setSearchText,
  createSubject,
  goClassGroups,
  setDescription,
  filteredSubjects,
  clearAllErrors
}) => {
  const isMobile = useMediaQuery({maxWidth: theme.toMobileSize});

  const [isOpenAddWindow, setIsOpenWindow] = useState<boolean>(false);

  const openAddWindow = useCallback(() => {
    setIsOpenWindow(true);
  },[])

  const closeAddWindow = useCallback(() => {
    setIsOpenWindow(false);
    setName('');
    setDescription('');
    clearAllErrors();
  },[clearAllErrors, setDescription, setName])

  const onClickAdd = useCallback(() => {
    createSubject(closeAddWindow);
  },[createSubject, closeAddWindow])

  return (
    isMobile ? 
      (<ControlSubjectsMobileView
        deanControlSubjectsState={deanControlSubjectsState}
        goToWorkshop={goToWorkshop}
        setDescription={setDescription}
        setName={setName}
        onClickAdd={onClickAdd}
        openAddWindow={openAddWindow}
        setSearchText={setSearchText}
        filteredSubjects={filteredSubjects}
        closeAddWindow={closeAddWindow}
        isOpenAddWindow={isOpenAddWindow}
        goClassGroups={goClassGroups}
        />) :
      (<ControlSubjectsDesktopView
        deanControlSubjectsState={deanControlSubjectsState}
        goToWorkshop={goToWorkshop}
        setDescription={setDescription}
        filteredSubjects={filteredSubjects}
        setName={setName}
        setSearchText={setSearchText}
        onClickAdd={onClickAdd}
        openAddWindow={openAddWindow}
        closeAddWindow={closeAddWindow}
        isOpenAddWindow={isOpenAddWindow}
        goClassGroups={goClassGroups}
        />)
  );
});

type LocalViewProps = {
  goClassGroups: (value: SubjectInfo) => void;
  goToWorkshop: () => void;
  setName: (value: string) => void;
  setDescription: (value: string) => void;
  filteredSubjects: SubjectInfo[];
  deanControlSubjectsState: ControlSubjectsState;
  openAddWindow: () => void;
  onClickAdd: () => void;
  setSearchText: (value: string) => void;
  closeAddWindow: () => void;
  isOpenAddWindow: boolean;
};

export const ControlSubjectsMobileView: FC<LocalViewProps> = memo(({
  goToWorkshop,
  deanControlSubjectsState,
  goClassGroups,
  setName,
  setSearchText,
  filteredSubjects,
  setDescription,
  openAddWindow,
  closeAddWindow,
  isOpenAddWindow,
  onClickAdd
}) => {

  return (
    <WrapperMobile onBack={goToWorkshop} role='ROLE_DEAN' header='Предметы'>
      {deanControlSubjectsState.loading === 'loading' && 
        <Column style={{position: 'absolute', height: '100vh', top: 0}}>
          <CircleLoading state={deanControlSubjectsState.loading}/>
        </Column>
      }
      <Row style={{width: '100%', maxWidth: 440}}>
        <Search value={deanControlSubjectsState.searchText} setValue={setSearchText}/>
        <Spacing themeSpace={10} variant='Row' />
        <Button onClick={openAddWindow} borderRaius={10} variant='primary' padding={[12,10]}>
          Добавить
        </Button>
      </Row>
      <Spacing themeSpace={20} variant='Column' />
      <ItemsContainerMobile>
        {filteredSubjects.map((item) => <>
          <ActionButton onClick={() => goClassGroups(item)} text={item.name} />
          </>)}
      </ItemsContainerMobile>
      <Modal isActive={isOpenAddWindow} closeModal={closeAddWindow}> 
        <Column horizontalAlign='center'>
          <Input 
            header='Введите название' 
            placeholder='Матем....'
            error={deanControlSubjectsState.errors['nameError']}
            value={deanControlSubjectsState.name} 
            setValue={setName}/>
          <Spacing  themeSpace={25} variant='Column' />
          <Textarea
            value={deanControlSubjectsState.description}
            placeholder='Данный ...' 
            height={150} setValue={setDescription}
            error={deanControlSubjectsState.errors['descriptionError']}
            header='Введите описание' />
          <Spacing  themeSpace={25} variant='Column' />
          <Row>
            <Button 
              onClick={onClickAdd} 
              state={deanControlSubjectsState.loadingCreate} 
              variant='recomended' padding={[12,17]}>
              Добавить
            </Button>
            <Spacing variant='Row' themeSpace={20}/>
            <Button onClick={closeAddWindow} variant='attentive' padding={[12,17]}>
              Отмена
            </Button>
          </Row>
        </Column>
      </Modal>
    </WrapperMobile>
  );
});

export const ControlSubjectsDesktopView: FC<LocalViewProps> = memo(() => {

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