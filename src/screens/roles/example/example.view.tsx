
import { FC, memo } from 'react';
import { theme } from '../../../ui-kit/themes/theme';
import { useMediaQuery } from 'react-responsive';
import { WrapperMobile } from '../../../components/wrapper-mobile';
import { WrapperDesktop } from '../../../components/wrapper-desktop';

export type ExampleViewProps = {

};

export const ExampleView: FC<ExampleViewProps> = memo(() => {
  const isMobile = useMediaQuery({maxWidth: theme.toMobileSize});

  return (
    isMobile ? 
      (<ExampleMobileView
        />) :
      (<ExampleDesktopView
        />)
  );
});


export const ExampleMobileView: FC<ExampleViewProps> = memo(() => {

  return (
    <WrapperMobile role='ROLE_ADMIN' header='my profile'>
    </WrapperMobile>
  );
});

export const ExampleDesktopView: FC<ExampleViewProps> = memo(() => {

  return (
    <WrapperDesktop role='ROLE_ADMIN' header='my profile'>
    </WrapperDesktop>
  );
});