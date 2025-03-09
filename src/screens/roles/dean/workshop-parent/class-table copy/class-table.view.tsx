
import { FC, memo } from 'react';
import { theme } from '../../../../../ui-kit/themes/theme';
import { useMediaQuery } from 'react-responsive';
import { WrapperMobile } from '../../../../../components/wrapper-mobile';
import { WrapperDesktop } from '../../../../../components/wrapper-desktop';

export type ClassTableViewProps = {

};

export const ClassTableView: FC<ClassTableViewProps> = memo(() => {
  const isMobile = useMediaQuery({maxWidth: theme.toMobileSize});

  return (
    isMobile ? 
      (<ClassTableMobileView
        />) :
      (<ClassTableDesktopView
        />)
  );
});

type LocalViewProps = {

}

export const ClassTableMobileView: FC<LocalViewProps> = memo(({

}) => {

  return (
    <WrapperMobile role='ROLE_DEAN' header='my profile'>
    </WrapperMobile>
  );
});

export const ClassTableDesktopView: FC<LocalViewProps> = memo(({

}) => {

  return (
    <WrapperDesktop role='ROLE_DEAN' header='my profile'>
    </WrapperDesktop>
  );
});