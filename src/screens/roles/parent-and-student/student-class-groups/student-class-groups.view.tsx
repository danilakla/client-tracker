
import { FC, memo } from 'react';
import { useMediaQuery } from 'react-responsive';
import { theme } from '../../../../ui-kit/themes/theme';
import { WrapperMobile } from '../../../../components/wrapper-mobile';
import { WrapperDesktop } from '../../../../components/wrapper-desktop';
import { ClassGroupInfo } from '../../../../store/reducers/roles/student-and-parent/student-subjects-slice';
import { ItemsContainerMobile } from '../../dean/workshop-parent/subjects-parent/control-subjects/control-subjects.styled';
import { Spacing } from '../../../../ui-kit/spacing';
import { Search } from '../../../../ui-kit/search';
import { ActionButton } from '../../../../ui-kit/action-button';

export type StudentClassGroupsViewProps = {
  filteredClassGroups: ClassGroupInfo[];
  role: "ROLE_STUDENT" | "ROLE_PARENT";
  nameSubject: string;
  goToTable: (classGroup: ClassGroupInfo) => void;
  setSearchText: (value: string) => void;
  goToStudentSubjects: () => void;
  searchText: string;
};

export const StudentClassGroupsView: FC<StudentClassGroupsViewProps> = memo(({
  filteredClassGroups,
  searchText,
  setSearchText,
  nameSubject,
  goToTable,
  role,
  goToStudentSubjects
}) => {
  const isMobile = useMediaQuery({maxWidth: theme.toMobileSize});

  return (
    isMobile ? 
      (<StudentClassGroupsMobileView
        nameSubject={nameSubject}
        role={role}
        goToTable={goToTable}
        searchText={searchText}
        filteredClassGroups={filteredClassGroups}
        setSearchText={setSearchText}
        goToStudentSubjects={goToStudentSubjects}
        />) :
      (<StudentClassGroupsDesktopView
        nameSubject={nameSubject}
        role={role}
        goToTable={goToTable}
        searchText={searchText}
        filteredClassGroups={filteredClassGroups}
        setSearchText={setSearchText}
        goToStudentSubjects={goToStudentSubjects}
        />)
  );
});


export const StudentClassGroupsMobileView: FC<StudentClassGroupsViewProps> = memo(({
  filteredClassGroups,
  setSearchText,
  nameSubject,
  searchText,
  goToTable,
  role,
  goToStudentSubjects
}) => {

  return (
    <WrapperMobile onBack={goToStudentSubjects} role={role} header={nameSubject}>
      <Search value={searchText} setValue={setSearchText}/>
      <Spacing themeSpace={20} variant='Column' />
      <ItemsContainerMobile>
        {filteredClassGroups.map((item) => <>
          <ActionButton onClick={() => goToTable(item)} text={item.description} />
          </>)}
      </ItemsContainerMobile>
    </WrapperMobile>
  );
});

export const StudentClassGroupsDesktopView: FC<StudentClassGroupsViewProps> = memo(() => {

  return (
    <WrapperDesktop role='ROLE_ADMIN' header='my profile'>

    </WrapperDesktop>
  );
});