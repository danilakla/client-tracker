
import { FC, memo } from 'react';
import { theme } from '../../../../../../ui-kit/themes/theme';
import { useMediaQuery } from 'react-responsive';
import { WrapperMobile } from '../../../../../../components/wrapper-mobile';
import { WrapperDesktop } from '../../../../../../components/wrapper-desktop';

export type AttestationStartViewProps = {
  goToAttestation: () => void;
};

export const AttestationStartView: FC<AttestationStartViewProps> = memo(({
  goToAttestation
}) => {
  const isMobile = useMediaQuery({maxWidth: theme.toMobileSize});

  return (
    isMobile ? 
      (<AttestationStartMobileView
        goToAttestation={goToAttestation}
        />) :
      (<AttestationStartDesktopView
        goToAttestation={goToAttestation}
        />)
  );
});


type LocalViewProps = {
  goToAttestation: () => void;
};

export const AttestationStartMobileView: FC<LocalViewProps> = memo(({
  goToAttestation
}) => {

  return (
    <WrapperMobile role='ROLE_DEAN' header='Запуск аттестации' onBack={goToAttestation}>
    </WrapperMobile>
  );
});

export const AttestationStartDesktopView: FC<LocalViewProps> = memo(({
  goToAttestation
}) => {

  return (
    <WrapperDesktop role='ROLE_DEAN' header='Запуск аттестации' onBack={goToAttestation}>
    </WrapperDesktop>
  );
});