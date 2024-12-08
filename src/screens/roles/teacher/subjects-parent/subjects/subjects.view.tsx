
import { FC, memo } from 'react';
import { useMediaQuery } from 'react-responsive';
import { theme } from '../../../../../ui-kit/themes/theme';
import { WrapperMobile } from '../../../../../components/wrapper-mobile';
import { WrapperDesktop } from '../../../../../components/wrapper-desktop';
import { Column } from '../../../../../ui-kit/column';
import { CircleLoading } from '../../../../../ui-kit/circle-loading';
import { Search } from '../../../../../ui-kit/search';
import { Spacing } from '../../../../../ui-kit/spacing';
import { ItemsContainerMobile } from '../../../dean/workshop-parent/subjects-parent/control-subjects/control-subjects.styled';
import { ActionButton } from '../../../../../ui-kit/action-button';
import { ClassGroupInfo, SubjectInfo, SubjectsState } from '../../../../../store/reducers/roles/teacher/subjects-slice';
import { GridContainer } from '../../../../../ui-kit/grid-container';
import { ActionBlockButton } from '../../../../../ui-kit/action-block-button';

export type SubjectsViewProps = {
  teacherSubjectsState: SubjectsState;
  filteredSubjects: SubjectInfo[];
  setSearchText: (value: string) => void;
  goToClassGroups: (value: ClassGroupInfo[], nameSubject: string) => void;
};

export const SubjectsView: FC<SubjectsViewProps> = memo(({
  teacherSubjectsState,
  filteredSubjects,
  goToClassGroups,
  setSearchText
}) => {
  const isMobile = useMediaQuery({maxWidth: theme.toMobileSize});

  return (
    isMobile ? 
      (<SubjectsMobileView
        teacherSubjectsState={teacherSubjectsState}
        setSearchText={setSearchText}
        goToClassGroups={goToClassGroups}
        filteredSubjects={filteredSubjects}
        />) :
      (<SubjectsDesktopView
        teacherSubjectsState={teacherSubjectsState}
        setSearchText={setSearchText}
        goToClassGroups={goToClassGroups}
        filteredSubjects={filteredSubjects}
        />)
  );
});


type LocalViewProps = {
  teacherSubjectsState: SubjectsState;
  filteredSubjects: SubjectInfo[];
  goToClassGroups: (value: ClassGroupInfo[], nameSubject: string) => void;
  setSearchText: (value: string) => void;
};

export const SubjectsMobileView: FC<LocalViewProps> = memo(({
  teacherSubjectsState,
  goToClassGroups,
  filteredSubjects,
  setSearchText
}) => {

  return (
    <WrapperMobile role='ROLE_TEACHER' header='Предметы'>
      {teacherSubjectsState.loading === 'loading' && 
        <Column style={{position: 'absolute', height: '100vh', top: 0}}>
          <CircleLoading state={teacherSubjectsState.loading}/>
        </Column>
      }
      <Search value={teacherSubjectsState.searchText} setValue={setSearchText}/>
      <Spacing themeSpace={20} variant='Column' />
      <ItemsContainerMobile>
        {filteredSubjects.map((item) => <>
          <ActionButton onClick={() => goToClassGroups(item.classGroups, item.subjectName)} text={item.subjectName} />
          </>)}
      </ItemsContainerMobile>
    </WrapperMobile>
  );
});

export const SubjectsDesktopView: FC<LocalViewProps> = memo(({
  teacherSubjectsState,
  goToClassGroups,
  filteredSubjects,
  setSearchText
}) => {

  return (
    <WrapperDesktop role='ROLE_TEACHER' header='Предметы'>
      {teacherSubjectsState.loading === 'loading' && 
        <Column style={{position: 'absolute', height: '100vh', top: 0}}>
          <CircleLoading state={teacherSubjectsState.loading}/>
        </Column>
      }
      <Column horizontalAlign='center' style={{width: 695}}>
        <Search isMobile={false} value={teacherSubjectsState.searchText} setValue={setSearchText}/>
        <Spacing themeSpace={30} variant='Column' />
        <GridContainer columns={4}>
          {filteredSubjects.map((item) => <>
            <ActionBlockButton 
              onClick={() => goToClassGroups(item.classGroups, item.subjectName)} 
              text={item.subjectName} />
            </>)}
        </GridContainer>
      </Column>
    </WrapperDesktop>
  );
});