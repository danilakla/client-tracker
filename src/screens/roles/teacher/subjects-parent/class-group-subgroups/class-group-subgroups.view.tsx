
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
import { ClassGroupSubroupsState, SubgroupInfo } from '../../../../../store/reducers/roles/teacher/class-group-subroups-slice';
import { ActionBlockButton } from '../../../../../ui-kit/action-block-button';
import { GridContainer } from '../../../../../ui-kit/grid-container';

export type ClassGroupSubgroupsViewProps = {
  teacherClassGroupSubroupsState: ClassGroupSubroupsState;
  filteredSubgroups: SubgroupInfo[];
  onPrevScreen: () => void;
  setSearchText: (value: string) => void;
  goToClassGroubBySubgroup: (subgroup: SubgroupInfo) => void;
  isSuccess: boolean;
};

export const ClassGroupSubgroupsView: FC<ClassGroupSubgroupsViewProps> = memo(({
  teacherClassGroupSubroupsState,
  filteredSubgroups,
  goToClassGroubBySubgroup,
  setSearchText,
  isSuccess,
  onPrevScreen
}) => {
  const isMobile = useMediaQuery({maxWidth: theme.toMobileSize});

  return (
    isMobile ? 
      (<SubjectsMobileView
        onPrevScreen={onPrevScreen}
        goToClassGroubBySubgroup={goToClassGroubBySubgroup}
        teacherClassGroupSubroupsState={teacherClassGroupSubroupsState}
        setSearchText={setSearchText}
        isSuccess={isSuccess}
        filteredSubgroups={filteredSubgroups}
        />) :
      (<SubjectsDesktopView
        onPrevScreen={onPrevScreen}
        goToClassGroubBySubgroup={goToClassGroubBySubgroup}
        teacherClassGroupSubroupsState={teacherClassGroupSubroupsState}
        setSearchText={setSearchText}
        isSuccess={isSuccess}
        filteredSubgroups={filteredSubgroups}
        />)
  );
});


type LocalViewProps = {
  teacherClassGroupSubroupsState: ClassGroupSubroupsState;
  filteredSubgroups: SubgroupInfo[];
  onPrevScreen: () => void;
  setSearchText: (value: string) => void;
  goToClassGroubBySubgroup: (subgroup: SubgroupInfo) => void;
  isSuccess: boolean;
};

export const SubjectsMobileView: FC<LocalViewProps> = memo(({
  teacherClassGroupSubroupsState,
  filteredSubgroups,
  goToClassGroubBySubgroup,
  onPrevScreen,
  isSuccess,
  setSearchText
}) => {

  return (
    <WrapperMobile onBack={onPrevScreen} role='ROLE_TEACHER' header={
      teacherClassGroupSubroupsState.loading === 'loading' ? 'Загрузка...' : 'Список подгрупп'
    }>
      {teacherClassGroupSubroupsState.loading === 'loading' || !isSuccess ?
      <Column style={{position: 'absolute', height: '100dvh', top: 0}}>
        <CircleLoading state={teacherClassGroupSubroupsState.loading}/>
      </Column> : <>
        <Search value={teacherClassGroupSubroupsState.searchText} setValue={setSearchText}/>
        <Spacing themeSpace={20} variant='Column' />
        <ItemsContainerMobile>
          {filteredSubgroups.map((item, index) => <>
            <ActionButton key={index} onClick={() => goToClassGroubBySubgroup(item)} text={item.subgroup.subgroupNumber} />
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
  onPrevScreen,
  setSearchText
}) => {

  return (
    <WrapperDesktop onBack={onPrevScreen} role='ROLE_TEACHER' header={
      teacherClassGroupSubroupsState.loading === 'loading' ? 'Загрузка...' : 'Список подгрупп'
    }>
      {teacherClassGroupSubroupsState.loading === 'loading' && 
        <Column style={{position: 'absolute', height: '100dvh', top: 0}}>
          <CircleLoading state={teacherClassGroupSubroupsState.loading}/>
        </Column>
      }
      <Column horizontalAlign='center' style={{width: 695, height: '100%' }}>
        <Search isMobile={false} value={teacherClassGroupSubroupsState.searchText} setValue={setSearchText}/>
        <Spacing themeSpace={30} variant='Column' />
        <GridContainer columns={4}>
          {filteredSubgroups.map((item, index) => <>
            <ActionBlockButton key={index}
              onClick={() => goToClassGroubBySubgroup(item)} 
              text={item.subgroup.subgroupNumber} />
            </>)}
        </GridContainer>
      </Column>
    </WrapperDesktop>
  );
});