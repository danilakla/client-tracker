
import { FC, memo, useCallback, useEffect, useState } from 'react';
import { theme } from '../../../../../../ui-kit/themes/theme';
import { useMediaQuery } from 'react-responsive';
import { WrapperMobile } from '../../../../../../components/wrapper-mobile';
import { WrapperDesktop } from '../../../../../../components/wrapper-desktop';
import { AttestationStudentsState, StudentDTO, SubgroupDTO } from '../../../../../../store/reducers/roles/dean/attestation-students-slice';
import { ItemsContainerMobile } from '../../subjects-parent/control-subjects/control-subjects.styled';
import { ActionButton } from '../../../../../../ui-kit/action-button';
import { Spacing } from '../../../../../../ui-kit/spacing';
import { Search } from '../../../../../../ui-kit/search';
import { Column } from '../../../../../../ui-kit/column';
import { CircleLoading } from '../../../../../../ui-kit/circle-loading';
import { GridContainer } from '../../../../../../ui-kit/grid-container';
import { ActionBlockButton } from '../../../../../../ui-kit/action-block-button';
import { Text } from '../../../../../../ui-kit/text';
import { InitData } from '../../../../../../store/reducers/roles/dean/class-group-table-slice';

export type AttestationStudentsViewProps = {
  goToAttestation: () => void;
  deanAttestationStudentsState: AttestationStudentsState;
  setSearchStudent: (value: string) => void;
  setSearchSubgroup: (value: string) => void;
  setSelectedStudent: (value: StudentDTO, onSuccess: () => void) => void;
  setSelectedSubgroup: (value: SubgroupDTO, onSuccess: () => void) => void;
  filteredStudents: StudentDTO[];
  filteredSubgroups: SubgroupDTO[];
  openClassTable: (value: InitData) => void;
  setIsCheckTable: (value: boolean) => void;
};

export const AttestationStudentsView: FC<AttestationStudentsViewProps> = memo(({
  goToAttestation,
  deanAttestationStudentsState,
  setSearchStudent,
  setSearchSubgroup,
  setSelectedStudent,
  filteredStudents,
  filteredSubgroups,
  setSelectedSubgroup,
  openClassTable,
  setIsCheckTable
}) => {
  const isMobile = useMediaQuery({maxWidth: theme.toMobileSize});

  const [currentScreen, setCurrentScreen] = useState<'subgroups' | 'students' | 'subjects'>('subgroups')

  const goToStudents = useCallback((value: SubgroupDTO) => {
    setSearchStudent('');
    setSelectedSubgroup(value, () => setCurrentScreen('students'));
  },[setSelectedSubgroup, setSearchStudent])

  const goToSubjects = useCallback((value: StudentDTO) => {
    setSelectedStudent(value, () => setCurrentScreen('subjects'));
  },[setSelectedStudent])

  const goBackToStudents = useCallback(() => {
    setCurrentScreen('students');
  },[])

  const goBackToSubgroups = useCallback(() => {
    setCurrentScreen('subgroups');
  },[])

  useEffect(() => {
    if(deanAttestationStudentsState.isCheckTable === true){
      setCurrentScreen('subjects');
      setIsCheckTable(false);
    }
  },[deanAttestationStudentsState.isCheckTable, setIsCheckTable])


  return (
    <>
      {currentScreen === 'subgroups' && 
        <SubgroupsView
          isMobile={isMobile}
          setSearchSubgroup={setSearchSubgroup}
          goBack={goToAttestation}
          goToStudents={goToStudents}
          searchText={deanAttestationStudentsState.searchSubgroup}
          loading={deanAttestationStudentsState.loading}
          filteredSubgroups={filteredSubgroups}

        /> }
      {currentScreen === 'students' && 
        <StudentsView
          nameSubgroup={deanAttestationStudentsState.selectedSubgroup.subgroup.subgroupNumber}
          isMobile={isMobile}
          goBack={goBackToSubgroups}
          setSearchStudent={setSearchStudent}
          goToSubjects={goToSubjects}
          filteredStudents={filteredStudents}
          searchText={deanAttestationStudentsState.searchStudent}
        /> }
      {currentScreen === 'subjects' && 
        <SubjectsView
          subgroupNumber={deanAttestationStudentsState.selectedSubgroup.subgroup.subgroupNumber}
          student={deanAttestationStudentsState.selectedStudent}
          isMobile={isMobile}
          openClassTable={openClassTable}
          goBack={goBackToStudents}
        /> }
    </>
  );
});


type SubgroupsViewProps = {
  goBack: () => void;
  goToStudents: (value: SubgroupDTO) => void;
  isMobile: boolean;
  setSearchSubgroup: (value: string) => void;
  loading: "idle" | "loading" | "success" | "error";
  searchText: string;
  filteredSubgroups: SubgroupDTO[];
  
};

export const SubgroupsView: FC<SubgroupsViewProps> = memo(({
  goBack,
  filteredSubgroups,
  loading,
  searchText,
  goToStudents,
  setSearchSubgroup,
  isMobile
}) => {

  return (
    isMobile ? 
    (<WrapperMobile role='ROLE_DEAN' header='Список групп' onBack={goBack}>
      {loading === 'loading' && 
        <Column style={{position: 'absolute', height: '100dvh', top: 0}}>
          <CircleLoading state={loading}/>
        </Column>
      }
      <Search value={searchText} setValue={setSearchSubgroup}/>
      <Spacing themeSpace={20} variant='Column' />
      <ItemsContainerMobile>
        {filteredSubgroups.map((item, index) =>
          <ActionButton key={index} onClick={() => goToStudents(item)} text={item.subgroup.subgroupNumber} />)}
      </ItemsContainerMobile>
    </WrapperMobile>) :
    (<WrapperDesktop role='ROLE_DEAN' header='Список групп' onBack={goBack}>
      {loading === 'loading' && 
        <Column style={{position: 'absolute', height: '100dvh', top: 0}}>
          <CircleLoading state={loading}/>
        </Column>
      }
      <Column horizontalAlign='center' style={{width: 695, height: '100%'}}>
        <Search isMobile={false} value={searchText} setValue={setSearchSubgroup}/>
        <Spacing themeSpace={30} variant='Column' />
        <GridContainer columns={4}>
          {filteredSubgroups.map((item, index) =>
            <ActionBlockButton key={index}
              onClick={() => goToStudents(item)} 
              text={item.subgroup.subgroupNumber} />)}
        </GridContainer>
      </Column>
    </WrapperDesktop>)
  );
});


type StudentsViewProps = {
  goBack: () => void;
  goToSubjects: (value: StudentDTO) => void;
  isMobile: boolean;
  setSearchStudent: (value: string) => void;
  searchText: string;
  nameSubgroup: string;
  filteredStudents: StudentDTO[];
};

export const StudentsView: FC<StudentsViewProps> = memo(({
  goBack,
  filteredStudents,
  searchText,
  nameSubgroup,
  goToSubjects,
  isMobile,
  setSearchStudent
}) => {

  return (
    isMobile ? 
    (<WrapperMobile role='ROLE_DEAN' header={nameSubgroup} onBack={goBack}>
      <Search value={searchText} setValue={setSearchStudent}/>
      <Spacing themeSpace={20} variant='Column' />
      <ItemsContainerMobile>
        {filteredStudents.map((item, index) => 
          <ActionButton key={index} onClick={() => goToSubjects(item)} text={`(${item.unattestedCount}) ${item.name}`} />)}
      </ItemsContainerMobile>
    </WrapperMobile>) :
    (<WrapperDesktop role='ROLE_DEAN' header={nameSubgroup} onBack={goBack}>
      <Column horizontalAlign='center' style={{width: 695, height: '100%'}}>
        <Search isMobile={false} value={searchText} setValue={setSearchStudent}/>
        <Spacing themeSpace={30} variant='Column' />
        <GridContainer columns={4}>
          {filteredStudents.map((item, index) =>
            <ActionBlockButton key={index} text={`(${item.unattestedCount}) ${item.name}`}
              onClick={() => goToSubjects(item)}/>
          )}
        </GridContainer>
      </Column>
    </WrapperDesktop>)
  );
});

type SubjectsViewProps = {
  goBack: () => void;
  isMobile: boolean;
  student: StudentDTO; 
  subgroupNumber: string;
  openClassTable: (value: InitData) => void;
};

export const SubjectsView: FC<SubjectsViewProps> = memo(({
  goBack,
  student,
  isMobile,
  subgroupNumber,
  openClassTable
}) => {

  return (
    isMobile ? 
    (<WrapperMobile role='ROLE_DEAN' header='Задолженности' onBack={goBack}>
      <Text themeFont={theme.fonts.h2} themeColor={theme.colors.gray}>
       Группа
      </Text>
      <Spacing themeSpace={10} variant='Column' />
      <ActionButton text={subgroupNumber} isShowArrow={false}/>
      <Spacing themeSpace={10} variant='Column' />
      <Text themeFont={theme.fonts.h2} themeColor={theme.colors.gray}>
       Студент
      </Text>
      <Spacing themeSpace={10} variant='Column' />
      <ActionButton text={student.name} isShowArrow={false}/>
      <Spacing themeSpace={20} variant='Column' />
      <Text themeFont={theme.fonts.h2} themeColor={theme.colors.gray}>
       Список долгов - {student.unattestedCount}
      </Text>
      <Spacing themeSpace={10} variant='Column' />
      <ItemsContainerMobile>
        {student.classGroups.map((item, index) => 
          <ActionButton key={index} text={item.description} onClick={() => openClassTable(item)}/>)}
      </ItemsContainerMobile>
    </WrapperMobile>) :
    (<WrapperDesktop role='ROLE_DEAN' header='Задолженности' onBack={goBack}>
      <Text themeFont={theme.fonts.h2} themeColor={theme.colors.gray}>
       Группа
      </Text>
      <Spacing themeSpace={10} variant='Column' />
      <ActionButton text={subgroupNumber} isShowArrow={false}/>
      <Spacing themeSpace={10} variant='Column' />
      <Text themeFont={theme.fonts.h2} themeColor={theme.colors.gray}>
       Студент
      </Text>
      <Spacing themeSpace={10} variant='Column' />
      <ActionButton text={student.name} isShowArrow={false}/>
      <Spacing themeSpace={20} variant='Column' />
      <Text themeFont={theme.fonts.h2} themeColor={theme.colors.gray}>
        Список долгов - {student.unattestedCount}
      </Text>
      <Spacing themeSpace={10} variant='Column' />
      <Column horizontalAlign='center' style={{width: 695, height: '100%'}}>
        <GridContainer columns={4}>
          {student.classGroups.map((item, index) =>
            <ActionBlockButton key={index}
              text={item.description} />)}
        </GridContainer>
      </Column>
    </WrapperDesktop>)
  );
});