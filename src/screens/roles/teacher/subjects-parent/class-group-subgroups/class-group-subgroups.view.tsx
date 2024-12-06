
import { FC, memo } from 'react';
import { useMediaQuery } from 'react-responsive';
import { theme } from '../../../../../ui-kit/themes/theme';
import { WrapperMobile } from '../../../../../components/wrapper-mobile';
import { WrapperDesktop } from '../../../../../components/wrapper-desktop';
import { Column } from '../../../../../ui-kit/column';
import { CircleLoading } from '../../../../../ui-kit/circle-loading';
import { Row } from '../../../../../ui-kit/row';
import { Search } from '../../../../../ui-kit/search';
import { Spacing } from '../../../../../ui-kit/spacing';
import { Button } from '../../../../../ui-kit/button';
import { ItemsContainerMobile } from '../../../dean/workshop-parent/subjects-parent/control-subjects/control-subjects.styled';
import { ActionButton } from '../../../../../ui-kit/action-button';
import { ClassGroupInfo } from '../../../../../store/reducers/roles/teacher/subjects-slice';
import { ClassGroupsState } from '../../../../../store/reducers/roles/teacher/class-groups-slice';
import { ClassGroupSubroupsState } from '../../../../../store/reducers/roles/teacher/class-group-subroups-slice';
import { SubgroupInfo } from '../../../../../store/reducers/roles/dean/subjects-parent/class-group-details-slice';

export type ClassGroupSubgroupsViewProps = {
  teacherClassGroupSubroupsState: ClassGroupSubroupsState;
  filteredSubgroups: SubgroupInfo[];
  goToSubjects: () => void;
  setSearchText: (value: string) => void;
  goToClassGroubBySubgroup: (subgroup: SubgroupInfo) => void;
};

export const ClassGroupSubgroupsView: FC<ClassGroupSubgroupsViewProps> = memo(({
  teacherClassGroupSubroupsState,
  filteredSubgroups,
  goToClassGroubBySubgroup,
  goToSubjects,
  setSearchText
}) => {
  const isMobile = useMediaQuery({maxWidth: theme.toMobileSize});

  return (
    isMobile ? 
      (<SubjectsMobileView
        goToClassGroubBySubgroup={goToClassGroubBySubgroup}
        goToSubjects={goToSubjects}
        teacherClassGroupSubroupsState={teacherClassGroupSubroupsState}
        setSearchText={setSearchText}
        filteredSubgroups={filteredSubgroups}
        />) :
      (<SubjectsDesktopView
        goToSubjects={goToSubjects}
        goToClassGroubBySubgroup={goToClassGroubBySubgroup}
        teacherClassGroupSubroupsState={teacherClassGroupSubroupsState}
        setSearchText={setSearchText}
        filteredSubgroups={filteredSubgroups}
        />)
  );
});


type LocalViewProps = {
  teacherClassGroupSubroupsState: ClassGroupSubroupsState;
  filteredSubgroups: SubgroupInfo[];
  setSearchText: (value: string) => void;
  goToSubjects: () => void;
  goToClassGroubBySubgroup: (subgroup: SubgroupInfo) => void;
};

export const SubjectsMobileView: FC<LocalViewProps> = memo(({
  teacherClassGroupSubroupsState,
  filteredSubgroups,
  goToClassGroubBySubgroup,
  goToSubjects,
  setSearchText
}) => {

  return (
    <WrapperMobile onBack={goToSubjects} role='ROLE_TEACHER' header={''}>
      {teacherClassGroupSubroupsState.loading === 'loading' && 
        <Column style={{position: 'absolute', height: '100vh', top: 0}}>
          <CircleLoading state={teacherClassGroupSubroupsState.loading}/>
        </Column>}
      <Search value={teacherClassGroupSubroupsState.searchText} setValue={setSearchText}/>
      <Spacing themeSpace={20} variant='Column' />
      <ItemsContainerMobile>
        {filteredSubgroups.map((item) => <>
          <ActionButton onClick={() => goToClassGroubBySubgroup(item)} text={item.subgroupNumber} />
          </>)}
      </ItemsContainerMobile>
    </WrapperMobile>
  );
});

export const SubjectsDesktopView: FC<LocalViewProps> = memo(() => {

  return (
    <WrapperDesktop role='ROLE_TEACHER' header='Предметы'>

    </WrapperDesktop>
  );
});