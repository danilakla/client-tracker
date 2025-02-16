
import { FC, memo } from 'react';
import { theme } from '../../../../../../ui-kit/themes/theme';
import { useMediaQuery } from 'react-responsive';
import { WrapperMobile } from '../../../../../../components/wrapper-mobile';
import { WrapperDesktop } from '../../../../../../components/wrapper-desktop';

export type AttestationTeachersViewProps = {
  goToAttestation: () => void;
};

export const AttestationTeachersView: FC<AttestationTeachersViewProps> = memo(({
  goToAttestation
}) => {
  const isMobile = useMediaQuery({maxWidth: theme.toMobileSize});

  return (
    isMobile ? 
      (<AttestationTeachersMobileView
        goToAttestation={goToAttestation}
        />) :
      (<AttestationTeachersDesktopView
        goToAttestation={goToAttestation}
        />)
  );
});


type LocalViewProps = {
  goToAttestation: () => void;
};

export const AttestationTeachersMobileView: FC<LocalViewProps> = memo(({
  goToAttestation
}) => {

  return (
    <WrapperMobile role='ROLE_DEAN' header='Список преподавателей' onBack={goToAttestation}>
    </WrapperMobile>
  );
});

export const AttestationTeachersDesktopView: FC<LocalViewProps> = memo(({
  goToAttestation
}) => {

  return (
    <WrapperDesktop role='ROLE_DEAN' header='Список преподавателей' onBack={goToAttestation}>
    </WrapperDesktop>
  );
});