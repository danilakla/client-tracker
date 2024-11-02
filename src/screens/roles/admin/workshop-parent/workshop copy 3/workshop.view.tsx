
import { FC, memo } from 'react';
import { useMediaQuery } from 'react-responsive';
import { WrapperMobile } from '../../../../../components/wrapper-mobile';
import { WrapperDesktop } from '../../../../../components/wrapper-desktop';
import { theme } from '../../../../../ui-kit/themes/theme';

export type WorkshopViewProps = {

};

export const WorkshopView: FC<WorkshopViewProps> = memo(() => {
  const isMobile = useMediaQuery({maxWidth: theme.toMobileSize});

  return (
    isMobile ? 
      (<WorkshopMobileView
        />) :
      (<WorkshopDesktopView
        />)
  );
});


export const WorkshopMobileView: FC<WorkshopViewProps> = memo(() => {

  return (
    <WrapperMobile role='ROLE_ADMIN' header='my profile'>
    </WrapperMobile>
  );
});

export const WorkshopDesktopView: FC<WorkshopViewProps> = memo(() => {

  return (
    <WrapperDesktop role='ROLE_ADMIN' header='my profile'>
    </WrapperDesktop>
  );
});