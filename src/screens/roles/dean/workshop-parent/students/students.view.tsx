
import { FC, memo, useCallback, useEffect, useState } from 'react';
import { useMediaQuery } from 'react-responsive';
import { theme } from '../../../../../ui-kit/themes/theme';
import { WrapperMobile } from '../../../../../components/wrapper-mobile';
import { WrapperDesktop } from '../../../../../components/wrapper-desktop';
import { ScreenContainer } from './students.styled';
import { Column } from '../../../../../ui-kit/column';
import { Search } from '../../../../../ui-kit/search';
import { StudentInfoState, StudentsState, SubgroupInfoState } from '../../../../../store/reducers/roles/dean/students-slice';
import { ActionButton } from '../../../../../ui-kit/action-button';
import { Spacing } from '../../../../../ui-kit/spacing';
import { Text } from '../../../../../ui-kit/text';
import { Row } from '../../../../../ui-kit/row';
import { Button } from '../../../../../ui-kit/button';
import { Surface } from '../../../../../ui-kit/surface';
import { Image } from '../../../../../ui-kit/image';
import accountLogoSVG from '../../../../../images/account-image.svg';
import { Textarea } from '../../../../../ui-kit/textarea';
import { Popup } from '../../../../../ui-kit/popup';
import { CircleLoading } from '../../../../../ui-kit/circle-loading';
import { Modal } from '../../../../../ui-kit/modal';
import { Input } from '../../../../../ui-kit/input';
import { ConfirmDeletePopup } from '../../../../../components/confirm-delete-popup';
import { GridContainer } from '../../../../../ui-kit/grid-container';
import { ActionBlockButton } from '../../../../../ui-kit/action-block-button';

export type StudentsViewProps = {
  goToWorkshop: () => void;
  deanStudentsState: StudentsState;
  setSearchSubgroups: (value: string) => void;
  recoveryPasswordForStudent: (onSuccess: () => void) => void;
  setSearchStudents: (value: string) => void;
  onCreate: (onSuccess: () => void) => void;
  setNewLastname: (value: string) => void;
  setNewName: (value: string) => void;
  onUpdate: (onSuccess: () => void) => void;
  clearForm: () => void;
  deleteStudent: (onSuccess: () => void) => void;
  setNewSurname: (value: string) => void;
  setSelectedSubgroup: (value: SubgroupInfoState) => void;
  setSelectedStudent: (value: StudentInfoState) => void;
  deleteSubgroup: (onSuccess: () => void) => void;
};

export const StudentsView: FC<StudentsViewProps> = memo(({
  goToWorkshop,
  deanStudentsState,
  setSearchStudents,
  setSearchSubgroups,
  deleteSubgroup,
  onCreate,
  setNewLastname,
  clearForm,
  deleteStudent,
  onUpdate,
  recoveryPasswordForStudent,
  setNewName,
  setNewSurname,
  setSelectedStudent,
  setSelectedSubgroup
}) => {
  const isMobile = useMediaQuery({maxWidth: theme.toMobileSize});

  const [currentScreen, setCurrentScreen] = useState<'all' | 'subgroup' | 'student'>('all');

  const headers = {
    all: 'Список групп',
    subgroup: `${deanStudentsState.selectedSubgroup.subgroup.subgroupNumber}`,
    student: 'Студент'
  };

  const handleBackActions = {
    all: goToWorkshop,
    subgroup: () => {
      setCurrentScreen('all');
      setSearchStudents('');
    },
    student: () => setCurrentScreen('subgroup')
  };

  const goToSubgroupDetails = useCallback((value: SubgroupInfoState) => {
    setSelectedSubgroup(value);
    setCurrentScreen('subgroup');
  },[setSelectedSubgroup])

  const goToStudentDetails = useCallback((value: StudentInfoState) => {
    setSelectedStudent(value);
    setCurrentScreen('student');
  },[setSelectedStudent])

  const [isOpenEditAccountDataPopup, setIsOpenEditAccountDataPopup] = useState<boolean>(false);
  const [isOpenConfirmRecoveryPopup, setIsOpenConfirmRecoveryPopup] = useState<boolean>(false);
  const [isOpenNewPasswordPopup, setIsOpenNewPasswordPopup] = useState<boolean>(false);
  const [isOpenConfirmDeletePopup, setIsOpenConfirmmDeletePopup] = useState<boolean>(false);

  const [isOpenCreateStudentPopup, setIsOpenCreateStudentPopup] = useState<boolean>(false);

  const openCreateStudentPopup = useCallback(() => {
    setIsOpenCreateStudentPopup(true);
  },[])

  const fioFields = deanStudentsState.selectedStudent.flpName.split(' ');

  const openUpdateAccountData = useCallback(() => {
    setNewLastname(fioFields[0]);
    setNewName(fioFields[1]);
    setNewSurname(fioFields[2]);

    setIsOpenEditAccountDataPopup(true);
  },[
    setNewLastname,
    setNewName,
    setNewSurname,
    fioFields
  ])

  const cancelUpdateAccountData = useCallback(() => {
    setIsOpenEditAccountDataPopup(false);
    clearForm();
  },[clearForm])

  const cancelCreateAccountData = useCallback(() => {
    setIsOpenCreateStudentPopup(false);
    clearForm();
  },[clearForm])

  const controlConfirmDeletePopup = useCallback(() => {
    setIsOpenConfirmmDeletePopup(!isOpenConfirmDeletePopup);
  },[isOpenConfirmDeletePopup])

  const controlConfirmRecoveryPopup = useCallback(() => {
    setIsOpenConfirmRecoveryPopup(!isOpenConfirmRecoveryPopup);
  },[isOpenConfirmRecoveryPopup])

  const openNewPasswordPopup = useCallback(() => {
    setIsOpenConfirmRecoveryPopup(false);
    setIsOpenNewPasswordPopup(true);
  },[])

  const confirmRecovery = useCallback(() => {
    recoveryPasswordForStudent(openNewPasswordPopup);
  },[recoveryPasswordForStudent, openNewPasswordPopup])
  
  const closePopups = useCallback(() => {
    setIsOpenConfirmRecoveryPopup(false);
    setIsOpenNewPasswordPopup(false);
  },[])

  const returnBackAfterDelete = useCallback(() => {
    setCurrentScreen('subgroup');
    setIsOpenConfirmmDeletePopup(false);
  },[])

  const onClickDelete = useCallback(() => {
    deleteStudent(returnBackAfterDelete);
  },[deleteStudent, returnBackAfterDelete])

  const onSave = useCallback(() => {
    onUpdate(cancelUpdateAccountData);
  },[onUpdate, cancelUpdateAccountData])

  const onClickCreate = useCallback(() => {
    onCreate(cancelCreateAccountData);
  },[onCreate, cancelCreateAccountData])

  const [isOpenDeleteSubgroupPopup, setIsOpenDeleteSubgroupPopup] = useState<boolean>(false);

  const openDeleteSubgroupPopup = useCallback(() => {
    setIsOpenDeleteSubgroupPopup(true);
  },[])
  const closeDeleteSubgroupPopup = useCallback(() => {
    setIsOpenDeleteSubgroupPopup(false);
  },[])

  const afterDeleteSubgroupPopup = useCallback(() => {
    setIsOpenDeleteSubgroupPopup(false);
    setCurrentScreen('all');
  },[])

  const onDeleteSubgroup = useCallback(() => {
    deleteSubgroup(afterDeleteSubgroupPopup);
  },[deleteSubgroup, afterDeleteSubgroupPopup])

  return (
    <>
    <Column style={{position: 'absolute', height: '100vh', top: 0, zIndex: -1}}>
      <CircleLoading state={deanStudentsState.loading}/>
    </Column>  
    {isMobile ? 
      (<WrapperMobile 
        onBack={handleBackActions[currentScreen]}  
        role='ROLE_DEAN' header={headers[currentScreen]}>
        <ScreenContainer 
          currentScreen={currentScreen}>
          <AllView 
            search={deanStudentsState.searchSubgroups}
            setSearch={setSearchSubgroups}
            isMobile={true} 
            onClick={goToSubgroupDetails}
            data={deanStudentsState.subgroups} />
          <SubgroupView
            openDeleteSubgroupPopup={openDeleteSubgroupPopup}
            loadingDelete={deanStudentsState.loadingDelete}
            openCreateStudentPopup={openCreateStudentPopup}
            search={deanStudentsState.searchStudents}
            setSearch={setSearchStudents}
            isMobile={true} 
            onClick={goToStudentDetails}
            data={deanStudentsState.selectedSubgroup} />
          <StudentDetailsView
            openUpdateAccountData={openUpdateAccountData}
            controlConfirmDeletePopup={controlConfirmDeletePopup}
            controlConfirmRecoveryPopup={controlConfirmRecoveryPopup}
            keyStudentParents={deanStudentsState.selectedStudent.keyStudentParents}
            fioFields={fioFields}
            isMobile={true}
            group={deanStudentsState.selectedSubgroup.subgroup.subgroupNumber}
            />
        </ScreenContainer>
      </WrapperMobile>) :
      (<WrapperDesktop 
        isCenter={currentScreen === 'student'}
        onBack={handleBackActions[currentScreen]} 
        role='ROLE_DEAN' header={headers[currentScreen]}>
          {currentScreen === 'all' && <AllView 
            search={deanStudentsState.searchSubgroups}
            setSearch={setSearchSubgroups}
            isMobile={false} 
            onClick={goToSubgroupDetails}
            data={deanStudentsState.subgroups} />}
          {currentScreen === 'subgroup' && <SubgroupView
            loadingDelete={deanStudentsState.loadingDelete}
            openDeleteSubgroupPopup={openDeleteSubgroupPopup}
            openCreateStudentPopup={openCreateStudentPopup}
            search={deanStudentsState.searchStudents}
            setSearch={setSearchStudents}
            isMobile={false} 
            onClick={goToStudentDetails}
            data={deanStudentsState.selectedSubgroup} />}
          {currentScreen === 'student' && <StudentDetailsView
            openUpdateAccountData={openUpdateAccountData}
            controlConfirmDeletePopup={controlConfirmDeletePopup}
            controlConfirmRecoveryPopup={controlConfirmRecoveryPopup}
            keyStudentParents={deanStudentsState.selectedStudent.keyStudentParents}
            fioFields={fioFields}
            isMobile={false}
            group={deanStudentsState.selectedSubgroup.subgroup.subgroupNumber}
            />}
        </WrapperDesktop>)
    }
    <UserAccountDataView
      onClickButton={onClickCreate}
      textButton='Добавить'
      isActive={isOpenCreateStudentPopup}
      isMobile={isMobile}
      setLastname={setNewLastname}
      cancelAccountData={cancelCreateAccountData}
      setName={setNewName}
      state={deanStudentsState.loadingAdd}
      setSurname={setNewSurname}
      lastname={deanStudentsState.newLastname}
      name={deanStudentsState.newName}
      surname={deanStudentsState.newSurname}
      lastnameError={deanStudentsState.errors['newLastnameError']}
      nameError={deanStudentsState.errors['newNameError']}
      surnameError={deanStudentsState.errors['newSurnameError']}/>
    <UserAccountDataView
      onClickButton={onSave}
      textButton='Сохранить'
      isActive={isOpenEditAccountDataPopup}
      isMobile={isMobile}
      setLastname={setNewLastname}
      cancelAccountData={cancelUpdateAccountData}
      setName={setNewName}
      state={deanStudentsState.loadingUpdate}
      setSurname={setNewSurname}
      lastname={deanStudentsState.newLastname}
      name={deanStudentsState.newName}
      surname={deanStudentsState.newSurname}
      lastnameError={deanStudentsState.errors['newLastnameError']}
      nameError={deanStudentsState.errors['newNameError']}
      surnameError={deanStudentsState.errors['newSurnameError']}/>
    <ConfirmRecoveryPopupView
      isOpenConfirmPopup={isOpenConfirmRecoveryPopup}
      controlConfirmPopup={controlConfirmRecoveryPopup}
      confirmRecovery={confirmRecovery}
      state={deanStudentsState.loadingRecovery}/>
    <NewPasswordPopupView
      isMobile={isMobile}
      isOpenPasswordPopup={isOpenNewPasswordPopup}
      closePopups={closePopups}
      newPassword={deanStudentsState.newPassword}/>
    <ConfirmDeletePopup 
      cancelDelete={controlConfirmDeletePopup}
      isActive={isOpenConfirmDeletePopup} 
      state={deanStudentsState.loadingDelete}
      onDelete={onClickDelete} />
    <ConfirmDeletePopup 
        cancelDelete={closeDeleteSubgroupPopup}
        isActive={isOpenDeleteSubgroupPopup} 
        state={deanStudentsState.loadingDelete}
        onDelete={onDeleteSubgroup} />
    </>
  );
});

type AllViewProps = {
  isMobile?: boolean;
  data: SubgroupInfoState[];
  search: string;
  setSearch: (value: string) => void;
  onClick: (value: SubgroupInfoState) => void; 
}

export const AllView: FC<AllViewProps> = memo(({
  isMobile = false,
  data,
  search,
  onClick,
  setSearch
}) => {
  const [filteredData, setFilteredData] = useState<SubgroupInfoState[]>([]);

  useEffect(() => {
    const trimmedSearchText = search.trim().toLowerCase();

    const filteredSubgroups = data
      .filter(item => 
        !trimmedSearchText || item.subgroup.subgroupNumber.toLowerCase().includes(trimmedSearchText)
      )
      .sort((a, b) => {
        const numA = parseFloat(a.subgroup.subgroupNumber);
        const numB = parseFloat(b.subgroup.subgroupNumber);
        return numA - numB;
      });

      setFilteredData(filteredSubgroups);
  }, [data, search]);

  return (
    isMobile ? (<Column horizontalAlign='center'>
      <Search value={search} setValue={setSearch}/>
      <Spacing themeSpace={20} variant='Column' />
      {
        filteredData.map((item) => <>
          <ActionButton onClick={() => onClick(item)} text={item.subgroup.subgroupNumber} />
          <Spacing themeSpace={10} variant='Column' />
        </>)
      }
    </Column>) : (<Column style={{width: 695}}>
      <Search isMobile={false} value={search} setValue={setSearch}/>
      <Spacing themeSpace={30} variant='Column' />
      <GridContainer columns={4}>
        {
          filteredData.map((item) =>
            <ActionBlockButton onClick={() => onClick(item)} text={item.subgroup.subgroupNumber} />)
        }
      </GridContainer>
    </Column>)
  );
});

type SubgroupViewProps = {
  isMobile?: boolean;
  data: SubgroupInfoState;
  search: string;
  openCreateStudentPopup: () => void;
  setSearch: (value: string) => void;
  onClick: (value: StudentInfoState) => void; 
  openDeleteSubgroupPopup: () => void;
  loadingDelete: "idle" | "loading" | "success" | "error";
}

export const SubgroupView: FC<SubgroupViewProps> = memo(({
  isMobile = false,
  data,
  search,
  openCreateStudentPopup,
  onClick,
  loadingDelete,
  openDeleteSubgroupPopup,
  setSearch
}) => {
  const [filteredData, setFilteredData] = useState<StudentInfoState[]>([]);

  useEffect(() => {
    const trimmedSearchText = search.trim().toLowerCase();

    const filteredStudents = data.students
      .filter(student => !trimmedSearchText || student.flpName.toLowerCase().includes(trimmedSearchText))
      .sort((a, b) => a.flpName.localeCompare(b.flpName));

      setFilteredData(filteredStudents);
  }, [data.students, search]);

 

  return (
    isMobile ? (<Column horizontalAlign='center'>
        <Row style={{width: '100%', maxWidth: 440}}>
          <Search value={search} setValue={setSearch}/>
          <Spacing themeSpace={10} variant='Row' />
          <Button onClick={openCreateStudentPopup} borderRaius={10} variant='primary' padding={[12,10]}>
            Добавить
          </Button>
        </Row>
        <Spacing themeSpace={20} variant='Column' />
        {
          filteredData.map((item) => <>
            <ActionButton onClick={() => onClick(item)} text={item.flpName} />
            <Spacing themeSpace={10} variant='Column' />
          </>)
        }
        <Spacing themeSpace={15} variant='Column' />
        <Button borderRaius={10} onClick={openDeleteSubgroupPopup} variant='attentive' padding={[12,17]}>
          Удалить подгруппу
        </Button>
      </Column>) : (
      <Column horizontalAlign='center' style={{width: 695}}>
        <Row style={{width: '100%'}}>
          <Search isMobile={false} 
            value={search} 
            setValue={setSearch}/>
          <Spacing themeSpace={15} variant='Row' />
          <Button onClick={openCreateStudentPopup} borderRaius={10} variant='primary' padding={[12,17]}>
            Добавить
          </Button>
          <Spacing themeSpace={15} variant='Row' />
          <Button style={{flexShrink: 0}} borderRaius={10} onClick={openDeleteSubgroupPopup} variant='attentive' padding={[12,17]}>
            Удалить подгруппу
          </Button>
          </Row>
        <Spacing themeSpace={30} variant='Column' />
        <GridContainer columns={4}>
          {filteredData.map((item) => <>
            <ActionBlockButton text={item.flpName} onClick={() => onClick(item)} />
          </>)}
        </GridContainer>
      </Column>)
  );
});

type StudentDetailsViewProps = {
  isMobile?: boolean;
  keyStudentParents: string;
  fioFields: string[];
  controlConfirmRecoveryPopup: () => void;
  controlConfirmDeletePopup: () => void;
  openUpdateAccountData: () => void;
  group: string;
}

export const StudentDetailsView: FC<StudentDetailsViewProps> = memo(({
  isMobile = false,
  group,
  controlConfirmRecoveryPopup,
  controlConfirmDeletePopup,
  openUpdateAccountData,
  keyStudentParents,
  fioFields
}) => {

  return (
    isMobile ? (<Column padding={[0,25]} horizontalAlign='center'>
      <Surface style={{maxWidth: 440}}>
        <Row verticalAlign='center' style={{width: '100%'}} horizontalAlign='space-between'>
          <Image src={accountLogoSVG} width={95} height={95}/>
          <Spacing themeSpace={10} variant='Row' />
          <Column style={{gap: 15, overflow: 'hidden'}} verticalAlign='space-between'>
            <Text themeFont={theme.fonts.h2}> 
            {fioFields[0]}
            </Text>
            <Text themeFont={theme.fonts.h2}> 
              {fioFields[1]}
            </Text>
            <Text themeFont={theme.fonts.h2}> 
              {fioFields[2]}
            </Text>
            <Text themeFont={theme.fonts.ht2}> 
              {group}
            </Text>
          </Column>
        </Row>
        <Spacing themeSpace={25} variant='Column' />
        <Textarea 
        isCopy={true} 
        value={keyStudentParents} 
        placeholder='Родительский ключ' 
        disabled={true} header='Родительский ключ' />
      </Surface>
      <Spacing themeSpace={15} variant='Column' />
      <ActionButton onClick={openUpdateAccountData} text='Учётные данные' />
      <Spacing variant='Column' themeSpace={10} />
      <ActionButton onClick={controlConfirmRecoveryPopup} text='Сбросить пароль' />
      <Spacing variant='Column' themeSpace={10} />
      <ActionButton 
        themeFont={theme.fonts.h2} 
        textColor={theme.colors.attentive} 
        onClick={controlConfirmDeletePopup} 
        text='Удалить' />
    </Column>) : (<Surface padding='40px' style={{width: 'auto'}}>
      <Column horizontalAlign='center' style={{position: 'relative', width: 440}}>
        <Surface>
          <Row verticalAlign='center' style={{width: '100%'}} horizontalAlign='space-between'>
            <Image src={accountLogoSVG} width={95} height={95}/>
            <Spacing themeSpace={10} variant='Row' />
            <Column style={{gap: 15, overflow: 'hidden'}} verticalAlign='space-between'>
              <Text themeFont={theme.fonts.h2}> 
              {fioFields[0]}
              </Text>
              <Text themeFont={theme.fonts.h2}> 
                {fioFields[1]}
              </Text>
              <Text themeFont={theme.fonts.h2}> 
                {fioFields[2]}
              </Text>
              <Text themeFont={theme.fonts.ht2}> 
                {group}
              </Text>
            </Column>
          </Row>
          <Spacing themeSpace={25} variant='Column' />
          <Textarea 
            isCopy={true} 
            value={keyStudentParents} 
            placeholder='Родительский ключ' 
            disabled={true} header='Родительский ключ' />
        </Surface>
        <Spacing themeSpace={25} variant='Column' />
        <ActionButton onClick={openUpdateAccountData} text='Учётные данные' />
        <Spacing variant='Column' themeSpace={10} />
        <ActionButton onClick={controlConfirmRecoveryPopup} text='Сбросить пароль' />
        <Spacing variant='Column' themeSpace={10} />
        <ActionButton 
          themeFont={theme.fonts.h2} 
          textColor={theme.colors.attentive} 
          onClick={controlConfirmDeletePopup} 
          text='Удалить' />
      </Column>
    </Surface>)
  );
});

type NewPasswordPopupViewProps = {
  isMobile: boolean;
  isOpenPasswordPopup: boolean;
  closePopups: () => void;
  newPassword: string;
}

export const NewPasswordPopupView: FC<NewPasswordPopupViewProps> = memo(({
  isOpenPasswordPopup,
  closePopups,
  isMobile,
  newPassword
}) => {

  return (
    <Popup isActive={isOpenPasswordPopup} closePopup={closePopups}>
      <Column horizontalAlign='center'>
        <Textarea width={isMobile ? 220 : 440} isCopy={true} value={newPassword} placeholder='' disabled={true} header='Новый пароль' />
        <Spacing themeSpace={35} variant='Column' />
        <Button onClick={closePopups} state={'idle'} variant='primary' padding={[12,17]}>
          Вернуться назад
        </Button>
      </Column>
    </Popup>
  );
});

type UserAccountDataViewProps = {
  isMobile: boolean;
  isActive: boolean;
  lastname: string;
  textButton: string;
  name: string;
  surname: string;
  setLastname: (value: string) => void;
  setName: (value: string) => void;
  setSurname: (value: string) => void;
  lastnameError: string | null;
  nameError: string | null;
  cancelAccountData: () => void;
  state: "loading" | "idle" | "success" | "error";
  surnameError: string | null;
  onClickButton: () => void;
}

export const UserAccountDataView: FC<UserAccountDataViewProps> = memo(({
  isMobile,
  lastname,
  name,
  textButton,
  cancelAccountData,
  isActive,
  setLastname,
  setName,
  setSurname,
  surname,
  onClickButton,
  state,
  lastnameError,
  nameError,
  surnameError
}) => {

  return (
    isMobile ?
      (<Modal isActive={isActive} closeModal={cancelAccountData}>
        <Column horizontalAlign='center'>
          <Input 
            header='Фамилия' 
            placeholder='Иванов' error={lastnameError}
            value={lastname} setValue={setLastname}/>
          <Spacing variant='Column' themeSpace={30}/>
          <Input 
            header='Имя' 
            placeholder='Иванов' error={nameError}
            value={name} setValue={setName}/>
          <Spacing variant='Column' themeSpace={30}/>
          <Input 
            header='Отчество' 
            placeholder='Иванов' error={surnameError}
            value={surname} setValue={setSurname}/>
          <Spacing variant='Column' themeSpace={40}/>
          <Row>
            <Button onClick={onClickButton} state={state} variant='recomended' padding={[12,17]}>
              {textButton}
            </Button>
            <Spacing variant='Row' themeSpace={20}/>
            <Button onClick={cancelAccountData} variant='attentive' padding={[12,17]}>
              Отмена
            </Button>
          </Row>
        </Column>
      </Modal>) :
      (<Popup isActive={isActive} closePopup={cancelAccountData}>
        <Column style={{width: 440}} horizontalAlign='center'>
          <Input 
            header='Фамилия' 
            placeholder='Иванов' error={lastnameError}
            value={lastname} setValue={setLastname}/>
          <Spacing variant='Column' themeSpace={30}/>
          <Input 
            header='Имя' 
            placeholder='Иванов' error={nameError}
            value={name} setValue={setName}/>
          <Spacing variant='Column' themeSpace={30}/>
          <Input 
            header='Отчество' 
            placeholder='Иванов' error={surnameError}
            value={surname} setValue={setSurname}/>
          <Spacing variant='Column' themeSpace={40}/>
          <Row>
            <Button onClick={onClickButton} state={state} variant='recomended' padding={[12,17]}>
              {textButton}
            </Button>
            <Spacing variant='Row' themeSpace={20}/>
            <Button onClick={cancelAccountData} variant='attentive' padding={[12,17]}>
              Отмена
            </Button>
          </Row>
        </Column>
      </Popup>)
  );
});

type ConfirmRecoveryPopupViewProps = {
  isOpenConfirmPopup: boolean;
  controlConfirmPopup: () => void;
  confirmRecovery: () => void;
  state: "loading" | "idle" | "success" | "error";
}

export const ConfirmRecoveryPopupView: FC<ConfirmRecoveryPopupViewProps> = memo(({
  isOpenConfirmPopup,
  controlConfirmPopup,
  confirmRecovery,
  state
}) => {

  return (
    <Popup isActive={isOpenConfirmPopup} closePopup={controlConfirmPopup}>
      <Column horizontalAlign='center'>
        <Text themeFont={theme.fonts.h2} align='center'> 
          Вы уверены, что <br/>
          хотите сбросить пароль?
        </Text>
        <Spacing  themeSpace={25} variant='Column' />
        <Row>
          <Button onClick={confirmRecovery} state={state} variant='recomended' padding={[12,17]}>
            Сбросить
          </Button>
          <Spacing variant='Row' themeSpace={20}/>
          <Button onClick={controlConfirmPopup} variant='attentive' padding={[12,17]}>
            Отмена
          </Button>
        </Row>
      </Column>
    </Popup>
  );
});
