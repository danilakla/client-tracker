
import { FC, memo, useCallback, useEffect, useRef, useState } from 'react';
import { useMediaQuery } from 'react-responsive';
import { theme } from '../../../../../ui-kit/themes/theme';
import { WrapperMobile } from '../../../../../components/wrapper-mobile';
import { WrapperDesktop } from '../../../../../components/wrapper-desktop';
import { Surface } from '../../../../../ui-kit/surface';
import { ClassesContainer, ClassesRow, ClassItem, ColorCircle, ColorCircleButton, ExistMark, HeaderClasses, HeaderClassItem, HorizontalSlider, HorizontalTrack, NameHeader, ScrollWrapper, StudentItem, StudentsContainer, Table, TableHeader, TableWrapper, VerticalSlider, VerticalTrack } from './class-group-panel.styled';
import { Text } from '../../../../../ui-kit/text';
import { Spacing } from '../../../../../ui-kit/spacing';
import { AttendanceCodeType, attendanceColorsForStudents, attendanceOptions, GradeInfo, HeaderClassType, QrCodeDataType, StatisticOfStudent, СlassGroupControlState } from '../../../../../store/reducers/roles/teacher/class-group-control-slice';
import { Button } from '../../../../../ui-kit/button';
import { Column } from '../../../../../ui-kit/column';
import { CircleLoading } from '../../../../../ui-kit/circle-loading';
import { Popup } from '../../../../../ui-kit/popup';
import { Modal } from '../../../../../ui-kit/modal';
import { Input } from '../../../../../ui-kit/input';
import { Row } from '../../../../../ui-kit/row';
import { ConfirmDeletePopup } from '../../../../../components/confirm-delete-popup';
import { Textarea } from '../../../../../ui-kit/textarea';
import { RangeSlider } from '../../../../../ui-kit/range-slider';

import ShieldLogo from '../../../../../ui-kit/assets/security-shield.svg';
import { Image } from '../../../../../ui-kit/image';
import QRCode from 'react-qr-code';
import React from 'react';

export type ClassGroupPanelViewProps = {
  teacherClassGroupControlState: СlassGroupControlState;
  goToTeacherClassGroupSubgroups: () => void;
  setSelectedGrade: (gradeInfo: GradeInfo, onSuccess: () => void) => void;
  updateGrade: (onSuccess: () => void) => void;
  deleteClass: (onSuccess: () => void) => void;
  createClass: (onSuccess: () => void) => void;
  setGradeNumber: (value: string) => void;
  reloadTable: () => void;
  setDescription: (value: string) => void;
  setAttendance: (value: AttendanceCodeType) => void;

  setSelectedClass: (value: HeaderClassType, onSuccess: () => void) => void;
  setExpirationOfRefresh: (value: number) => void
  setExpirationOfReview: (value: number) => void;

  activateKeyForClass: (expiration: number, onSuccess: () => void) => void

  clearQrCodeData: () => void;
  createQrCode: () => void;

  onReview: (onSuccess: () => void) => void;
};

export const ClassGroupPanelView: FC<ClassGroupPanelViewProps> = memo(({
  teacherClassGroupControlState,
  goToTeacherClassGroupSubgroups,
  createClass,
  updateGrade,
  setSelectedGrade,
  deleteClass,
  setAttendance,
  setDescription,
  setGradeNumber,
  reloadTable,
  onReview,

  setExpirationOfRefresh,
  setSelectedClass,
  setExpirationOfReview,

  activateKeyForClass,

  createQrCode,
  clearQrCodeData
}) => {
  const isMobile = useMediaQuery({maxWidth: theme.toMobileSize});

  const [isOpenAddPopup, setIsOpenAddPopup] = useState<boolean>(false);
  const [isOpenDeletePopup, setIsOpenDeletePopup] = useState<boolean>(false);

  const openAddPopup = useCallback(() => {
    setIsOpenAddPopup(true);
  },[])
  const closeAddPopup = useCallback(() => {
    setIsOpenAddPopup(false);
  },[])
  const confirmAdd = useCallback(() => {
    createClass(closeAddPopup);
  },[createClass, closeAddPopup])

  const openDeletePopup = useCallback(() => {
    setIsOpenDeletePopup(true);
  },[])
  const closeDeletePopup = useCallback(() => {
    setIsOpenDeletePopup(false);
  },[])
  const confirmDeletePopup = useCallback(() => {
    deleteClass(closeDeletePopup);
  },[deleteClass, closeDeletePopup])

  const [isOpenUpdateWindow, setIsOpenUpdateWindow] = useState<boolean>(false);
  
  const closeUpdateWindow = useCallback(() => {
    setIsOpenUpdateWindow(false);
  },[])

  const openUpdateWindow = useCallback((value: GradeInfo) => {
    setSelectedGrade(value, () => setIsOpenUpdateWindow(true));
  },[setSelectedGrade])

  const confirmUpdate = useCallback(() => {
    updateGrade(closeUpdateWindow);
  },[updateGrade, closeUpdateWindow])

  const [isOpenGenerateKeyPopup, setIsOpenGenerateKeyPopup] = useState<boolean>(false);
  const controlGenerateKeyPopup = useCallback(() => {
    setIsOpenGenerateKeyPopup(!isOpenGenerateKeyPopup);
  },[isOpenGenerateKeyPopup])
  const [isOpenQrCodePopup, setIsOpenQrCodePopup] = useState<boolean>(false);
  const controlQrCodePopup = useCallback(() => {
    setIsOpenQrCodePopup(!isOpenQrCodePopup);
  },[isOpenQrCodePopup])

  const [isClassControlPopup, setIsClassControlPopup] = useState<boolean>(false);
  const controlClassControlPopup = useCallback(() => {
    setIsClassControlPopup(!isClassControlPopup);
  },[isClassControlPopup])
  const openClassControlForStudents = useCallback((value: HeaderClassType) => {
    setSelectedClass(value, controlClassControlPopup);
  },[setSelectedClass, controlClassControlPopup])
  const closeClassControlForStudents = useCallback(() => {
    setSelectedClass({id: -1, position: -1}, controlClassControlPopup);
    setExpirationOfReview(90);
    setExpirationOfRefresh(5);
  },[setExpirationOfReview, setExpirationOfRefresh, setSelectedClass, controlClassControlPopup])

  const confirmActivateKeyForClass = useCallback((expiration: number, onSuccess: () => void) => {
    activateKeyForClass(expiration, onSuccess);
  },[activateKeyForClass])

  const [isOpenDescriptionClass, setIsOpenDescriptionClass] = useState<boolean>(false);
  const controlDescriptionClass = useCallback(() => {
    setIsOpenDescriptionClass(!isOpenDescriptionClass);
  },[isOpenDescriptionClass])

  const handleReview = useCallback(() => {
    onReview(closeClassControlForStudents);
  },[onReview, closeClassControlForStudents])

  return (
    <>
      {
        isMobile ? 
        (<ClassGroupPanelMobileView
          openAddPopup={openAddPopup}
          teacherClassGroupControlState={teacherClassGroupControlState}
          goToTeacherClassGroupSubgroups={goToTeacherClassGroupSubgroups}
          setAttendance={setAttendance}
          setDescription={setDescription}
          controlDescriptionClass={controlDescriptionClass}
          setGradeNumber={setGradeNumber}
          openUpdateWindow={openUpdateWindow}
          closeUpdateWindow={closeUpdateWindow}
          openDeletePopup={openDeletePopup}
          confirmUpdate={confirmUpdate}
          handleReview={handleReview}
          reloadTable={reloadTable}
          isClassControlPopup={isClassControlPopup}
          isOpenUpdateWindow={isOpenUpdateWindow}
          controlGenerateKeyPopup={controlGenerateKeyPopup}
          isOpenDescriptionClass={isOpenDescriptionClass}
          controlQrCodePopup={controlQrCodePopup}
          closeClassControlForStudents={closeClassControlForStudents}
          openClassControlForStudents={openClassControlForStudents}
          />) :
        (<ClassGroupPanelDesktopView
          openAddPopup={openAddPopup}
          handleReview={handleReview}
          reloadTable={reloadTable}
          closeClassControlForStudents={closeClassControlForStudents}
          goToTeacherClassGroupSubgroups={goToTeacherClassGroupSubgroups}
          teacherClassGroupControlState={teacherClassGroupControlState}
          setAttendance={setAttendance}
          isOpenDescriptionClass={isOpenDescriptionClass}
          openDeletePopup={openDeletePopup}
          controlDescriptionClass={controlDescriptionClass}
          controlGenerateKeyPopup={controlGenerateKeyPopup}
          controlQrCodePopup={controlQrCodePopup}
          setDescription={setDescription}
          openUpdateWindow={openUpdateWindow}
          setGradeNumber={setGradeNumber}
          closeUpdateWindow={closeUpdateWindow}
          confirmUpdate={confirmUpdate}
          isOpenUpdateWindow={isOpenUpdateWindow}
          isClassControlPopup={isClassControlPopup}
          openClassControlForStudents={openClassControlForStudents}
          />)
      }
      <Popup isActive={isOpenAddPopup} closePopup={closeAddPopup}>
        <Column horizontalAlign='center'>
          <Text themeColor={theme.colors.gray} themeFont={theme.fonts.h2} align='center'> 
            Вы уверены, что <br/>
            хотите добавить занятие?
          </Text>
          <Spacing  themeSpace={25} variant='Column' />
          <Row>
            <Button onClick={confirmAdd} state={teacherClassGroupControlState.loadingAdd} variant='recomended' padding={[12,17]}>
              Добавить
            </Button>
            <Spacing variant='Row' themeSpace={20}/>
            <Button onClick={closeAddPopup} variant='attentive' padding={[12,17]}>
              Отмена
            </Button>
          </Row>
        </Column>
      </Popup>
      <ConfirmDeletePopup 
        cancelDelete={closeDeletePopup}
        isActive={isOpenDeletePopup} 
        state={teacherClassGroupControlState.loadingDelete}
        onDelete={confirmDeletePopup} />
      <QrCodeControlPopup 
        qrCodeData={teacherClassGroupControlState.qrCodePopup.qrCodeData}
        stateQrCode={teacherClassGroupControlState.qrCodePopup.loadingQrCode} 
        stateStart={teacherClassGroupControlState.qrCodePopup.loadingStart} 
        generateQrCode={createQrCode} clearDataQrCode={clearQrCodeData}
        setTimeValueForRefresh={setExpirationOfRefresh}
        setTimeValueForReview={setExpirationOfReview} 
        timeValueForRefresh={teacherClassGroupControlState.qrCodePopup.expirationOfRefresh} 
        timeValueForReview={teacherClassGroupControlState.qrCodePopup.expirationOfReview} 
        closePopup={controlQrCodePopup} isActive={isOpenQrCodePopup}/>
      <GenerateKeyPopup 
        stateActivate={teacherClassGroupControlState.generateKeyPopup.loadingActivate} 
        onActivateClick={confirmActivateKeyForClass}
        closePopup={controlGenerateKeyPopup} isActive={isOpenGenerateKeyPopup}/>
    </>
  );
});


type LocalViewProps = {
  teacherClassGroupControlState: СlassGroupControlState;
  goToTeacherClassGroupSubgroups: () => void;
  openAddPopup: () => void;
  openDeletePopup: () => void;
  openClassControlForStudents: (value: HeaderClassType) => void;
  setGradeNumber: (value: string) => void;
  reloadTable: () => void;
  setDescription: (value: string) => void;
  setAttendance: (value: AttendanceCodeType) => void;
  isOpenUpdateWindow: boolean;
  closeUpdateWindow: () => void;
  confirmUpdate: () => void;
  isClassControlPopup: boolean;
  openUpdateWindow: (value: GradeInfo) => void;
  closeClassControlForStudents: () => void;

  controlQrCodePopup: () => void;
  controlGenerateKeyPopup: () => void;

  controlDescriptionClass: () => void;
  isOpenDescriptionClass: boolean;

  handleReview: () => void;
};

export const ClassGroupPanelMobileView: FC<LocalViewProps> = memo(({
  teacherClassGroupControlState,
  goToTeacherClassGroupSubgroups,
  openAddPopup,
  closeClassControlForStudents,
  isOpenUpdateWindow,
  openDeletePopup,
  setAttendance,
  openClassControlForStudents,
  isClassControlPopup,
  setDescription,
  setGradeNumber,
  closeUpdateWindow,
  openUpdateWindow,
  handleReview,
  confirmUpdate,
  reloadTable,

  controlGenerateKeyPopup,
  controlQrCodePopup,

  controlDescriptionClass,
  isOpenDescriptionClass
}) => {

  return (
    <WrapperMobile onBack={goToTeacherClassGroupSubgroups} role='ROLE_TEACHER' header='Таблица'>
      {teacherClassGroupControlState.loading === 'loading' ?
      <Column style={{position: 'absolute', height: '100vh', top: 0}}>
        <CircleLoading state={teacherClassGroupControlState.loading}/>
      </Column> : <>
        <Surface>
          <Row>
            <Button onClick={controlDescriptionClass} borderRaius={10} variant='recomended' padding={[10, 10]}>
              Информация 🛈
            </Button>
            <Spacing themeSpace={10} variant='Row' />
            <Button onClick={reloadTable} borderRaius={10} state={teacherClassGroupControlState.loadingReloadTable} variant='recomended' padding={[10, 10]}>
              Обновить
            </Button>
          </Row>
          <Spacing themeSpace={25} variant='Column' />
          {teacherClassGroupControlState.studentsStatistics.length !== 0 ? 
            <StudentsTable
              onClickGrade={openUpdateWindow} openClassControlForStudents={openClassControlForStudents}
              classesIds={teacherClassGroupControlState.classesIds}
              data={teacherClassGroupControlState.studentsStatistics}/> :
            <Text themeFont={theme.fonts.h2} themeColor={theme.colors.attentive}>
              Студенты не найдены
            </Text>}
          <Spacing themeSpace={25} variant='Column' />
          {teacherClassGroupControlState.studentsStatistics.length !== 0 && 
            <Row>
              <Button onClick={openAddPopup} borderRaius={10} height={45} variant='primary' padding={[12, 10]}>
                Добавить занятие
              </Button>
              <Spacing themeSpace={20} variant='Row' />
              <Button onClick={openDeletePopup} borderRaius={10} height={45} variant='attentive' padding={[12, 10]}>
                Удалить занятие
              </Button>
            </Row>}
        </Surface>
      </>}
      <Modal isActive={isOpenUpdateWindow} closeModal={closeUpdateWindow}>
        <ControlStudentGrade
          selectedGrade={teacherClassGroupControlState.selectedGrade}
          setAttendance={setAttendance}
          isMobile={true}
          errorNote={teacherClassGroupControlState.errors['gradeNumberError']}
          errorDescription={teacherClassGroupControlState.errors['descriptionError']}
          setGradeNumber={setGradeNumber}
          setDescription={setDescription}
          confirmUpdate={confirmUpdate}
          loadingUpdate={teacherClassGroupControlState.loadingUpdate}
          closeUpdateWindow={closeUpdateWindow}
          />
      </Modal>
      <Modal isActive={isClassControlPopup} closeModal={closeClassControlForStudents}>
        <Text themeFont={theme.fonts.h1}>
		  		Занятие {teacherClassGroupControlState.selectedClass.position}
		  	</Text>
        <Spacing themeSpace={15} variant='Column' />
        <Button 
          onClick={controlGenerateKeyPopup} 
          width={200}
          borderRaius={10}
          variant="primary" padding={[12,17]}>
          Генерация ключа
        </Button>
        <Spacing themeSpace={15} variant='Column' />
        <Button 
          onClick={controlQrCodePopup} 
          width={200}
          borderRaius={10}
          variant="primary" padding={[12,17]}>
          Генерация QR-code
        </Button>
        <Spacing themeSpace={15} variant='Column' />
        <Button 
          onClick={handleReview} 
          width={200}
          state={teacherClassGroupControlState.loadingReview}
          borderRaius={10}
          variant="primary" padding={[12,17]}>
          Пересмотр
        </Button>
      </Modal>
      <Modal isActive={isOpenDescriptionClass} closeModal={controlDescriptionClass} >
        <Text themeFont={theme.fonts.h2} style={{lineHeight: 1.7}}>
          Предмет: <span style={{fontFamily: theme.fonts.ht2.family}}>
            {teacherClassGroupControlState.initData?.classGroup.subjectName}</span><br/>
          Описание: <span style={{fontFamily: theme.fonts.ht2.family}}>
            {teacherClassGroupControlState.initData?.classGroup.classGroup.description}</span><br/>
          Формат занятия: <span style={{fontFamily: theme.fonts.ht2.family}}>
            {teacherClassGroupControlState.initData?.classGroup.nameClassFormat}</span><br/>
          Подгруппы: <span style={{fontFamily: theme.fonts.ht2.family}}> <br/>
          {teacherClassGroupControlState.initData?.subgroup.subgroupNumber
            ?.split('#')
            .map((subgroup, index) => (
              <React.Fragment key={index}>
                {subgroup}
                <br />
              </React.Fragment>
            ))}</span>
        </Text>
      </Modal>
    </WrapperMobile>
  );
});


export const ClassGroupPanelDesktopView: FC<LocalViewProps> = memo(({
  teacherClassGroupControlState,
  goToTeacherClassGroupSubgroups,
  closeClassControlForStudents,
  openAddPopup,
  isOpenUpdateWindow,
  setAttendance,
  openDeletePopup,
  setDescription,
  setGradeNumber,
  closeUpdateWindow,
  openUpdateWindow,
  openClassControlForStudents,
  isClassControlPopup,
  confirmUpdate,
  reloadTable,
  handleReview,

  controlGenerateKeyPopup,
  controlQrCodePopup,

  isOpenDescriptionClass,
  controlDescriptionClass
}) => {

  return (
    <WrapperDesktop style={{padding: 'none'}} onBack={goToTeacherClassGroupSubgroups} role='ROLE_TEACHER' header='Таблица' isCenter={true}>
      {teacherClassGroupControlState.loading === 'loading' ?
      <Column style={{position: 'absolute', height: '100vh', top: 0}}>
        <CircleLoading state={teacherClassGroupControlState.loading}/>
      </Column> : <>
        <Surface style={{width: 900}}>
          <Row>
            <Button onClick={controlDescriptionClass} borderRaius={10} variant='recomended' padding={[10, 10]}>
              Информация 🛈
            </Button>
            <Spacing themeSpace={10} variant='Row' />
            <Button onClick={reloadTable} state={teacherClassGroupControlState.loadingReloadTable}  borderRaius={10} variant='recomended' padding={[10, 10]}>
              Обновить
            </Button>
          </Row>
          <Spacing themeSpace={20} variant='Column' />
          {teacherClassGroupControlState.studentsStatistics.length !== 0 ? 
            <StudentsTable
              onClickGrade={openUpdateWindow} openClassControlForStudents={openClassControlForStudents}
              classesIds={teacherClassGroupControlState.classesIds}
              data={teacherClassGroupControlState.studentsStatistics}/> :
            <Text themeFont={theme.fonts.h2} themeColor={theme.colors.attentive}>
              Студенты не найдены
            </Text>}
          <Spacing themeSpace={20} variant='Column' />
          {teacherClassGroupControlState.studentsStatistics.length !== 0 && 
            <Row>
              <Button borderRaius={10} onClick={openAddPopup} variant='primary' padding={[12, 17]}>
                Добавить занятие
              </Button>
              <Spacing themeSpace={15} variant='Row' />
              {teacherClassGroupControlState.classesIds.length !== 0 && 
                <Button borderRaius={10} onClick={openDeletePopup} variant='attentive' padding={[12, 17]}>
                  Удалить занятие
                </Button>}
            </Row>}
        </Surface>
      </>}
      <Popup isActive={isOpenUpdateWindow} closePopup={closeUpdateWindow}>
        <ControlStudentGrade
          selectedGrade={teacherClassGroupControlState.selectedGrade}
          setAttendance={setAttendance}
          isMobile={false}
          errorNote={teacherClassGroupControlState.errors['gradeNumberError']}
          errorDescription={teacherClassGroupControlState.errors['descriptionError']}
          setGradeNumber={setGradeNumber}
          setDescription={setDescription}
          confirmUpdate={confirmUpdate}
          loadingUpdate={teacherClassGroupControlState.loadingUpdate}
          closeUpdateWindow={closeUpdateWindow}
          />
      </Popup>
      <Popup padding='25px' isActive={isClassControlPopup} closePopup={closeClassControlForStudents}>
        <Column horizontalAlign='center'>
          <Text themeFont={theme.fonts.h1}>
		  	  	Занятие {teacherClassGroupControlState.selectedClass.position}
		  	  </Text>
          <Spacing themeSpace={25} variant='Column' />
          <Button 
            onClick={controlGenerateKeyPopup} 
            width={240}
            borderRaius={10}
            variant="primary" padding={[12,17]}>
            Генерация ключа
          </Button>
          <Spacing themeSpace={15} variant='Column' />
          <Button 
            onClick={controlQrCodePopup} 
            width={240}
            borderRaius={10}
            variant="primary" padding={[12,17]}>
            Генерация QR-code
          </Button>
          <Spacing themeSpace={15} variant='Column' />
          <Button 
            onClick={handleReview} 
            width={240}
            borderRaius={10}
            variant="primary" padding={[12,17]}>
            Пересмотр
          </Button>
        </Column>
      </Popup>
      <Popup style={{width: 440}} isActive={isOpenDescriptionClass} closePopup={controlDescriptionClass} >
        <Text themeFont={theme.fonts.h2} style={{lineHeight: 1.7}}>
          Предмет: <span style={{fontFamily: theme.fonts.ht2.family}}>
            {teacherClassGroupControlState.initData?.classGroup.subjectName}</span><br/>
          Описание: <span style={{fontFamily: theme.fonts.ht2.family}}>
            {teacherClassGroupControlState.initData?.classGroup.classGroup.description}</span><br/>
          Формат занятия: <span style={{fontFamily: theme.fonts.ht2.family}}>
            {teacherClassGroupControlState.initData?.classGroup.nameClassFormat}</span><br/>
            Подгруппы: <span style={{fontFamily: theme.fonts.ht2.family}}> <br/>
          {teacherClassGroupControlState.initData?.subgroup.subgroupNumber
            ?.split('#') 
            .map((subgroup, index) => (
              <React.Fragment key={index}>
                {subgroup}
                <br />
              </React.Fragment>
            ))}</span>
        </Text>
      </Popup>
    </WrapperDesktop>
  );
});

export type QrCodeControlPopupProps = {
  isActive: boolean;
  closePopup: () => void;
  setTimeValueForRefresh: (value: number) => void;
  setTimeValueForReview: (value: number) => void;
  timeValueForRefresh: number;
  timeValueForReview: number;
  generateQrCode: () => void;
  clearDataQrCode: () => void;
  stateStart: "idle" | "loading" | "success" | "error";
  stateQrCode: "idle" | "loading" | "success" | "error";
  qrCodeData: QrCodeDataType | null;
};
    
export const QrCodeControlPopup: FC<QrCodeControlPopupProps> = memo(({
  isActive,
  closePopup,
  timeValueForRefresh,
  timeValueForReview,
  setTimeValueForRefresh,
  setTimeValueForReview,
  stateQrCode,
  generateQrCode,
  stateStart,
  qrCodeData,
  clearDataQrCode
}) => {
  
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const [isStarted, setIsStarted] = useState<boolean>(false);

  const handleStart = useCallback(() => {
    generateQrCode();
    setIsStarted(true);

    if (intervalRef.current) return;

    intervalRef.current = setInterval(() => {
      generateQrCode();
    }, timeValueForRefresh * 1000);
  },[generateQrCode, timeValueForRefresh]);

  const handleStop = useCallback(() => {
    clearDataQrCode();
    setIsStarted(false);
    
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  },[clearDataQrCode]);

  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  const onClose = useCallback(() => {
    closePopup();
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    setIsStarted(false);
  },[closePopup]) 

  return (
    <Popup isActive={isActive} closePopup={() => {}}>
      <Column horizontalAlign='center'>
        <Text themeFont={theme.fonts.h2}>
          Время обновления: <span style={{width: 70, display: 'inline-block'}}><b> {timeValueForRefresh} cек.</b> </span>
        </Text>
        <Spacing variant='Column' themeSpace={15}/>
        <RangeSlider
          minValue={1}
          disabled={isStarted}
          maxValue={10}
          value={timeValueForRefresh} 
          step={0.5}
          setValue={setTimeValueForRefresh}/>
        <Spacing variant='Column' themeSpace={25}/>
        <Text themeFont={theme.fonts.h2}>
          Время для пересмотра: <span style={{width: 70, display: 'inline-block'}}><b> {timeValueForReview} cек.</b> </span>
        </Text>
        <Spacing variant='Column' themeSpace={15}/>
        <RangeSlider
          minValue={10}
          maxValue={180}
          disabled={isStarted}
          value={timeValueForReview} 
          step={10}
          setValue={setTimeValueForReview}/>
        <Spacing variant='Column' themeSpace={25}/>
        <Row>
          {isStarted ? 
            <Button 
              onClick={handleStop} 
              width={100}
              borderRaius={15}
              variant='attentive' padding={[12,17]}>
              Стоп
            </Button> : 
            <Button 
              onClick={handleStart} 
              width={100}
              borderRaius={15} state={stateStart}
              variant="primary" padding={[12,17]}>
              Старт
            </Button>}
        </Row>
      </Column>
      <Spacing variant='Column' themeSpace={30}/>
      <Surface padding='10px' borderRadius='10px' borderColor={theme.colors.foreground} height={300} width={300}>
        <Column style={{height: '100%', position: 'relative'}} horizontalAlign='center' verticalAlign='center'>
          {!isStarted ? <Image src={ShieldLogo} width={250} height={250}/> : <>
            {
              (stateQrCode === 'idle' || stateQrCode === 'loading') ? 
                (<CircleLoading state={'loading'}/>) :
                (<>
                  <QRCode
                    value={JSON.stringify(qrCodeData)}
                    />
                </>)
            }
            </>}
        </Column>
      </Surface>
      <Spacing variant='Column' themeSpace={25}/>
      <Column horizontalAlign='center'>
        <Button 
          onClick={onClose} 
          width={120}
          borderRaius={15}
          variant='attentive' padding={[12,17]}>
          Закрыть 
        </Button>
      </Column>
    </Popup>
  );
});

export type GenerateKeyPopupProps = {
  isActive: boolean;
  closePopup: () => void;
  onActivateClick: (expiration: number, onSuccess: () => void) => void;
  stateActivate: "idle" | "loading" | "success" | "error";
};
    
export const GenerateKeyPopup: FC<GenerateKeyPopupProps> = memo(({
  isActive,
  closePopup,
  stateActivate,
  onActivateClick,
}) => {
  const [expiration, setExpiration] = useState<number>(90);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const closeTimer = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  },[]);

  useEffect(() => {
    if (expiration <= 0 && timerRef.current) {
      closeTimer();
    }
  }, [expiration, closeTimer]);

  const startTimer = useCallback(() => {
    if (timerRef.current) return;

    timerRef.current = setInterval(() => {
      setExpiration(prev => {
        if (prev <= 1) {
          closeTimer();
          setExpiration(90);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  }, [closeTimer]);

  const handleClose = useCallback(() => {
    closeTimer();
    closePopup();
  }, [closePopup,closeTimer]);

  const handleActivate = useCallback(() => {
    onActivateClick(expiration, startTimer);
  },[onActivateClick, startTimer, expiration]);

  const handleInput = useCallback((value: number) => {
    closeTimer();
    setExpiration(value);
  },[closeTimer]);
  
  return (
    <Popup isActive={isActive} closePopup={handleClose}>
      <Text themeFont={theme.fonts.h2}>
        Срок действия: <span style={{width: 110, display: 'inline-block'}}><b> {expiration} cекунд</b> </span>
      </Text>
      <Spacing variant='Column' themeSpace={15}/>
      <RangeSlider value={expiration} setValue={handleInput}/>
      <Spacing variant='Column' themeSpace={30}/>
      <Column horizontalAlign='center'>
        <Button 
          onClick={handleActivate} 
          width={140}
          borderRaius={15} state={stateActivate}
          variant="primary" padding={[12,17]}>
          Активировать
        </Button>
      </Column>
    </Popup>
  );
});

export type ControlStudentGradeProps = {
  closeUpdateWindow: () => void;
  setAttendance: (value: AttendanceCodeType) => void;
  setGradeNumber: (value: string) => void;
  setDescription: (value: string) => void;
  confirmUpdate: () => void;
  errorNote?: string | null;
  isMobile: boolean;
  errorDescription?: string | null;
  selectedGrade: GradeInfo;
  loadingUpdate: "idle" | "loading" | "success" | "error";
};
    
export const ControlStudentGrade: FC<ControlStudentGradeProps> = memo(({
  closeUpdateWindow,
  setAttendance,
  setDescription,
  setGradeNumber,
  confirmUpdate,
  isMobile,
  errorNote,
  selectedGrade,
  loadingUpdate,
  errorDescription
}) => {
  
  return (
    <Column style={isMobile ? {} : {width: 440}} horizontalAlign='center'>
      <Column style={{maxWidth: 440}} horizontalAlign='center'>
        <Text themeColor={theme.colors.gray} themeFont={theme.fonts.h3}>
          Статус
        </Text>
        <Spacing variant='Column' themeSpace={25}/>
        <Row style={{gap: 10, width: '100%'}} horizontalAlign='space-between'>
          {attendanceOptions.map((option) => (
            <Column style={{width: 'auto'}} horizontalAlign='center'>
              <ColorCircleButton
                key={option.id}
                color={option.color}
                onClick={() => setAttendance(option.id)}
                isSelected={selectedGrade.attendance === option.id}
              />
              <Spacing variant='Column' themeSpace={10}/>
              <Text style={{fontSize: 12}} align='center' themeColor={theme.colors.gray} themeFont={theme.fonts.ht2}>
                {option.name}
              </Text>
            </Column>
          ))}
        </Row>
      </Column>
      <Spacing themeSpace={25} variant='Column' />
      <Input 
        header='Оценка' 
        placeholder='9' error={errorNote}
        value={selectedGrade.grade?.toString() || ''} setValue={setGradeNumber}/>
      <Spacing themeSpace={25} variant='Column' />
      <Textarea
        value={selectedGrade.description || ''}
        placeholder='Примечание...' 
        height={120} setValue={setDescription}
        error={errorDescription}
        header='Примечание' />
      <Spacing themeSpace={25} variant='Column' />
      <Row>
        <Button 
          onClick={confirmUpdate}
          state={loadingUpdate} 
          variant='recomended' padding={[12,17]}>
          Сохранить
        </Button>
        <Spacing variant='Row' themeSpace={20}/>
        <Button onClick={closeUpdateWindow} variant='attentive' padding={[12,17]}>
          Отмена
        </Button>
      </Row>
    </Column>
  );
});


export type StudentsTableProps = {
	data: StatisticOfStudent[];
	classesIds: number[];
	onClickGrade: (value: GradeInfo) => void;
  openClassControlForStudents: (value: HeaderClassType) => void;
};
  
export const StudentsTable: FC<StudentsTableProps> = memo(({
	data,
	classesIds,
	onClickGrade,
  openClassControlForStudents
}) => {
  const [isVerticalScrollNeeded, setIsVerticalScrollNeeded] = useState(true);
  const [isHorizontalScrollNeeded, setIsHorizontalScrollNeeded] = useState(true);

  const verticalScrollRef = useRef<HTMLDivElement | null>(null);
  const horizontalScrollRef1 = useRef<HTMLDivElement | null>(null);
  const horizontalScrollRef2 = useRef<HTMLDivElement | null>(null);

  const verticalTrackRef = useRef<HTMLDivElement | null>(null);
  const verticalSliderRef = useRef<HTMLDivElement | null>(null);

  const horizontalTrackRef = useRef<HTMLDivElement | null>(null);
  const horizontalSliderRef = useRef<HTMLDivElement | null>(null);

  const isVerticalDraggingRef = useRef(false);
  const isHorizontalDraggingRef = useRef(false);

  const startVerticalYRef = useRef(0);
  const startVerticalSliderTopRef = useRef(0);

  const startHorizontalXRef = useRef(0);
  const startHorizontalSliderLeftRef = useRef(0);

  const [isSyncingScroll, setIsSyncingScroll] = useState(false);

  const updateVerticalSliderSize = useCallback(() => {
    const container = verticalScrollRef.current;
    const slider = verticalSliderRef.current;
    const track = verticalTrackRef.current;

    if (!container || !slider || !track) return;

    const visibleRatio = container.clientHeight / container.scrollHeight;
    if(visibleRatio === 1) setIsVerticalScrollNeeded(false);
    const sliderHeight = Math.max(visibleRatio * track.clientHeight, 30);

    slider.style.height = `${sliderHeight}px`;
  }, []);

  const updateVerticalSliderPosition = useCallback(() => {
    const container = verticalScrollRef.current;
    const slider = verticalSliderRef.current;
    const track = verticalTrackRef.current;

    if (!container || !slider || !track) return;

    const scrollableHeight = container.scrollHeight - container.clientHeight;
    const trackHeight = track.clientHeight - slider.offsetHeight;

    const scrollTop = container.scrollTop;
    const sliderTop = (scrollTop / scrollableHeight) * trackHeight;

    slider.style.top = `${sliderTop}px`;
  }, []);

  const handleVerticalMove = useCallback((e: MouseEvent | TouchEvent) => {
    if (!isVerticalDraggingRef.current) return;

    const clientY = "touches" in e ? e.touches[0].clientY : e.clientY;
    const deltaY = clientY - startVerticalYRef.current;

    const container = verticalScrollRef.current;
    const slider = verticalSliderRef.current;
    const track = verticalTrackRef.current;

    if (!container || !slider || !track) return;

    const trackHeight = track.clientHeight - slider.offsetHeight;
    const scrollableHeight = container.scrollHeight - container.clientHeight;

    let newSliderTop = startVerticalSliderTopRef.current + deltaY;
    newSliderTop = Math.max(0, Math.min(newSliderTop, trackHeight));

    slider.style.top = `${newSliderTop}px`;

    const newScrollTop = (newSliderTop / trackHeight) * scrollableHeight;
    container.scrollTop = newScrollTop;


  }, []);

  const handleVerticalEnd = useCallback(() => {
    isVerticalDraggingRef.current = false;

    document.removeEventListener("mousemove", handleVerticalMove);
    document.removeEventListener("mouseup", handleVerticalEnd);
    document.removeEventListener("touchmove", handleVerticalMove);
    document.removeEventListener("touchend", handleVerticalEnd);
  }, [handleVerticalMove]);

  const handleVerticalStart = useCallback((e: React.MouseEvent | React.TouchEvent<HTMLDivElement>) => {

    updateVerticalSliderSize();
    updateVerticalSliderPosition();

    isVerticalDraggingRef.current = true;

    const clientY = "touches" in e ? e.touches[0].clientY : e.clientY;
    startVerticalYRef.current = clientY;

    const slider = verticalSliderRef.current;
    if (slider) {
      startVerticalSliderTopRef.current = parseInt(slider.style.top || "0", 10);
    }

    document.addEventListener("mousemove", handleVerticalMove);
    document.addEventListener("mouseup", handleVerticalEnd);
    document.addEventListener("touchmove", handleVerticalMove);
    document.addEventListener("touchend", handleVerticalEnd);
  }, [updateVerticalSliderSize, updateVerticalSliderPosition, handleVerticalMove, handleVerticalEnd]);

  const updateHorizontalSliderPosition = useCallback(() => {
    const container = horizontalScrollRef1.current;
    const slider = horizontalSliderRef.current;
    const track = horizontalTrackRef.current;

    if (!container || !slider || !track) return;

    const scrollableWidth = container.scrollWidth - container.clientWidth;
    const trackWidth = track.clientWidth - slider.offsetWidth;

    const scrollLeft = container.scrollLeft;
    const sliderLeft = (scrollLeft / scrollableWidth) * trackWidth;

    slider.style.left = `${sliderLeft}px`;
  }, []);

  const handleHorizontalScroll1 = useCallback(() => {
    const container1 = horizontalScrollRef1.current;
    const container2 = horizontalScrollRef2.current;

    if (!container1 || !container2 || isSyncingScroll) return;

    const scrollLeft = container1.scrollLeft;
    setIsSyncingScroll(true);
    container2.scrollLeft = scrollLeft;
    setIsSyncingScroll(false);

    updateHorizontalSliderPosition();
  }, [isSyncingScroll, updateHorizontalSliderPosition]);

  const handleHorizontalScroll2 = useCallback(() => {
    const container1 = horizontalScrollRef1.current;
    const container2 = horizontalScrollRef2.current;

    if (!container1 || !container2 || isSyncingScroll) return;

    const scrollLeft = container2.scrollLeft;
    setIsSyncingScroll(true);
    container1.scrollLeft = scrollLeft;
    setIsSyncingScroll(false);

    updateHorizontalSliderPosition();
  }, [isSyncingScroll, updateHorizontalSliderPosition]);

  const updateHorizontalSliderSize = useCallback(() => {
    const container = horizontalScrollRef1.current;
    const slider = horizontalSliderRef.current;
    const track = horizontalTrackRef.current;

    if (!container || !slider || !track) return;

    const visibleRatio = container.clientWidth / container.scrollWidth;
    if(visibleRatio === 1) setIsHorizontalScrollNeeded(false);
    const sliderWidth = Math.max(visibleRatio * track.clientWidth, 30);

    slider.style.width = `${sliderWidth}px`;
  }, []);

  const syncHorizontalScroll = useCallback(() => {
    const container1 = horizontalScrollRef1.current;
    const container2 = horizontalScrollRef2.current;

    if (!container1 || !container2 || isSyncingScroll) return;

    const scrollLeft = container1.scrollLeft;
    setIsSyncingScroll(true);
    container2.scrollLeft = scrollLeft;
    setIsSyncingScroll(false);

    updateHorizontalSliderPosition();
  }, [isSyncingScroll, updateHorizontalSliderPosition]);

  const handleHorizontalMove = useCallback((e: MouseEvent | TouchEvent) => {

    if (!isHorizontalDraggingRef.current) return;

    const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;
    const deltaX = clientX - startHorizontalXRef.current;

    const container = horizontalScrollRef1.current;
    const slider = horizontalSliderRef.current;
    const track = horizontalTrackRef.current;

    if (!container || !slider || !track) return;

    const trackWidth = track.clientWidth - slider.offsetWidth;
    const scrollableWidth = container.scrollWidth - container.clientWidth;

    let newSliderLeft = startHorizontalSliderLeftRef.current + deltaX;
    newSliderLeft = Math.max(0, Math.min(newSliderLeft, trackWidth));

    slider.style.left = `${newSliderLeft}px`;

    const newScrollLeft = (newSliderLeft / trackWidth) * scrollableWidth;
    container.scrollLeft = newScrollLeft;

    setIsSyncingScroll(true);
    syncHorizontalScroll();
    setIsSyncingScroll(false);
  }, [syncHorizontalScroll]);

  const handleHorizontalEnd = useCallback(() => {
    isHorizontalDraggingRef.current = false;

    document.removeEventListener("mousemove", handleHorizontalMove);
    document.removeEventListener("mouseup", handleHorizontalEnd);
    document.removeEventListener("touchmove", handleHorizontalMove);
    document.removeEventListener("touchend", handleHorizontalEnd);
  }, [handleHorizontalMove]);

  const handleHorizontalStart = useCallback((e: React.MouseEvent | React.TouchEvent<HTMLDivElement>) => {

    updateHorizontalSliderSize();
    updateHorizontalSliderPosition();

    isHorizontalDraggingRef.current = true;

    const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;
    startHorizontalXRef.current = clientX;

    const slider = horizontalSliderRef.current;
    if (slider) {
      startHorizontalSliderLeftRef.current = parseInt(slider.style.left || "0", 10);
    }

    document.addEventListener("mousemove", handleHorizontalMove);
    document.addEventListener("mouseup", handleHorizontalEnd);
    document.addEventListener("touchmove", handleHorizontalMove);
    document.addEventListener("touchend", handleHorizontalEnd);
  }, [updateHorizontalSliderSize, updateHorizontalSliderPosition, handleHorizontalMove, handleHorizontalEnd]);

  useEffect(() => {
    updateVerticalSliderSize();
    updateVerticalSliderPosition();

    const container = verticalScrollRef.current;
    if (container) {
      container.addEventListener("scroll", updateVerticalSliderPosition);
    }

    window.addEventListener("resize", updateVerticalSliderSize);

    return () => {
      if (container) {
        container.removeEventListener("scroll", updateVerticalSliderPosition);
      }
      window.removeEventListener("resize", updateVerticalSliderSize);
    };
  }, [updateVerticalSliderSize, updateVerticalSliderPosition]);

  useEffect(() => {
    updateHorizontalSliderSize();
    updateHorizontalSliderPosition();

    const container1 = horizontalScrollRef1.current;
    const container2 = horizontalScrollRef2.current;

    if (container1) {
      container1.addEventListener("scroll", handleHorizontalScroll1);
    }

    if (container2) {
      container2.addEventListener("scroll", handleHorizontalScroll2);
    }

    window.addEventListener("resize", updateHorizontalSliderSize);

    return () => {
      if (container1) {
        container1.removeEventListener("scroll", handleHorizontalScroll1);
      }
      if (container2) {
        container2.removeEventListener("scroll", handleHorizontalScroll2);
      }
      window.removeEventListener("resize", updateHorizontalSliderSize);
    };
  }, [handleHorizontalScroll1, handleHorizontalScroll2, updateHorizontalSliderSize,updateHorizontalSliderPosition ]);

	return (
	  <TableWrapper>
		  <TableHeader>
		    <NameHeader isHide={isVerticalScrollNeeded}>
		  	<Text themeFont={theme.fonts.h3}>
		  	  Имя студента
		  	</Text>
		    </NameHeader>
		    {classesIds.length !== 0 && <HeaderClasses ref={horizontalScrollRef1}>
		  	{classesIds.map((item, index) => (
		  	  <HeaderClassItem onClick={() => openClassControlForStudents({id: item, position: index + 1})}>
		  		<Text themeFont={theme.fonts.h3}>
		  		  Занятие {index + 1}
		  		</Text>
		  	  </HeaderClassItem>
		  	))}
		    </HeaderClasses>}
		  </TableHeader>
		  <Spacing themeSpace={10} variant='Column' />
      <Row style={{ alignItems: "stretch" }}>
        {isVerticalScrollNeeded && <VerticalTrack ref={verticalTrackRef}>
          <VerticalSlider
            ref={verticalSliderRef}
            onMouseDown={handleVerticalStart}
            onTouchStart={handleVerticalStart}
          />
        </VerticalTrack>}
        {isVerticalScrollNeeded && <Spacing variant="Row" themeSpace={10} />}
		    <ScrollWrapper ref={verticalScrollRef}>
		      <Table>
		    	<StudentsContainer>
		    	  {data.map((item, index) => <StudentItem key={index}>
		    		<Text themeFont={theme.fonts.ht2}>
		    		  {item.student.lastname}
		    		</Text>
		    		<Text themeFont={theme.fonts.ht2}>
		    		  {item.student.name}
		    		</Text>
		    		<Text themeFont={theme.fonts.ht2}>
		    		  {item.student.surname}
		    		</Text>
		    	  </StudentItem>)}
		    	</StudentsContainer>
		    	<ClassesContainer ref={horizontalScrollRef2}>
		    	  {data.map((item, index)=> <ClassesRow key={index}>
		    		{item.grades.map((item, index) => 
            <ClassItem key={index}
		    		  onClick={() => onClickGrade(item)} >
		    		  {item.description !== null && <ExistMark/>}
		    		  {item.grade !== null && <Text themeFont={theme.fonts.ht2}>
		    			{item.grade}
		    		  </Text>}
		    		  <ColorCircle
                  color={attendanceColorsForStudents[item.attendance]}
                />
		    		</ClassItem>)}
		    	  </ClassesRow>)}
		    	</ClassesContainer>
		      </Table>
		    </ScrollWrapper>
      </Row>
      {isHorizontalScrollNeeded && 
      <Column horizontalAlign="flex-end">
        <Spacing variant="Column" themeSpace={10} />
        <HorizontalTrack ref={horizontalTrackRef}>
          <HorizontalSlider
            ref={horizontalSliderRef}
            onMouseDown={handleHorizontalStart}
            onTouchStart={handleHorizontalStart}
          />
        </HorizontalTrack>
      </Column>}
	  </TableWrapper>
	);
});