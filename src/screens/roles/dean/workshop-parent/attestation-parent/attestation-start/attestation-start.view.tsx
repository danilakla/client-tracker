
import { FC, memo, useCallback, useState } from 'react';
import { theme } from '../../../../../../ui-kit/themes/theme';
import { useMediaQuery } from 'react-responsive';
import { WrapperMobile } from '../../../../../../components/wrapper-mobile';
import { WrapperDesktop } from '../../../../../../components/wrapper-desktop';
import { AttestationStartState } from '../../../../../../store/reducers/roles/dean/attestation-start-slice';
import { SuccessfulPopup } from '../../../../../../ui-kit/successful-popup';
import { Surface } from '../../../../../../ui-kit/surface';
import { Input } from '../../../../../../ui-kit/input';
import { Spacing } from '../../../../../../ui-kit/spacing';
import { Row } from '../../../../../../ui-kit/row';
import { Button } from '../../../../../../ui-kit/button';
import { Column } from '../../../../../../ui-kit/column';

export type AttestationStartViewProps = {
  goToAttestation: () => void;
  deanAttestationStartState: AttestationStartState;
  setTimeOfDay: (value: string) => void;
  startAttestation: (onSuccess: () => void) => void;
};

export const AttestationStartView: FC<AttestationStartViewProps> = memo(({
  goToAttestation,
  deanAttestationStartState,
  setTimeOfDay,
  startAttestation
}) => {
  const isMobile = useMediaQuery({maxWidth: theme.toMobileSize});


  const [isOpenSuccess, setIsOpenSuccess] = useState<boolean>(false);

  const openSuccess = useCallback(() => {
    setIsOpenSuccess(true);
  }, []);

  const handleStart = useCallback(() => {
    startAttestation(openSuccess);
  }, [startAttestation, openSuccess]);

  const closeSuccess = useCallback(() => {
    goToAttestation();
    setIsOpenSuccess(false);
  }, [goToAttestation]);

  return (
    <>
    {isMobile ? 
      (<AttestationStartMobileView
        goToAttestation={goToAttestation}
        setTimeOfDay={setTimeOfDay}
        startAttestation={handleStart}
        deanAttestationStartState={deanAttestationStartState}
        />) :
      (<AttestationStartDesktopView
        setTimeOfDay={setTimeOfDay}
        startAttestation={handleStart}
        deanAttestationStartState={deanAttestationStartState}
        goToAttestation={goToAttestation}
        />)}
    <SuccessfulPopup
        text={<>
          Аттестация<br/>
          успешно запущена
        </>}
        isOpen={isOpenSuccess}
        closePopup={closeSuccess}
      />
    </>
  );
});

type LocalViewProps = {
  goToAttestation: () => void;
  deanAttestationStartState: AttestationStartState;
  setTimeOfDay: (value: string) => void;
  startAttestation: () => void;
};

export const AttestationStartMobileView: FC<LocalViewProps> = memo(({
  goToAttestation,
  deanAttestationStartState,
  setTimeOfDay,
  startAttestation
}) => {

  return (
    <WrapperMobile role='ROLE_DEAN' header='Запуск аттестации' onBack={goToAttestation}>
      <Column horizontalAlign='center'>
        <Input 
          header='Введите длительность аттестации, дней' 
          placeholder='14' error={deanAttestationStartState.errors["TimeOfDayError"]}
          value={deanAttestationStartState.timeOfDay} setValue={setTimeOfDay}/>
        <Spacing variant='Column' themeSpace={35}/>
        <Row>
          <Button onClick={startAttestation} state={deanAttestationStartState.loadingStart} variant='recomended' padding={[12,17]}>
            Сохранить
          </Button>
          <Spacing variant='Row' themeSpace={25}/>
          <Button onClick={goToAttestation} state={'idle'} variant='attentive' padding={[12,17]}>
            Отмена
          </Button>
        </Row>
      </Column>
    </WrapperMobile>
  );
});

export const AttestationStartDesktopView: FC<LocalViewProps> = memo(({
  goToAttestation,
  deanAttestationStartState,
  setTimeOfDay,
  startAttestation
}) => {

  return (
    <WrapperDesktop role='ROLE_DEAN' header='Запуск аттестации' onBack={goToAttestation} isCenter={true}>
      <Surface style={{width: 'auto'}}>
        <Column horizontalAlign='center'>
          <Input 
            header='Введите длительность аттестации, дней' 
            placeholder='14' error={deanAttestationStartState.errors["TimeOfDayError"]}
            value={deanAttestationStartState.timeOfDay} setValue={setTimeOfDay}/>
          <Spacing variant='Column' themeSpace={35}/>
          <Row>
            <Button onClick={startAttestation} state={deanAttestationStartState.loadingStart} variant='recomended' padding={[12,17]}>
              Сохранить
            </Button>
            <Spacing variant='Row' themeSpace={25}/>
            <Button onClick={goToAttestation} state={'idle'} variant='attentive' padding={[12,17]}>
              Отмена
            </Button>
          </Row>
        </Column>
      </Surface>
    </WrapperDesktop>
  );
});