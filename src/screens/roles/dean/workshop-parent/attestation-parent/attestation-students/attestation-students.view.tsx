
import { FC, memo } from 'react';
import { theme } from '../../../../../../ui-kit/themes/theme';
import { useMediaQuery } from 'react-responsive';
import { WrapperMobile } from '../../../../../../components/wrapper-mobile';
import { WrapperDesktop } from '../../../../../../components/wrapper-desktop';

export type AttestationStudentsViewProps = {
  goToAttestation: () => void;
};

export const AttestationStudentsView: FC<AttestationStudentsViewProps> = memo(({
  goToAttestation
}) => {
  const isMobile = useMediaQuery({maxWidth: theme.toMobileSize});

  return (
    isMobile ? 
      (<AttestationStudentsMobileView
        goToAttestation={goToAttestation}
        />) :
      (<AttestationStudentsDesktopView
        goToAttestation={goToAttestation}
        />)
  );
});


type LocalViewProps = {
  goToAttestation: () => void;
};

export const AttestationStudentsMobileView: FC<LocalViewProps> = memo(({
  goToAttestation
}) => {

  return (
    <WrapperMobile role='ROLE_DEAN' header='Список студентов' onBack={goToAttestation}>
    </WrapperMobile>
  );
});

export const AttestationStudentsDesktopView: FC<LocalViewProps> = memo(({
  goToAttestation
}) => {

  return (
    <WrapperDesktop role='ROLE_DEAN' header='Список студентов' onBack={goToAttestation}>
    </WrapperDesktop>
  );
});