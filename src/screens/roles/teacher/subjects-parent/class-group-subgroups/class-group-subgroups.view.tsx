
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
import { ClassGroupSubroupsState, SubgroupInfo } from '../../../../../store/reducers/roles/teacher/class-group-subroups-slice';
import { ActionBlockButton } from '../../../../../ui-kit/action-block-button';
import { GridContainer } from '../../../../../ui-kit/grid-container';

export type ClassGroupSubgroupsViewProps = {
  teacherClassGroupSubroupsState: ClassGroupSubroupsState;
  filteredSubgroups: SubgroupInfo[];
  goToTeacherClassGroups: () => void;
  setSearchText: (value: string) => void;
  goToClassGroubBySubgroup: (subgroup: SubgroupInfo) => void;
};

export const ClassGroupSubgroupsView: FC<ClassGroupSubgroupsViewProps> = memo(({
  teacherClassGroupSubroupsState,
  filteredSubgroups,
  goToClassGroubBySubgroup,
  goToTeacherClassGroups,
  setSearchText
}) => {
  const isMobile = useMediaQuery({maxWidth: theme.toMobileSize});

  return (
    isMobile ? 
      (<SubjectsMobileView
        goToClassGroubBySubgroup={goToClassGroubBySubgroup}
        goToTeacherClassGroups={goToTeacherClassGroups}
        teacherClassGroupSubroupsState={teacherClassGroupSubroupsState}
        setSearchText={setSearchText}
        filteredSubgroups={filteredSubgroups}
        />) :
      (<SubjectsDesktopView
        goToTeacherClassGroups={goToTeacherClassGroups}
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
  goToTeacherClassGroups: () => void;
  setSearchText: (value: string) => void;
  goToClassGroubBySubgroup: (subgroup: SubgroupInfo) => void;
};

export const SubjectsMobileView: FC<LocalViewProps> = memo(({
  teacherClassGroupSubroupsState,
  filteredSubgroups,
  goToClassGroubBySubgroup,
  goToTeacherClassGroups,
  setSearchText
}) => {

  return (
    <WrapperMobile onBack={goToTeacherClassGroups} role='ROLE_TEACHER' header={'Список подгрупп'}>
      {teacherClassGroupSubroupsState.loading === 'loading' ?
      <Column style={{position: 'absolute', height: '100vh', top: 0}}>
        <CircleLoading state={teacherClassGroupSubroupsState.loading}/>
      </Column> : <>
        <Search value={teacherClassGroupSubroupsState.searchText} setValue={setSearchText}/>
        <Spacing themeSpace={20} variant='Column' />
        <ItemsContainerMobile>
          {filteredSubgroups.map((item) => <>
            <ActionButton onClick={() => goToClassGroubBySubgroup(item)} text={item.subgroupNumber} />
            </>)}
        </ItemsContainerMobile>
      </>}
    </WrapperMobile>
  );
});

export const SubjectsDesktopView: FC<LocalViewProps> = memo(({
  teacherClassGroupSubroupsState,
  filteredSubgroups,
  goToClassGroubBySubgroup,
  goToTeacherClassGroups,
  setSearchText
}) => {

  return (
    <WrapperDesktop onBack={goToTeacherClassGroups} role='ROLE_TEACHER' header={'Список подгрупп'}>
      {teacherClassGroupSubroupsState.loading === 'loading' && 
        <Column style={{position: 'absolute', height: '100vh', top: 0}}>
          <CircleLoading state={teacherClassGroupSubroupsState.loading}/>
        </Column>
      }
      <Column horizontalAlign='center' style={{width: 695}}>
        <Search isMobile={false} value={teacherClassGroupSubroupsState.searchText} setValue={setSearchText}/>
        <Spacing themeSpace={30} variant='Column' />
        <GridContainer columns={4}>
          {filteredSubgroups.map((item) => <>
            <ActionBlockButton 
              onClick={() => goToClassGroubBySubgroup(item)} 
              text={item.subgroupNumber} />
            </>)}
        </GridContainer>
      </Column>
    </WrapperDesktop>
  );
});