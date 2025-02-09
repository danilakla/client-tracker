
import { FC, memo, useCallback, useEffect, useRef, useState } from 'react';
import { useMediaQuery } from 'react-responsive';
import { theme } from '../../../../../ui-kit/themes/theme';
import { WrapperMobile } from '../../../../../components/wrapper-mobile';
import { WrapperDesktop } from '../../../../../components/wrapper-desktop';
import { Surface } from '../../../../../ui-kit/surface';
import { ClassesContainer, ClassesRow, ClassItem, ColorCircle, ColorCircleButton, EmptyClassItem, ExistMark, HeaderClasses, HeaderClassItem, HorizontalSlider, HorizontalTrack, NameHeader, ScrollWrapper, StudentItem, StudentsContainer, Table, TableHeader, TableWrapper, VerticalSlider, VerticalTrack } from './class-group-panel.styled';
import { Text } from '../../../../../ui-kit/text';
import { Spacing } from '../../../../../ui-kit/spacing';
import { AttendanceCodeType, attendanceColorsForStudents, attendanceOptions, AttestationGradeInfo, checkIsAttestationGrade, ClassHeaderType, GradeInfo, QrCodeDataType, StatisticOfStudent, СlassGroupControlState } from '../../../../../store/reducers/roles/teacher/class-group-control-slice';
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
import { Checkbox } from '../../../../../ui-kit/checkbox';
import { useTableScroll } from '../../../../../hooks/table-scroll-hook';
import { ActionButtonSwitch } from '../../../../../ui-kit/action-button-switch';

export type ClassGroupPanelViewProps = {
  teacherClassGroupControlState: СlassGroupControlState;
  goToTeacherClassGroupSubgroups: () => void;
  setSelectedGrade: (gradeInfo: GradeInfo, onSuccess: () => void) => void;
  switchIsPassed: () => void;
  updateGrade: (onSuccess: () => void) => void;
  toggleComplited: () => void;
  deleteClass: (onSuccess: () => void) => void;
  createClass: (onSuccess: () => void) => void;
  setGradeNumber: (value: string) => void;
  reloadTable: () => void;
  setDescription: (value: string) => void;
  setAttendance: (value: AttendanceCodeType) => void;

  setSelectedClass: (value: ClassHeaderType, onSuccess: () => void) => void;
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
  switchIsPassed,
  reloadTable,
  onReview,
  toggleComplited,

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
  const openClassControlForStudents = useCallback((value: ClassHeaderType) => {
    setSelectedClass(value, controlClassControlPopup);
  },[setSelectedClass, controlClassControlPopup])
  const closeClassControlForStudents = useCallback(() => {
    setSelectedClass({
      idClass: -1,
      idClassHold: -1,
      dateCreation: 'undefined',
      isAttestation: false,
      position: -1
    }, controlClassControlPopup);
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
          switchIsPassed={switchIsPassed}
          isOpenDescriptionClass={isOpenDescriptionClass}
          controlQrCodePopup={controlQrCodePopup}
          toggleComplited={toggleComplited}
          closeClassControlForStudents={closeClassControlForStudents}
          openClassControlForStudents={openClassControlForStudents}
          />) :
        (<ClassGroupPanelDesktopView
          openAddPopup={openAddPopup}
          handleReview={handleReview}
          switchIsPassed={switchIsPassed}
          reloadTable={reloadTable}
          toggleComplited={toggleComplited}
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
  toggleComplited: () => void;
  openDeletePopup: () => void;
  openClassControlForStudents: (value: ClassHeaderType) => void;
  setGradeNumber: (value: string) => void;
  switchIsPassed: () => void;
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
  toggleComplited,
  isClassControlPopup,
  setDescription,
  setGradeNumber,
  closeUpdateWindow,
  openUpdateWindow,
  handleReview,
  switchIsPassed,
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
            <Button onClick={controlDescriptionClass}  variant='recomended' padding={[10, 10]}>
              Информация 🛈
            </Button>
            <Spacing themeSpace={15} variant='Row' />
            <Button onClick={reloadTable} state={teacherClassGroupControlState.loadingReloadTable} variant='recomended' padding={[10, 10]}>
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
              <Button onClick={openAddPopup} height={45} variant='primary' padding={[12, 10]}>
                Добавить занятие
              </Button>
              <Spacing themeSpace={20} variant='Row' />
              <Button onClick={openDeletePopup} height={45} variant='attentive' padding={[12, 10]}>
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
          switchIsPassed={switchIsPassed}
          errorNote={teacherClassGroupControlState.errors['gradeNumberError']}
          errorDescription={teacherClassGroupControlState.errors['descriptionError']}
          setGradeNumber={setGradeNumber}
          setDescription={setDescription}
          confirmUpdate={confirmUpdate}
          toggleComplited={toggleComplited}
          isCompleted={teacherClassGroupControlState.isCompleted}
          isShowCompleted={teacherClassGroupControlState.isShowCompleted}
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
          variant="primary" padding={[12,17]}>
          Генерация ключа
        </Button>
        <Spacing themeSpace={15} variant='Column' />
        <Button 
          onClick={controlQrCodePopup} 
          width={200}
          variant="primary" padding={[12,17]}>
          Генерация QR-code
        </Button>
        <Spacing themeSpace={15} variant='Column' />
        <Button 
          onClick={handleReview} 
          width={200}
          state={teacherClassGroupControlState.loadingReview}
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
  switchIsPassed,
  openClassControlForStudents,
  isClassControlPopup,
  toggleComplited,
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
            <Button onClick={controlDescriptionClass} variant='recomended' padding={[10, 10]}>
              Информация 🛈
            </Button>
            <Spacing themeSpace={15} variant='Row' />
            <Button onClick={reloadTable} state={teacherClassGroupControlState.loadingReloadTable}   variant='recomended' padding={[10, 10]}>
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
              <Button onClick={openAddPopup} variant='primary' padding={[12, 17]}>
                Добавить занятие
              </Button>
              <Spacing themeSpace={15} variant='Row' />
              {teacherClassGroupControlState.classesIds.length !== 0 && 
                <Button onClick={openDeletePopup} variant='attentive' padding={[12, 17]}>
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
          switchIsPassed={switchIsPassed}
          toggleComplited={toggleComplited}
          isCompleted={teacherClassGroupControlState.isCompleted}
          isShowCompleted={teacherClassGroupControlState.isShowCompleted}
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
            variant="primary" padding={[12,17]}>
            Генерация ключа
          </Button>
          <Spacing themeSpace={15} variant='Column' />
          <Button 
            onClick={controlQrCodePopup} 
            width={240}
            variant="primary" padding={[12,17]}>
            Генерация QR-code
          </Button>
          <Spacing themeSpace={15} variant='Column' />
          <Button 
            onClick={handleReview} 
            width={240}
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
              variant='attentive' padding={[12,17]}>
              Стоп
            </Button> : 
            <Button 
              onClick={handleStart} 
              width={100}
              state={stateStart}
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
          state={stateActivate}
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
  switchIsPassed: () => void;
  confirmUpdate: () => void;
  errorNote?: string | null;
  isMobile: boolean;
  errorDescription?: string | null;
  selectedGrade: GradeInfo;
  isShowCompleted: boolean;
  isCompleted: boolean;
  toggleComplited: () => void;
  loadingUpdate: "idle" | "loading" | "success" | "error";
};
    
export const ControlStudentGrade: FC<ControlStudentGradeProps> = memo(({
  closeUpdateWindow,
  setAttendance,
  setDescription,
  setGradeNumber,
  confirmUpdate,
  switchIsPassed,
  isMobile,
  errorNote,
  selectedGrade,
  loadingUpdate,
  isShowCompleted,
  isCompleted,
  toggleComplited,
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
      <Row verticalAlign='flex-end' style={{width: '100%', maxWidth: 440}}>
        <Input 
          header='Оценка' 
          placeholder='9' error={errorNote}
          value={selectedGrade.grade?.toString() || ''} setValue={setGradeNumber}/>
        
        {isShowCompleted &&
          <>
            <Spacing themeSpace={10} variant='Row' />
            <Checkbox label='Отработано:' value={isCompleted} toggle={toggleComplited}/>
          </>}
      </Row>
      <Spacing themeSpace={25} variant='Column' />
      <ActionButtonSwitch  
        text='Защищено'
        isLeft={!selectedGrade.isPassLab} 
        onClick={switchIsPassed} />
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
	classesIds: ClassHeaderType[];
	onClickGrade: (value: GradeInfo) => void;
  openClassControlForStudents: (value: ClassHeaderType) => void;
};
  
export const StudentsTable: FC<StudentsTableProps> = memo(({
	data,
	classesIds,
	onClickGrade,
  openClassControlForStudents
}) => {
  const {
    isHorizontalScrollNeeded,
    isVerticalScrollNeeded,
    verticalTrackRef,
    verticalScrollRef,
    verticalSliderRef,
    horizontalTrackRef,
    horizontalScrollRef1,
    horizontalScrollRef2,
    horizontalSliderRef,
    handleHorizontalStart,
    handleVerticalStart
  } = useTableScroll(classesIds);

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
		  	  <HeaderClassItem key={index} onClick={() => openClassControlForStudents(item)}>
		  		<Text themeFont={theme.fonts.h3}>
            {!item.isAttestation ? <>Занятие {item.position}</> : <>Аттестация</>}
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
		    		  {item.student.surname}
		    		</Text>
		    		<Text themeFont={theme.fonts.ht2}>
		    		  {item.student.name}
		    		</Text>
		    		<Text themeFont={theme.fonts.ht2}>
		    		  {item.student.lastname}
		    		</Text>
		    	  </StudentItem>)}
		    	</StudentsContainer>
		    	<ClassesContainer ref={horizontalScrollRef2}>
		    	  {data.map((item, index)=> <ClassesRow key={index}>
		    		{item.grades.map((item, index) => 
            <ClassItemView 
              item={item} 
              onClickGrade={onClickGrade} 
              onClickAttestation={() => {}}/>)}
		    	  </ClassesRow>)}
		    	</ClassesContainer>
		      </Table>
		    </ScrollWrapper>
      </Row>
      <Column 
        style={{visibility: isHorizontalScrollNeeded ? 'visible' : 'hidden'}} 
        horizontalAlign="flex-end">
        <Spacing variant="Column" themeSpace={10} />
        <HorizontalTrack ref={horizontalTrackRef}>
          <HorizontalSlider
            ref={horizontalSliderRef}
            onMouseDown={handleHorizontalStart}
            onTouchStart={handleHorizontalStart}
          />
        </HorizontalTrack>
      </Column>
	  </TableWrapper>
	);
});

export type ClassItemViewProps = {
  item: GradeInfo | AttestationGradeInfo;
  onClickGrade: (value: GradeInfo) => void;
  onClickAttestation: (value: AttestationGradeInfo) => void; 
};
    
export const ClassItemView: FC<ClassItemViewProps> = memo(({ 
  item,
  onClickGrade,
  onClickAttestation
 }) => {
  
  return !checkIsAttestationGrade(item) ? (
    item.idStudentGrate !== -1 ? (
      <ClassItem
        isPassed={item.isPassLab}
        isReview={
          item.isReview && 
          ![3, 7, 8].includes(item.attendance)}
		    onClick={() => onClickGrade(item)} >
		    {item.description !== null && <ExistMark/>}
		    {item.grade !== 0 && <Text themeFont={theme.fonts.ht2}>
		  	{item.grade}
		    </Text>}
		    <ColorCircle
            color={attendanceColorsForStudents[item.attendance]}
          />
		  </ClassItem>
    ) : (
      <EmptyClassItem />
    )
  ) : (
    <ClassItem />
  );
});