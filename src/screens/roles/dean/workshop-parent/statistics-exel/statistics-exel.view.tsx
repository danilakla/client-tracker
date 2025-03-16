
import { FC, memo, useCallback, useState } from 'react';
import { theme } from '../../../../../ui-kit/themes/theme';
import { useMediaQuery } from 'react-responsive';
import { WrapperMobile } from '../../../../../components/wrapper-mobile';
import { WrapperDesktop } from '../../../../../components/wrapper-desktop';
import { Column } from '../../../../../ui-kit/column';
import { Button } from '../../../../../ui-kit/button';
import { ErrorPopup } from '../../../../../ui-kit/error-popup';
import { SuccessfulPopup } from '../../../../../ui-kit/successful-popup';

export type StatisticsExcelViewProps = {
  goToWorkshop: () => void;
  getStatisticsExcel: (onSuccess: () => void, onError: () => void) => void;
  loading: "loading" | "idle" | "success" | "error";
};

export const StatisticsExcelView: FC<StatisticsExcelViewProps> = memo(({
  goToWorkshop,
  loading,
  getStatisticsExcel
}) => {
  const isMobile = useMediaQuery({maxWidth: theme.toMobileSize});

  const [isOpenSuccessWindow, setIsOpenSuccessWindow] = useState<boolean>(false);
  const openSuccessWindow = useCallback(() => {
    setIsOpenSuccessWindow(true);
  }, [])
  const closeSuccessWindow = useCallback(() => {
    setIsOpenSuccessWindow(false);
  }, [])

  const [isOpenErrorWindow, setIsOpenErrorWindow] = useState<boolean>(false);
  const openErrorWindow = useCallback(() => {
    setIsOpenErrorWindow(true);
  }, [])
  const closeErrorWindow = useCallback(() => {
    setIsOpenErrorWindow(false);
  }, [])

  const onGetHandle = useCallback(() => {
    getStatisticsExcel(openSuccessWindow, openErrorWindow);
  },[getStatisticsExcel, openSuccessWindow, openErrorWindow])

  return (
    <>
      {isMobile ? 
        (<StatisticsExcelMobileView
          onGet={onGetHandle}
          loading={loading}
          goToWorkshop={goToWorkshop}
          />) :
        (<StatisticsExcelDesktopView
          onGet={onGetHandle}
          loading={loading}
          goToWorkshop={goToWorkshop}
          />)}
      <ErrorPopup
        isOpen={isOpenErrorWindow}
        textError={
          <>
          Что-то пошло не так.
        </>}
        closePopup={closeErrorWindow}
      />
      <SuccessfulPopup
        text={'Статистика успешно получена'}
        isOpen={isOpenSuccessWindow}
        closePopup={closeSuccessWindow}
      />
    </>
  );
});


type LocalViewProps = {
  goToWorkshop: () => void;
  onGet: () => void;
  loading: "loading" | "idle" | "success" | "error";
} 

export const StatisticsExcelMobileView: FC<LocalViewProps> = memo(({
  goToWorkshop,
  onGet,
  loading
}) => {

  return (
    <WrapperMobile onBack={goToWorkshop} role='ROLE_DEAN' header='Статистика'>
      <Column style={{
        position: 'absolute',
        top: 0,
        height: '100dvh',
      }} horizontalAlign='center' verticalAlign='center'>
        <Button onClick={onGet} state={loading} variant='primary' padding={[12, 17]}>
          Скачать
        </Button>
      </Column>
    </WrapperMobile>
  );
});

export const StatisticsExcelDesktopView: FC<LocalViewProps> = memo(({
  goToWorkshop,
  onGet,
  loading
}) => {

  return (
    <WrapperDesktop onBack={goToWorkshop} role='ROLE_DEAN' header='Статистика'>
      <Column style={{
        position: 'absolute',
        top: 0,
        height: '100dvh',
      }} horizontalAlign='center' verticalAlign='center'>
        <Button onClick={onGet} state={loading} variant='primary' padding={[12, 17]}>
          Скачать
        </Button>
      </Column>
    </WrapperDesktop>
  );
});