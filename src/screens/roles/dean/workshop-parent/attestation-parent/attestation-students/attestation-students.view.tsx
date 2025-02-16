
import { FC, memo } from 'react';
import { theme } from '../../../../../../ui-kit/themes/theme';
import { useMediaQuery } from 'react-responsive';
import { WrapperMobile } from '../../../../../../components/wrapper-mobile';
import { WrapperDesktop } from '../../../../../../components/wrapper-desktop';
import { AttestationStudentsState } from '../../../../../../store/reducers/roles/dean/attestation-students-slice';

export type AttestationStudentsViewProps = {
  goToAttestation: () => void;
  deanAttestationStudentsState: AttestationStudentsState;
};

export const AttestationStudentsView: FC<AttestationStudentsViewProps> = memo(({
  goToAttestation,
  deanAttestationStudentsState,
}) => {
  const isMobile = useMediaQuery({maxWidth: theme.toMobileSize});

  return (
    isMobile ? 
      (<AttestationStudentsMobileView
        goToAttestation={goToAttestation}
        deanAttestationStudentsState={deanAttestationStudentsState}
        />) :
      (<AttestationStudentsDesktopView
        goToAttestation={goToAttestation}
        deanAttestationStudentsState={deanAttestationStudentsState}
        />)
  );
});


type LocalViewProps = {
  goToAttestation: () => void;
  deanAttestationStudentsState: AttestationStudentsState;
};

export const AttestationStudentsMobileView: FC<LocalViewProps> = memo(({
  goToAttestation,
  deanAttestationStudentsState
}) => {

  return (
    <WrapperMobile role='ROLE_DEAN' header='Список студентов' onBack={goToAttestation}>
    </WrapperMobile>
  );
});

export const AttestationStudentsDesktopView: FC<LocalViewProps> = memo(({
  goToAttestation,
  deanAttestationStudentsState
}) => {

  return (
    <WrapperDesktop role='ROLE_DEAN' header='Список студентов' onBack={goToAttestation}>
    </WrapperDesktop>
  );
});