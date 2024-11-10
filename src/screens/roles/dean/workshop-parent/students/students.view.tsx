
import { FC, memo, useCallback, useState } from 'react';
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

export type StudentsViewProps = {
  goToWorkshop: () => void;
  deanStudentsState: StudentsState;
  setSearchSubgroups: (value: string) => void;
  setSearchStudents: (value: string) => void;
  setNewLastname: (value: string) => void;
  setNewName: (value: string) => void;
  setNewSurname: (value: string) => void;
  setSelectedSubgroup: (value: SubgroupInfoState) => void;
  setSelectedStudent: (value: StudentInfoState) => void;
};

export const StudentsView: FC<StudentsViewProps> = memo(({
  goToWorkshop,
  deanStudentsState,
  setSearchStudents,
  setSearchSubgroups,
  setNewLastname,
  setNewName,
  setNewSurname,
  setSelectedStudent,
  setSelectedSubgroup
}) => {
  const isMobile = useMediaQuery({maxWidth: theme.toMobileSize});

  const [currentScreen, setCurrentScreen] = useState<'all' | 'subgroup' | 'student'>('all');

  const headers = {
    all: 'Список групп',
    subgroup: `Группа - ${deanStudentsState.selectedSubgroup.subgroup.subgroupNumber}`,
    student: 'Студент'
  };

  const handleBackActions = {
    all: goToWorkshop,
    subgroup: () => setCurrentScreen('all'),
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

  return (
    isMobile ? 
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
            search={deanStudentsState.searchStudents}
            setSearch={setSearchStudents}
            isMobile={true} 
            onClick={goToStudentDetails}
            data={deanStudentsState.selectedSubgroup} />
          <StudentDetailsView/>
        </ScreenContainer>
      </WrapperMobile>) :
      (<WrapperDesktop 
        onBack={handleBackActions[currentScreen]} 
        role='ROLE_DEAN' header={headers[currentScreen]}>
      
        </WrapperDesktop>)
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

  return (
    isMobile ? (<Column horizontalAlign='center'>
      <Search value={search} setValue={setSearch}/>
      <Spacing themeSpace={20} variant='Column' />
      {
        data?.map((item) => <>
          <ActionButton onClick={() => onClick(item)} text={item.subgroup.subgroupNumber} />
          <Spacing themeSpace={10} variant='Column' />
        </>)
      }
    </Column>) : (<Column>
      1
    </Column>)
  );
});

type SubgroupViewProps = {
  isMobile?: boolean;
  data: SubgroupInfoState;
  search: string;
  setSearch: (value: string) => void;
  onClick: (value: StudentInfoState) => void; 
}

export const SubgroupView: FC<SubgroupViewProps> = memo(({
  isMobile = false,
  data,
  search,
  onClick,
  setSearch
}) => {

  return (
    isMobile ? (<Column horizontalAlign='center'>
      <Row style={{width: '100%', maxWidth: 440}}>
        <Search value={search} setValue={setSearch}/>
        <Spacing themeSpace={10} variant='Row' />
        <Button borderRaius={10} variant='primary' padding={[12,10]}>
          Добавить
        </Button>
      </Row>
      <Spacing themeSpace={20} variant='Column' />
      {
        data.students.map((item) => <>
          <ActionButton onClick={() => onClick(item)} text={item.flpName} />
          <Spacing themeSpace={10} variant='Column' />
        </>)
      }
    </Column>) : (<Column>
      1
    </Column>)
  );
});

type StudentDetailsViewProps = {
  isMobile?: boolean;
}

export const StudentDetailsView: FC<StudentDetailsViewProps> = memo(({
  isMobile = false,
}) => {

  return (
    isMobile ? (<Column padding={[0,25]} horizontalAlign='center'>
      
    </Column>) : (<Column>
      1
    </Column>)
  );
});

          