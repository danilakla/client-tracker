
import { FC, memo } from 'react';
import { theme } from '../../ui-kit/themes/theme';
import { useMediaQuery } from 'react-responsive';
import { WrapperMobile } from '../../components/wrapper-mobile';
import { WrapperDesktop } from '../../components/wrapper-desktop';

export type WarningViewProps = {

};

export const WarningView: FC<WarningViewProps> = memo(() => {
  const isMobile = useMediaQuery({maxWidth: theme.toMobileSize});

  return (
    isMobile ? 
      (<WarningMobileView
        />) :
      (<WarningDesktopView
        />)
  );
});


export const WarningMobileView: FC<WarningViewProps> = memo(() => {

  return (
    <>
    ERROR ILYA
    </>
  );
});

export const WarningDesktopView: FC<WarningViewProps> = memo(() => {

  return (
      <>
      ERROR ILYA
      </>
  );
});