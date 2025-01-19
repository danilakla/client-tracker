
import { FC, memo } from 'react';
import { useMediaQuery } from 'react-responsive';
import { theme } from '../../../../../ui-kit/themes/theme';
import { WrapperMobile } from '../../../../../components/wrapper-mobile';
import { WrapperDesktop } from '../../../../../components/wrapper-desktop';
import { Column } from '../../../../../ui-kit/column';
import { Search } from '../../../../../ui-kit/search';
import { Spacing } from '../../../../../ui-kit/spacing';
import { ItemsContainerMobile } from '../../../dean/workshop-parent/subjects-parent/control-subjects/control-subjects.styled';
import { ActionButton } from '../../../../../ui-kit/action-button';
import { ClassGroupInfo } from '../../../../../store/reducers/roles/teacher/subjects-slice';
import { ClassGroupsState } from '../../../../../store/reducers/roles/teacher/class-groups-slice';
import { GridContainer } from '../../../../../ui-kit/grid-container';
import { ActionBlockButton } from '../../../../../ui-kit/action-block-button';

export type ClassGroupsProps = {
  teacherClassGroupsState: ClassGroupsState;
  filteredClassGroups: ClassGroupInfo[];
  goToSubjects: () => void;
  goToClassGroupSubgroups: (value: number) => void;
  setSearchText: (value: string) => void;
};

export const ClassGroupsView: FC<ClassGroupsProps> = memo(({
  teacherClassGroupsState,
  filteredClassGroups,
  goToClassGroupSubgroups,
  goToSubjects,
  setSearchText
}) => {
  const isMobile = useMediaQuery({maxWidth: theme.toMobileSize});

  return (
    isMobile ? 
      (<SubjectsMobileView
        goToSubjects={goToSubjects}
        goToClassGroupSubgroups={goToClassGroupSubgroups}
        teacherClassGroupsState={teacherClassGroupsState}
        setSearchText={setSearchText}
        filteredClassGroups={filteredClassGroups}
        />) :
      (<SubjectsDesktopView
        goToSubjects={goToSubjects}
        goToClassGroupSubgroups={goToClassGroupSubgroups}
        teacherClassGroupsState={teacherClassGroupsState}
        setSearchText={setSearchText}
        filteredClassGroups={filteredClassGroups}
        />)
  );
});


type LocalViewProps = {
  teacherClassGroupsState: ClassGroupsState;
  filteredClassGroups: ClassGroupInfo[];
  setSearchText: (value: string) => void;
  goToClassGroupSubgroups: (value: number) => void;
  goToSubjects: () => void;
};

export const SubjectsMobileView: FC<LocalViewProps> = memo(({
  teacherClassGroupsState,
  filteredClassGroups,
  goToClassGroupSubgroups,
  goToSubjects,
  setSearchText
}) => {

  return (
    <WrapperMobile onBack={goToSubjects} role='ROLE_TEACHER' header={teacherClassGroupsState.subjectName || ''}>
      <Search value={teacherClassGroupsState.searchText} setValue={setSearchText}/>
      <Spacing themeSpace={20} variant='Column' />
      <ItemsContainerMobile>
        {filteredClassGroups.map((item, index) => <>
          <ActionButton key={index} onClick={() => goToClassGroupSubgroups(item.idClassGroup)} text={item.description} />
          </>)}
      </ItemsContainerMobile>
    </WrapperMobile>
  );
});

export const SubjectsDesktopView: FC<LocalViewProps> = memo(({
  teacherClassGroupsState,
  filteredClassGroups,
  goToClassGroupSubgroups,
  goToSubjects,
  setSearchText
}) => {

  return (
    <WrapperDesktop onBack={goToSubjects} role='ROLE_TEACHER' header={teacherClassGroupsState.subjectName || ''}>
      <Column horizontalAlign='center' style={{width: 695}}>
        <Search isMobile={false} value={teacherClassGroupsState.searchText} setValue={setSearchText}/>
        <Spacing themeSpace={30} variant='Column' />
        <GridContainer columns={4}>
          {filteredClassGroups.map((item, index) => <>
            <ActionBlockButton 
              onClick={() => goToClassGroupSubgroups(item.idClassGroup)} 
              text={item.description} key={index}/>
            </>)}
        </GridContainer>
      </Column>
    </WrapperDesktop>
  );
});