
import { FC, memo } from 'react';
import { theme } from '../../../../../../ui-kit/themes/theme';
import { useMediaQuery } from 'react-responsive';
import { WrapperMobile } from '../../../../../../components/wrapper-mobile';
import { WrapperDesktop } from '../../../../../../components/wrapper-desktop';
import { AttestationTeachersState, TeacherDto } from '../../../../../../store/reducers/roles/dean/attestation-teachers-slice';
import { Column } from '../../../../../../ui-kit/column';
import { CircleLoading } from '../../../../../../ui-kit/circle-loading';
import { Search } from '../../../../../../ui-kit/search';
import { GridContainer } from '../../../../../../ui-kit/grid-container';
import { ActionBlockButton } from '../../../../../../ui-kit/action-block-button';
import { Spacing } from '../../../../../../ui-kit/spacing';
import { ActionButton } from '../../../../../../ui-kit/action-button';
import { ItemsContainerMobile } from '../../subjects-parent/control-subjects/control-subjects.styled';

export type AttestationTeachersViewProps = {
  goToAttestation: () => void;
  deanAttestationTeachersState: AttestationTeachersState;
  filteredTeachers: TeacherDto[];
  setSearchText: (value: string) => void;
};

export const AttestationTeachersView: FC<AttestationTeachersViewProps> = memo(({
  goToAttestation,
  deanAttestationTeachersState,
  filteredTeachers,
  setSearchText
}) => {
  const isMobile = useMediaQuery({maxWidth: theme.toMobileSize});

  return (
    isMobile ? 
      (<AttestationTeachersMobileView
        filteredTeachers={filteredTeachers}
        goToAttestation={goToAttestation}
        setSearchText={setSearchText}
        deanAttestationTeachersState={deanAttestationTeachersState}
        />) :
      (<AttestationTeachersDesktopView
        setSearchText={setSearchText}
        filteredTeachers={filteredTeachers}
        goToAttestation={goToAttestation}
        deanAttestationTeachersState={deanAttestationTeachersState}
        />)
  );
});


type LocalViewProps = {
  goToAttestation: () => void;
  deanAttestationTeachersState: AttestationTeachersState;
  filteredTeachers: TeacherDto[];
  setSearchText: (value: string) => void;
};

export const AttestationTeachersMobileView: FC<LocalViewProps> = memo(({
  goToAttestation,
  deanAttestationTeachersState,
  filteredTeachers,
  setSearchText
}) => {

  return (
    <WrapperMobile role='ROLE_DEAN' header='Список преподавателей' onBack={goToAttestation}>
      {deanAttestationTeachersState.loading === 'loading' && 
        <Column style={{position: 'absolute', height: '100dvh', top: 0}}>
          <CircleLoading state={deanAttestationTeachersState.loading}/>
        </Column>
      }
      <Search value={deanAttestationTeachersState.searchText} setValue={setSearchText}/>
      <Spacing themeSpace={20} variant='Column' />
      <ItemsContainerMobile>
        {filteredTeachers.map((item, index) => <>
          <ActionButton key={index} text={item.flpName} isShowArrow={false}/>
          </>)}
      </ItemsContainerMobile>
    </WrapperMobile>
  );
});

export const AttestationTeachersDesktopView: FC<LocalViewProps> = memo(({
  goToAttestation,
  deanAttestationTeachersState,
  filteredTeachers,
  setSearchText
}) => {

  return (
    <WrapperDesktop role='ROLE_DEAN' header='Список преподавателей' onBack={goToAttestation}>
      {deanAttestationTeachersState.loading === 'loading' && 
        <Column style={{position: 'absolute', height: '100dvh', top: 0}}>
          <CircleLoading state={deanAttestationTeachersState.loading}/>
        </Column>
      }
      <Column horizontalAlign='center' style={{width: 695, height: '100%'}}>
        <Search isMobile={false} value={deanAttestationTeachersState.searchText} setValue={setSearchText}/>
        <Spacing themeSpace={30} variant='Column' />
        <GridContainer columns={4}>
          {filteredTeachers.map((item, index) =>
            <ActionBlockButton key={index}
              text={item.flpName} />)}
        </GridContainer>
      </Column>
    </WrapperDesktop>
  );
});