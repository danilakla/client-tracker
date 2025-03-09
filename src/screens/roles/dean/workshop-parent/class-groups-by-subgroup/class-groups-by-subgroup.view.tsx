
import { FC, memo, useCallback, useEffect, useState } from 'react';
import { theme } from '../../../../../ui-kit/themes/theme';
import { useMediaQuery } from 'react-responsive';
import { WrapperMobile } from '../../../../../components/wrapper-mobile';
import { WrapperDesktop } from '../../../../../components/wrapper-desktop';
import { ClassGroupDTO, SubgroupDTO, SubjectDTO } from '../../../../../store/reducers/roles/dean/class-groups-by-subgroup-slice';
import { Column } from '../../../../../ui-kit/column';
import { CircleLoading } from '../../../../../ui-kit/circle-loading';
import { Search } from '../../../../../ui-kit/search';
import { Spacing } from '../../../../../ui-kit/spacing';
import { ItemsContainerMobile } from '../subjects-parent/control-subjects/control-subjects.styled';
import { ActionButton } from '../../../../../ui-kit/action-button';
import { GridContainer } from '../../../../../ui-kit/grid-container';
import { ActionBlockButton } from '../../../../../ui-kit/action-block-button';
import { InitData } from '../../../../../store/reducers/roles/dean/class-group-table-slice';

export type ClassGroupsBySubgroupViewProps = {
  setSearchSubgroup: (value: string) => void;
  setSearchClassGroup: (value: string) => void;
  setSearchSubject: (value: string) => void;
  setSelectedSubject: (value: SubjectDTO, onSuccess: () => void) => void;
  setSelectedSubgroup: (value: SubgroupDTO, onSuccess: () => void) => void;
  isCheckTable: boolean;
  setIsCheckTable: (value: boolean) => void;
  goToWorkshop: () => void;
  loading: "loading" | "idle" | "success" | "error";
  searchSubgroup: string;
  searchSubject: string;
  searchClassGroup: string;

  filteredClassGroups: ClassGroupDTO[];
  filteredSubjects: SubjectDTO[];
  filteredSubgroups: SubgroupDTO[];

  openClassTable: (value: InitData) => void;
  selectedSubjectName: string;
};

export const ClassGroupsBySubgroupView: FC<ClassGroupsBySubgroupViewProps> = memo(({
  setSearchSubgroup,
  setSearchClassGroup,
  setSearchSubject,
  setSelectedSubject,
  setSelectedSubgroup,
  setIsCheckTable,
  isCheckTable,
  selectedSubjectName,
  goToWorkshop,
  loading,
  searchClassGroup,
  searchSubgroup,
  searchSubject,
  filteredClassGroups,
  filteredSubgroups,
  filteredSubjects,

  openClassTable
}) => {
  const isMobile = useMediaQuery({maxWidth: theme.toMobileSize});

  const [currScreen, setCurrScreen] = useState<'subgroups' | 'subjects' | 'class-groups'>('subgroups');

  const goBackToSubgroups = useCallback(() => {
    setSearchSubject('');
    setCurrScreen('subgroups');
  },[setSearchSubject])
  const goBackToSubjects = useCallback(() => {
    setSearchClassGroup('');
    setCurrScreen('subjects');
  },[setSearchClassGroup])

  const goToSubjects = useCallback((value: SubgroupDTO) => {
    setSearchSubject('');
    setSelectedSubgroup(value, () => setCurrScreen('subjects'));
  },[setSelectedSubgroup, setSearchSubject])

  const goToClassGroups = useCallback((value: SubjectDTO) => {
    setSelectedSubject(value, () => setCurrScreen('class-groups'));
  },[setSelectedSubject])

  useEffect(() => {
    if(isCheckTable === true){
      setCurrScreen('class-groups');
      setIsCheckTable(false);
    }
  },[isCheckTable, setIsCheckTable])

  return (
    <>
      {currScreen === 'subgroups' && 
        <SubgroupsView
          isMobile={isMobile}
          loading={loading}
          goToSubjects={goToSubjects}
          filteredSubgroups={filteredSubgroups}
          searchText={searchSubgroup}
          setSearchText={setSearchSubgroup}
          goBack={goToWorkshop}
        /> }
      {currScreen === 'subjects' && 
        <SubjectsView
          isMobile={isMobile}
          filteredSubjects={filteredSubjects}
          goToClassGroups={goToClassGroups}
          searchText={searchSubject}
          setSearchText={setSearchSubject}
          goBack={goBackToSubgroups}
        /> }
      {currScreen === 'class-groups' && 
        <ClassGroupsView
          isMobile={isMobile}
          filteredClassGroups={filteredClassGroups}
          searchText={searchClassGroup}
          selectedSubjectName={selectedSubjectName}
          setSearchText={setSearchClassGroup}
          goBack={goBackToSubjects}
          openClassTable={openClassTable}
        /> }
    </>
  );
})

type SubgroupsViewProps = {
  goBack: () => void;
  isMobile: boolean;
  loading: "loading" | "idle" | "success" | "error";
  searchText: string,
  goToSubjects: (value: SubgroupDTO) => void;
  setSearchText: (value: string) => void;
  filteredSubgroups: SubgroupDTO[];
};

export const SubgroupsView: FC<SubgroupsViewProps> = memo(({
  goBack,
  isMobile,
  loading,
  goToSubjects,
  searchText,
  filteredSubgroups,
  setSearchText
}) => {

  return (
    isMobile ? 
      (<WrapperMobile role='ROLE_DEAN' header='Список групп' onBack={goBack}>
        {loading === 'loading' && 
          <Column style={{position: 'absolute', height: '100dvh', top: 0}}>
            <CircleLoading state={loading}/>
          </Column>
        }
        <Search value={searchText} setValue={setSearchText}/>
        <Spacing themeSpace={20} variant='Column' />
        <ItemsContainerMobile>
          {filteredSubgroups.map((item, index) =>
            <ActionButton key={index} onClick={() => goToSubjects(item)} text={item.subgroupNumber} />)}
        </ItemsContainerMobile>
      </WrapperMobile>) :
      (<WrapperDesktop role='ROLE_DEAN' header='Список групп' onBack={goBack}>
        {loading === 'loading' && 
          <Column style={{position: 'absolute', height: '100dvh', top: 0}}>
            <CircleLoading state={loading}/>
          </Column>
        }
        <Column horizontalAlign='center' style={{width: 695, height: '100%'}}>
          <Search isMobile={false} value={searchText} setValue={setSearchText}/>
          <Spacing themeSpace={30} variant='Column' />
          <GridContainer columns={4}>
            {filteredSubgroups.map((item, index) =>
              <ActionBlockButton key={index}
                onClick={() => goToSubjects(item)} 
                text={item.subgroupNumber} />)}
          </GridContainer>
        </Column>
      </WrapperDesktop>)
  );
});

type SubjectsViewProps = {
  goBack: () => void;
  isMobile: boolean;
  searchText: string,
  setSearchText: (value: string) => void;
  filteredSubjects: SubjectDTO[];
  goToClassGroups: (value: SubjectDTO) => void;
};

export const SubjectsView: FC<SubjectsViewProps> = memo(({
  goBack,
  isMobile,
  searchText,
  setSearchText,
  filteredSubjects,
  goToClassGroups
}) => {

  return (
    isMobile ? 
    (<WrapperMobile role='ROLE_DEAN' header='Список предметов' onBack={goBack}>
      <Search value={searchText} setValue={setSearchText}/>
      <Spacing themeSpace={20} variant='Column' />
      <ItemsContainerMobile>
        {filteredSubjects.map((item, index) =>
          <ActionButton key={index} onClick={() => goToClassGroups(item)} text={item.subjectName} />)}
      </ItemsContainerMobile>
    </WrapperMobile>) :
    (<WrapperDesktop role='ROLE_DEAN' header='Список предметов' onBack={goBack}>
      <Column horizontalAlign='center' style={{width: 695, height: '100%'}}>
        <Search isMobile={false} value={searchText} setValue={setSearchText}/>
        <Spacing themeSpace={30} variant='Column' />
        <GridContainer columns={4}>
          {filteredSubjects.map((item, index) =>
            <ActionBlockButton key={index}
              onClick={() => goToClassGroups(item)} 
              text={item.subjectName} />)}
        </GridContainer>
      </Column>
    </WrapperDesktop>)
  );
});

type ClassGroupsViewProps = {
  goBack: () => void;
  isMobile: boolean;
  searchText: string,
  setSearchText: (value: string) => void;
  filteredClassGroups: ClassGroupDTO[];
  openClassTable: (value: InitData) => void;
  selectedSubjectName: string;
};

export const ClassGroupsView: FC<ClassGroupsViewProps> = memo(({
  goBack,
  isMobile,
  searchText,
  setSearchText,
  filteredClassGroups,
  selectedSubjectName,

  openClassTable
}) => {

  return (
    isMobile ? 
    (<WrapperMobile role='ROLE_DEAN' header='Группы занятий' onBack={goBack}>
      <Search value={searchText} setValue={setSearchText}/>
      <Spacing themeSpace={20} variant='Column' />
      <ItemsContainerMobile>
        {filteredClassGroups.map((item, index) =>
          <ActionButton key={index} onClick={() => openClassTable({
            id: item.idClassHold,
            description: item.description,
            subjectName: selectedSubjectName,
            formatName: item.formatName,
            teacherName: item.teacherName,
            idClassHold: item.idClassHold
          })} text={item.description} />)}
      </ItemsContainerMobile>
    </WrapperMobile>) :
    (<WrapperDesktop role='ROLE_DEAN' header='Группы занятий' onBack={goBack}>
      <Column horizontalAlign='center' style={{width: 695, height: '100%'}}>
        <Search isMobile={false} value={searchText} setValue={setSearchText}/>
        <Spacing themeSpace={30} variant='Column' />
        <GridContainer columns={4}>
          {filteredClassGroups.map((item, index) =>
            <ActionBlockButton key={index}
              onClick={() => openClassTable({
                id: item.idClassHold,
                description: item.description,
                subjectName: selectedSubjectName,
                formatName: item.formatName,
                teacherName: item.teacherName,
                idClassHold: item.idClassHold
              })} 
              text={item.description} />)}
        </GridContainer>
      </Column>
    </WrapperDesktop>)
  );
});