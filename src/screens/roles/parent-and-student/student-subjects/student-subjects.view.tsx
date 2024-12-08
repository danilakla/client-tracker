
import { FC, memo } from 'react';
import { useMediaQuery } from 'react-responsive';
import { theme } from '../../../../ui-kit/themes/theme';
import { WrapperMobile } from '../../../../components/wrapper-mobile';
import { WrapperDesktop } from '../../../../components/wrapper-desktop';
import { ClassGroupInfo, StudentSubjectsState, SubjectInfo } from '../../../../store/reducers/roles/student-and-parent/student-subjects-slice';
import { Column } from '../../../../ui-kit/column';
import { CircleLoading } from '../../../../ui-kit/circle-loading';
import { ItemsContainerMobile } from '../../dean/workshop-parent/subjects-parent/control-subjects/control-subjects.styled';
import { Spacing } from '../../../../ui-kit/spacing';
import { Search } from '../../../../ui-kit/search';
import { ActionButton } from '../../../../ui-kit/action-button';
import { GridContainer } from '../../../../ui-kit/grid-container';
import { ActionBlockButton } from '../../../../ui-kit/action-block-button';

export type StudentSubjectsViewProps = {
  role: "ROLE_PARENT" | "ROLE_STUDENT";
  setSearchText: (value: string) => void;
  studentSubjectsState: StudentSubjectsState;
  goToClassGroups: (value: ClassGroupInfo[], subjectName: string) => void;
  filteredSubjects: SubjectInfo[];
};

export const StudentSubjectsView: FC<StudentSubjectsViewProps> = memo(({
  role,
  setSearchText,
  studentSubjectsState,
  goToClassGroups,
  filteredSubjects
}) => {
  const isMobile = useMediaQuery({maxWidth: theme.toMobileSize});

  return (
    isMobile ? 
      (<StudentSubjectsMobileView
        studentSubjectsState={studentSubjectsState}
        goToClassGroups={goToClassGroups}
        setSearchText={setSearchText}
        filteredSubjects={filteredSubjects}
        role={role}
        />) :
      (<StudentSubjectsDesktopView
        studentSubjectsState={studentSubjectsState}
        goToClassGroups={goToClassGroups}
        setSearchText={setSearchText}
        filteredSubjects={filteredSubjects}
        role={role}
        />)
  );
});

export const StudentSubjectsMobileView: FC<StudentSubjectsViewProps> = memo(({
  role,
  setSearchText,
  studentSubjectsState,
  goToClassGroups,
  filteredSubjects
}) => {

  return (
    <WrapperMobile role={role} header='Предметы'>
      {studentSubjectsState.loading === 'loading' && 
        <Column style={{position: 'absolute', height: '100vh', top: 0}}>
          <CircleLoading state={studentSubjectsState.loading}/>
        </Column>
      }
      <Search value={studentSubjectsState.searchText} setValue={setSearchText}/>
      <Spacing themeSpace={20} variant='Column' />
      <ItemsContainerMobile>
        {filteredSubjects.map((item) => <>
          <ActionButton onClick={() => goToClassGroups(item.classGroups, item.subjectName)} text={item.subjectName} />
          </>)}
      </ItemsContainerMobile>
    </WrapperMobile>
  );
});

export const StudentSubjectsDesktopView: FC<StudentSubjectsViewProps> = memo(({
  role,
  setSearchText,
  studentSubjectsState,
  goToClassGroups,
  filteredSubjects
}) => {

  return (
    <WrapperDesktop role={role} header='Предметы'>
      {studentSubjectsState.loading === 'loading' && 
        <Column style={{position: 'absolute', height: '100vh', top: 0}}>
          <CircleLoading state={studentSubjectsState.loading}/>
        </Column>
      }
      <Column horizontalAlign='center' style={{width: 695}}>
        <Search isMobile={false} value={studentSubjectsState.searchText} setValue={setSearchText}/>
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