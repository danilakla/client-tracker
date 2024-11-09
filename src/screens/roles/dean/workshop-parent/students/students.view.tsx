
import { FC, memo } from 'react';
import { useMediaQuery } from 'react-responsive';
import { theme } from '../../../../../ui-kit/themes/theme';
import { WrapperMobile } from '../../../../../components/wrapper-mobile';
import { WrapperDesktop } from '../../../../../components/wrapper-desktop';

export type StudentsViewProps = {
  goToWorkshop: () => void;
};

export const StudentsView: FC<StudentsViewProps> = memo(({
  goToWorkshop
}) => {
  const isMobile = useMediaQuery({maxWidth: theme.toMobileSize});

  return (
    isMobile ? 
      (<StudentsMobileView
        goToWorkshop={goToWorkshop}
        />) :
      (<StudentsDesktopView
        goToWorkshop={goToWorkshop}
        />)
  );
});

type LocalViewData = {
  goToWorkshop: () => void;
}

export const StudentsMobileView: FC<LocalViewData> = memo(({
  goToWorkshop
}) => {

  return (
    <WrapperMobile onBack={goToWorkshop} role='ROLE_DEAN' header='Студенты'>
    </WrapperMobile>
  );
});

export const StudentsDesktopView: FC<LocalViewData> = memo(({
  goToWorkshop
}) => {
  
  return (
    <WrapperDesktop onBack={goToWorkshop} role='ROLE_DEAN' header='Студенты'>
    </WrapperDesktop>
  );
});