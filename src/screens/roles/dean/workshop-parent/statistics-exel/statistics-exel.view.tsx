
import { FC, memo } from 'react';
import { theme } from '../../../../../ui-kit/themes/theme';
import { useMediaQuery } from 'react-responsive';
import { WrapperMobile } from '../../../../../components/wrapper-mobile';
import { WrapperDesktop } from '../../../../../components/wrapper-desktop';

export type StatisticsExcelViewProps = {
  goToWorkshop: () => void;
};

export const StatisticsExcelView: FC<StatisticsExcelViewProps> = memo(({
  goToWorkshop
}) => {
  const isMobile = useMediaQuery({maxWidth: theme.toMobileSize});

  return (
    isMobile ? 
      (<StatisticsExcelMobileView
        goToWorkshop={goToWorkshop}
        />) :
      (<StatisticsExcelDesktopView
        goToWorkshop={goToWorkshop}
        />)
  );
});


export const StatisticsExcelMobileView: FC<StatisticsExcelViewProps> = memo(({
  goToWorkshop
}) => {

  return (
    <WrapperMobile onBack={goToWorkshop} role='ROLE_DEAN' header='Статистика'>
    </WrapperMobile>
  );
});

export const StatisticsExcelDesktopView: FC<StatisticsExcelViewProps> = memo(({
  goToWorkshop
}) => {

  return (
    <WrapperDesktop onBack={goToWorkshop} role='ROLE_DEAN' header='Статистика'>
    </WrapperDesktop>
  );
});