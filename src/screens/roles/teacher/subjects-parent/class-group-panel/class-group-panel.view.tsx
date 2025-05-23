
import { FC, memo, useCallback, useEffect, useRef, useState } from 'react';
import { useMediaQuery } from 'react-responsive';
import { theme } from '../../../../../ui-kit/themes/theme';
import { WrapperMobile } from '../../../../../components/wrapper-mobile';
import { WrapperDesktop } from '../../../../../components/wrapper-desktop';
import { Surface } from '../../../../../ui-kit/surface';
import { ClassesContainer, ClassesRow, ClassItem, ColorCircle, ColorCircleButton, ContainerWrapper, EmptyClassItem, ExistMark, HeaderClasses, HeaderClassItem, HorizontalSlider, HorizontalTrack, NameHeader, ScrollWrapper, StudentItem, StudentsContainer, Table, TableHeader, TableWrapper, VerticalSlider, VerticalTrack } from './class-group-panel.styled';
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
import RefreshLogo from '../../../../../ui-kit/assets/refresh.svg';
import InfoLogo from '../../../../../ui-kit/assets/info.svg';
import bookLogo from '../../../../../ui-kit/assets/book.svg';

import { Image } from '../../../../../ui-kit/image';
import QRCode from 'react-qr-code';
import React from 'react';
import { Checkbox } from '../../../../../ui-kit/checkbox';
import { useTableScroll } from '../../../../../hooks/table-scroll-hook';
import { ActionButtonSwitch } from '../../../../../ui-kit/action-button-switch';
import { SuccessfulPopup } from '../../../../../ui-kit/successful-popup';
import { RulesText } from '../../../dean/workshop-parent/class-table/class-table.view';
import { encryptAES } from '../../../../../store/reducers/roles/student-and-parent/student-class-group-table';


export type ClassGroupPanelViewProps = {
  teacherClassGroupControlState: СlassGroupControlState;
  goToTeacherClassGroupSubgroups: () => void;
  setSelectedGrade: (gradeInfo: GradeInfo, onSuccess: () => void) => void;
  switchIsPassed: () => void;
  setHourAttestation: (value: string) => void;
  updateGrade: (onSuccess: () => void) => void;
  toggleComplited: () => void;
  deleteClass: (onSuccess: () => void) => void;
  createClass: (onSuccess: () => void) => void;
  setGradeNumber: (value: string) => void;
  setNameOfClass: (value: string) => void;
  reloadTable: () => void;
  setSelectedAttestationGrade: (value: AttestationGradeInfo, onSuccess: () => void) => void;
  setDescription: (value: string) => void;
  setCurrentNameOfClass: (onSuccess: () => void) => void;
  setAttendance: (value: AttendanceCodeType) => void;

  setSelectedClass: (value: ClassHeaderType, onSuccess: () => void) => void;
  setExpirationOfRefresh: (value: number) => void
  setExpirationOfReview: (value: number) => void;

  activateKeyForClass: (expiration: number, onSuccess: () => void) => void

  clearQrCodeData: () => void;
  generateQrCode: () => void;
  startQrCode: () => void;

  onReview: (onSuccess: () => void) => void;

  resetAttestateWindow: () => void;
  setMaxCountLab: (value: string) => void;
  setTimeOfOneClass: (value: string) => void;
  setCountClassThatNotAttestationClass: (value: string) => void;

  calculateAttestation: (onSuccess: () => void) => void;
  setAvgGrade: (value: string) => void;

  onSave: (onSuccess: () => void) => void;
  removeAttestation: (onSuccess: () => void) => void;

  toggleAttested: () => void;

  renameClass: (onSuccess: () => void) => void;
};

export const ClassGroupPanelView: FC<ClassGroupPanelViewProps> = memo(({
  teacherClassGroupControlState,
  goToTeacherClassGroupSubgroups,
  createClass,
  updateGrade,
  setSelectedGrade,
  setHourAttestation,
  toggleAttested,
  deleteClass,
  setAttendance,
  setDescription,
  setNameOfClass,
  setGradeNumber,
  setCurrentNameOfClass,
  switchIsPassed,
  startQrCode,
  reloadTable,
  onReview,
  setSelectedAttestationGrade,
  toggleComplited,

  setExpirationOfRefresh,
  setSelectedClass,
  setExpirationOfReview,
  removeAttestation,
  activateKeyForClass,

  generateQrCode,
  clearQrCodeData,

  setCountClassThatNotAttestationClass,
  setMaxCountLab,
  setTimeOfOneClass,
  resetAttestateWindow,
  setAvgGrade,

  calculateAttestation,
  onSave,

  renameClass
}) => {
  const isMobile = useMediaQuery({maxWidth: theme.toMobileSize});

  const [isOpenAddPopup, setIsOpenAddPopup] = useState<boolean>(false);
  const [isOpenDeletePopup, setIsOpenDeletePopup] = useState<boolean>(false);

  const [isOpenAttestationGrade, setIsOpenAttestationGrade] = useState<boolean>(false);
  const openAttestationGrade = useCallback((value: AttestationGradeInfo) => {
    setSelectedAttestationGrade(value, () => setIsOpenAttestationGrade(true));
  },[setSelectedAttestationGrade])
  const closeAttestationGrade = useCallback(() => {
    setIsOpenAttestationGrade(false);
    resetAttestateWindow();
  },[resetAttestateWindow])

  const [isOpenClassAttestation, setIsOpenClassAttestation] = useState<boolean>(false);
  const openClassAttestation = useCallback((value: ClassHeaderType) => {
    setSelectedClass(value, () => setIsOpenClassAttestation(true));
  },[setSelectedClass])
  const closeClassAttestation = useCallback(() => {
    setIsOpenClassAttestation(false);
    resetAttestateWindow();
  },[resetAttestateWindow])

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
    setIsClassControlPopup(false);
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
    setExpirationOfReview(5);
    setIsOpenGenerateKeyPopup(!isOpenGenerateKeyPopup);
  },[isOpenGenerateKeyPopup, setExpirationOfReview])
  const [isOpenQrCodePopup, setIsOpenQrCodePopup] = useState<boolean>(false);
  const controlQrCodePopup = useCallback(() => {
    if(!isOpenQrCodePopup) 
      setExpirationOfReview(5);

    setIsOpenQrCodePopup(!isOpenQrCodePopup);
  },[isOpenQrCodePopup, setExpirationOfReview])

  const [isClassControlPopup, setIsClassControlPopup] = useState<boolean>(false);
  const controlClassControlPopup = useCallback(() => {
    setIsClassControlPopup(!isClassControlPopup);
  },[isClassControlPopup])
  const openClassControlForStudents = useCallback((value: ClassHeaderType) => {
    setSelectedClass(value, controlClassControlPopup);
  },[setSelectedClass, controlClassControlPopup])
  const closeClassControlForStudents = useCallback(() => {
    controlClassControlPopup();
    setExpirationOfRefresh(5);
  },[setExpirationOfRefresh, controlClassControlPopup])

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

  const onCalculateAttestation = useCallback(() => {
    calculateAttestation(closeClassAttestation);
  },[calculateAttestation, closeClassAttestation])

  const onClickSave = useCallback(() => {
    onSave(closeAttestationGrade);
  },[onSave, closeAttestationGrade])

  const [isOpenSendAttestation, setIsOpenSendAttestation] = useState<boolean>(false);
  const controlSendAttestation = useCallback(() => {
    setIsOpenSendAttestation(!isOpenSendAttestation);
  },[isOpenSendAttestation])

  const [isOpenSuccessSendAttestation, setIsOpenSuccessSendAttestation] = useState<boolean>(false);
  const controlSuccessSendAttestation = useCallback(() => {
    setIsOpenSuccessSendAttestation(!isOpenSuccessSendAttestation);
  },[isOpenSuccessSendAttestation])

  const onSuccessForAttestationRemove= useCallback(() => {
    setIsOpenSuccessSendAttestation(true);
    setIsOpenSendAttestation(false);
  },[])

  const handleRemoveAttestation = useCallback(() => {
    removeAttestation(onSuccessForAttestationRemove);
  },[removeAttestation, onSuccessForAttestationRemove])

  const [isOpenRenameClass, setIsOpenRenameClass] = useState<boolean>(false);
  const openRenameClass = useCallback(() => {
    setCurrentNameOfClass(() => setIsOpenRenameClass(true));
  },[setCurrentNameOfClass])
  const closeRenameClass = useCallback(() => {
    setIsOpenRenameClass(false);
    setNameOfClass('');
  },[setNameOfClass])

  const handleRenameClass = useCallback(() => {
    renameClass(closeRenameClass);
  },[renameClass, closeRenameClass])


  return (
    <>
      
      {
        isMobile ? 
        (<ClassGroupPanelMobileView
          openAddPopup={openAddPopup}
          controlSendAttestation={controlSendAttestation}
          teacherClassGroupControlState={teacherClassGroupControlState}
          goToTeacherClassGroupSubgroups={goToTeacherClassGroupSubgroups}
          setAttendance={setAttendance}
          setDescription={setDescription}
          toggleAttested={toggleAttested}
          setAvgGrade={setAvgGrade}
          controlDescriptionClass={controlDescriptionClass}
          setGradeNumber={setGradeNumber}
          setCountClassThatNotAttestationClass={setCountClassThatNotAttestationClass}
          setMaxCountLab={setMaxCountLab}
          setTimeOfOneClass={setTimeOfOneClass}
          resetAttestateWindow={resetAttestateWindow}
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
          isOpenAttestationGrade={isOpenAttestationGrade}
          isOpenClassAttestation={isOpenClassAttestation}
          openAttestationGrade={openAttestationGrade}
          closeAttestationGrade={closeAttestationGrade}
          setNameOfClass={setNameOfClass}
          onClickSave={onClickSave}
          calculateAttestation={onCalculateAttestation}
          renameClass={handleRenameClass}
          openClassAttestation={openClassAttestation}
          setHourAttestation={setHourAttestation}
          closeClassAttestation={closeClassAttestation}
          isOpenRenameClass={isOpenRenameClass}
          closeRenameClass={closeRenameClass}
          openRenameClass={openRenameClass}
          />) :
        (<ClassGroupPanelDesktopView
          openAddPopup={openAddPopup}
          onClickSave={onClickSave}
          renameClass={handleRenameClass}
          setNameOfClass={setNameOfClass}
          setHourAttestation={setHourAttestation}
          calculateAttestation={onCalculateAttestation}
          handleReview={handleReview}
          setAvgGrade={setAvgGrade}
          controlSendAttestation={controlSendAttestation}
          switchIsPassed={switchIsPassed}
          setCountClassThatNotAttestationClass={setCountClassThatNotAttestationClass}
          setMaxCountLab={setMaxCountLab}
          setTimeOfOneClass={setTimeOfOneClass}
          toggleAttested={toggleAttested}
          resetAttestateWindow={resetAttestateWindow}
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
          isOpenAttestationGrade={isOpenAttestationGrade}
          isOpenClassAttestation={isOpenClassAttestation}
          openAttestationGrade={openAttestationGrade}
          closeAttestationGrade={closeAttestationGrade}
          openClassAttestation={openClassAttestation}
          isOpenRenameClass={isOpenRenameClass}
          closeRenameClass={closeRenameClass}
          openRenameClass={openRenameClass}
          closeClassAttestation={closeClassAttestation}
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
      <QrCodeControlPopup startQrCode={startQrCode}
        isMobile={isMobile}
        qrCodeData={teacherClassGroupControlState.qrCodePopup.qrCodeData}
        stateQrCode={teacherClassGroupControlState.qrCodePopup.loadingQrCode} 
        stateStart={teacherClassGroupControlState.qrCodePopup.loadingStart} 
        generateQrCode={generateQrCode} clearDataQrCode={clearQrCodeData}
        setTimeValueForRefresh={setExpirationOfRefresh}
        setTimeValueForReview={setExpirationOfReview} 
        timeValueForRefresh={teacherClassGroupControlState.qrCodePopup.expirationOfRefresh} 
        timeValueForReview={teacherClassGroupControlState.qrCodePopup.expirationOfReview} 
        closePopup={controlQrCodePopup} isActive={isOpenQrCodePopup}/>
      <GenerateKeyPopup 
        stateActivate={teacherClassGroupControlState.generateKeyPopup.loadingActivate} 
        onActivateClick={confirmActivateKeyForClass}
        closePopup={controlGenerateKeyPopup} isActive={isOpenGenerateKeyPopup}/>
      <Popup isActive={isOpenSendAttestation} closePopup={controlSendAttestation}>
        <Column horizontalAlign='center'>
          <Text themeColor={theme.colors.attentive} themeFont={theme.fonts.h2} align='center'> 
            Вы уверены, что хотите<br/>
            отправить аттестацию?
          </Text>
          <Spacing  themeSpace={25} variant='Column' />
          <Row>
            <Button onClick={handleRemoveAttestation} 
              state={teacherClassGroupControlState.loadingRemoveAttestation} 
              variant='recomended' padding={[12,17]}>
              Отправить
            </Button>
            <Spacing variant='Row' themeSpace={20}/>
            <Button onClick={controlSendAttestation} variant='attentive' padding={[12,17]}>
              Отмена
            </Button>
          </Row>
        </Column>
      </Popup>
      <SuccessfulPopup
        text={<>Аттестация <br/> успешно отправлена</>}
        isOpen={isOpenSuccessSendAttestation}
        closePopup={controlSuccessSendAttestation}
      />
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
  renameClass: () => void;
  switchIsPassed: () => void;
  reloadTable: () => void;
  setDescription: (value: string) => void;
  setNameOfClass: (value: string) => void;
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

  isOpenAttestationGrade: boolean;
  isOpenClassAttestation: boolean;
  openAttestationGrade: (value: AttestationGradeInfo) => void;
  closeAttestationGrade: () => void;
  openClassAttestation: (value: ClassHeaderType) => void;
  closeClassAttestation: () => void;
  toggleAttested: () => void;

  resetAttestateWindow: () => void;
  setMaxCountLab: (value: string) => void;
  setTimeOfOneClass: (value: string) => void;
  setCountClassThatNotAttestationClass: (value: string) => void;
  setAvgGrade: (value: string) => void;

  calculateAttestation: () => void;
  onClickSave: () => void;
  controlSendAttestation: () => void;
  isOpenRenameClass: boolean;
  openRenameClass: () => void;
  setHourAttestation: (value: string) => void;
  closeRenameClass: () => void;
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
  renameClass,
  toggleComplited,
  isClassControlPopup,
  setDescription,
  setGradeNumber,
  closeUpdateWindow,
  openUpdateWindow,
  handleReview,
  switchIsPassed,
  setHourAttestation,
  toggleAttested,
  confirmUpdate,
  reloadTable,

  controlGenerateKeyPopup,
  controlQrCodePopup,

  controlDescriptionClass,
  isOpenDescriptionClass,

  isOpenAttestationGrade,
  isOpenClassAttestation,
  openAttestationGrade,
  closeAttestationGrade,
  openClassAttestation,
  setNameOfClass,
  closeClassAttestation,

  setCountClassThatNotAttestationClass,
  setMaxCountLab,
  setTimeOfOneClass,
  setAvgGrade,
  onClickSave,

  calculateAttestation,
  controlSendAttestation,
  isOpenRenameClass,
  openRenameClass,
  closeRenameClass
}) => {

  const [isOpenRules, setIsOpenRules] = useState<boolean>(false);
  const closeRules = useCallback(() => {
    setIsOpenRules(false);
  },[])
  const openRules = useCallback(() => {
    setIsOpenRules(true);
  },[])

  return (
    <WrapperMobile onBack={goToTeacherClassGroupSubgroups} role='ROLE_TEACHER' 
    header={teacherClassGroupControlState.initData?.classGroup.classGroup.description}>
      {teacherClassGroupControlState.loading === 'loading' ?
      <Column style={{position: 'absolute', height: '100dvh', top: 0}}>
        <CircleLoading state={teacherClassGroupControlState.loading}/>
      </Column> : <ContainerWrapper isDesktop={false}>
        <Surface style={{position: 'relative'}}>
          <Row style={{position: 'absolute'}}>
            <Button height={38.4} width={38.4} onClick={openRules} variant='recomended' padding={0}>
              <Column style={{height: '100%'}}  verticalAlign='center' horizontalAlign='center'>
              <Image src={bookLogo} width={20} height={20}/> 
              </Column>
            </Button>
            <Spacing themeSpace={10} variant='Row' />
            <Button height={38.4} width={38.4} onClick={controlDescriptionClass} variant='recomended' padding={0}>
              <Column style={{height: '100%'}}  verticalAlign='center' horizontalAlign='center'>
              <Image src={InfoLogo} width={15} height={15}/> 
              </Column>
            </Button>
            <Spacing themeSpace={10} variant='Row' />
            <Button height={38} width={38} onClick={reloadTable} 
              state={teacherClassGroupControlState.loadingReloadTable} variant='recomended' padding={0}>
              <Column style={{height: '100%'}}  verticalAlign='center' horizontalAlign='center'>
              <Image src={RefreshLogo} width={15} height={15}/> 
              </Column>
            </Button>
          </Row>
          <Spacing themeSpace={10} variant='Column' />
          {teacherClassGroupControlState.studentsStatistics.length !== 0 ? 
            <StudentsTable openClassAttestation={openClassAttestation} openAttestationGrade={openAttestationGrade}
              onClickGrade={openUpdateWindow} openClassControlForStudents={openClassControlForStudents}
              classesIds={teacherClassGroupControlState.classesIds}
              data={teacherClassGroupControlState.studentsStatistics}/> :
            <Text style={{marginTop: 70}} themeFont={theme.fonts.h2} themeColor={theme.colors.attentive}>
              Студенты не найдены
            </Text>}
          <Spacing themeSpace={25} variant='Column' />
          {teacherClassGroupControlState.studentsStatistics.length !== 0 && 
            <Row>
              <Button onClick={openAddPopup} height={45} variant='primary' padding={[12, 10]}>
                Добавить занятие
              </Button>
              <Spacing themeSpace={20} variant='Row' />
              {teacherClassGroupControlState.isNeedAttestation && 
              <Button onClick={controlSendAttestation} height={45} variant='attentive' padding={[12, 10]}>
                Отправить аттестацию
              </Button>}
            </Row>}
        </Surface>
        <Spacing variant='Column' themeSpace={85} />
      </ContainerWrapper>}
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
      <Modal isActive={isOpenClassAttestation} closeModal={closeClassAttestation}>
        <ControlAttestationClass
          errorCountClassThatNotAttestation={teacherClassGroupControlState.errors["errorCountClassThatNotAttestation"]}
          errorMaxLabCount={teacherClassGroupControlState.errors["errorMaxLabCount"]}
          errorTimeOfOneClass={teacherClassGroupControlState.errors["errorTimeOfOneClass"]}
          setCountClassThatNotAttestation={setCountClassThatNotAttestationClass}
          setMaxLabCount={setMaxCountLab}
          setTimeOfOneClass={setTimeOfOneClass}
          countClassThatNotAttestation={teacherClassGroupControlState.countClassThatNotAttestation}
          maxLabCount={teacherClassGroupControlState.maxLabCount}
          timeOfOneClass={teacherClassGroupControlState.timeOfOneClass}
          calculateState={teacherClassGroupControlState.loadingCalculate}
          onCaclulate={calculateAttestation}
          onCancel={closeClassAttestation}
          isMobile={true}
          />
      </Modal>
      <Modal isActive={isOpenAttestationGrade} closeModal={closeAttestationGrade}>
        <ControlAttestationGrade
          errorAvgGrade={teacherClassGroupControlState.errors["errorAvgGrade"]}
          errorCurrentCountLab={teacherClassGroupControlState.errors["errorCurrentCountLab"]}
          errorMaxCountLab={teacherClassGroupControlState.errors["errorMaxCountLab"]}
          errorHour={teacherClassGroupControlState.errors["errorHour"]}
          setCurrentCountLab={setCountClassThatNotAttestationClass}
          setMaxCountLab={setMaxCountLab}
          setHour={setHourAttestation}
          setAvgGrade={setAvgGrade}
          toggleAttested={toggleAttested}
          isAttested={teacherClassGroupControlState.isAttested}
          avgGrade={teacherClassGroupControlState.avgGrade}
          currentCountLab={teacherClassGroupControlState.countClassThatNotAttestation}
          maxCountLab={teacherClassGroupControlState.maxLabCount}
          hour={teacherClassGroupControlState.hourAttestation}
          stateSave={teacherClassGroupControlState.loadingCalculate}
          onSave={onClickSave}
          onCancel={closeAttestationGrade}
          isMobile={true}
          />
      </Modal>
      <Modal isActive={isClassControlPopup} closeModal={closeClassControlForStudents}>
        <Text themeFont={theme.fonts.h1}>
		  		Занятие {teacherClassGroupControlState.selectedClass.position}
		  	</Text>
        {teacherClassGroupControlState.selectedClass.className !== null && <Spacing themeSpace={10} variant='Column' />}
        <Text themeFont={theme.fonts.ht1} format='break' >
		  		{teacherClassGroupControlState.selectedClass.className}
		  	</Text>
        <Spacing themeSpace={20} variant='Column' />
        <Button 
          onClick={openRenameClass} 
          width={200}
          variant="primary" padding={[12,17]}>
          Редакт. название
        </Button>
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
        <Spacing themeSpace={15} variant='Column' />
        <Button 
          onClick={openDeletePopup} 
          width={200}
          variant='attentive' padding={[12,17]}>
          Удалить занятие
        </Button>
      </Modal>
      <Modal closeModal={closeRenameClass}  isActive={isOpenRenameClass}>
        <Column horizontalAlign='center'>
          <Input 
            header='Введите название' 
            placeholder='Введение...' error={teacherClassGroupControlState.errors["nameOfClassError"]}
            value={teacherClassGroupControlState.nameOfClass} setValue={setNameOfClass}/>
          <Spacing variant='Column' themeSpace={35}/>
          <Row>
            <Button onClick={renameClass} state={teacherClassGroupControlState.loadingRename} variant='recomended' padding={[12,17]}>
              Сохранить
            </Button>
            <Spacing variant='Row' themeSpace={25}/>
            <Button onClick={closeRenameClass} state={'idle'} variant='attentive' padding={[12,17]}>
              Отмена
            </Button>
          </Row>
        </Column>
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
      <Modal isActive={isOpenRules} closeModal={closeRules} >
        <RulesText/>
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
  setHourAttestation,
  setDescription,
  setGradeNumber,
  closeUpdateWindow,
  setNameOfClass,
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
  controlDescriptionClass,

  isOpenAttestationGrade,
  isOpenClassAttestation,
  renameClass,
  openAttestationGrade,
  closeAttestationGrade,
  openClassAttestation,
  toggleAttested,
  closeClassAttestation,

  setCountClassThatNotAttestationClass,
  setMaxCountLab,
  setTimeOfOneClass,
  setAvgGrade,
  onClickSave,
  
  calculateAttestation,
  controlSendAttestation,
  isOpenRenameClass,
  openRenameClass,
  closeRenameClass
}) => {

  const [isOpenRules, setIsOpenRules] = useState<boolean>(false);
  const closeRules = useCallback(() => {
    setIsOpenRules(false);
  },[])
  const openRules = useCallback(() => {
    setIsOpenRules(true);
  },[])

  return (
    <WrapperDesktop style={{padding: 'none'}} onBack={goToTeacherClassGroupSubgroups} role='ROLE_TEACHER' 
    header={teacherClassGroupControlState.initData?.classGroup.classGroup.description} isCenter={true}>
      {teacherClassGroupControlState.loading === 'loading' ?
      <Column style={{position: 'absolute', height: '100dvh', top: 0}}>
        <CircleLoading state={teacherClassGroupControlState.loading}/>
      </Column> : <ContainerWrapper isDesktop={true}>
        <Surface style={{width: 900, position: 'relative'}}>
          <Row style={{position: 'absolute'}}>
            <Button height={38.4} width={38.4} onClick={openRules} variant='recomended' padding={0}>
              <Column style={{height: '100%'}}  verticalAlign='center' horizontalAlign='center'>
                <Image src={bookLogo} width={20} height={20}/> 
              </Column>
            </Button>
            <Spacing themeSpace={10} variant='Row' />
            <Button height={38.4} width={38.4} onClick={controlDescriptionClass} variant='recomended' padding={0}>
              <Column style={{height: '100%'}}  verticalAlign='center' horizontalAlign='center'>
              <Image src={InfoLogo} width={15} height={15}/> 
              </Column>
            </Button>
            <Spacing themeSpace={10} variant='Row' />
            <Button height={38.4} width={38.4} onClick={reloadTable} 
              state={teacherClassGroupControlState.loadingReloadTable} variant='recomended' padding={0}>
              <Column style={{height: '100%'}}  verticalAlign='center' horizontalAlign='center'>
              <Image src={RefreshLogo} width={15} height={15}/> 
              </Column>
            </Button>
          </Row>
          <Spacing themeSpace={20} variant='Column' />
          {teacherClassGroupControlState.studentsStatistics.length !== 0 ? 
            <StudentsTable  openClassAttestation={openClassAttestation} openAttestationGrade={openAttestationGrade}
              onClickGrade={openUpdateWindow} openClassControlForStudents={openClassControlForStudents}
              classesIds={teacherClassGroupControlState.classesIds}
              data={teacherClassGroupControlState.studentsStatistics}/> :
            <Text style={{marginTop: 70}} themeFont={theme.fonts.h2} themeColor={theme.colors.attentive}>
              Студенты не найдены
            </Text>}
          <Spacing themeSpace={20} variant='Column' />
          {teacherClassGroupControlState.studentsStatistics.length !== 0 && 
            <Row>
              <Button onClick={openAddPopup} variant='primary' padding={[12, 17]}>
                Добавить занятие
              </Button>
              <Spacing themeSpace={15} variant='Row' />
              {teacherClassGroupControlState.isNeedAttestation && 
                <Button onClick={controlSendAttestation} variant='attentive' padding={[12, 17]}>
                  Отправить аттестацию 
                </Button>}
            </Row>}
        </Surface>
      </ContainerWrapper>}
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
          {teacherClassGroupControlState.selectedClass.className !== null && <Spacing themeSpace={10} variant='Column' />}
          <Text themeFont={theme.fonts.ht1} format='break' style={{maxWidth: 200}}>
		  	  	{teacherClassGroupControlState.selectedClass.className}
		  	  </Text>
          <Spacing themeSpace={25} variant='Column' />
          <Button 
            onClick={openRenameClass} 
            width={240}
            variant="primary" padding={[12,17]}>
            Редакт. название
          </Button>
          <Spacing themeSpace={15} variant='Column' />
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
          <Spacing themeSpace={15} variant='Column' />
          <Button 
            onClick={openDeletePopup} 
            width={240}
            variant='attentive' padding={[12,17]}>
            Удалить занятие
          </Button>
        </Column>
      </Popup>
      <Popup isActive={isOpenClassAttestation} closePopup={closeClassAttestation}>
        <ControlAttestationClass
          errorCountClassThatNotAttestation={teacherClassGroupControlState.errors["errorCountClassThatNotAttestation"]}
          errorMaxLabCount={teacherClassGroupControlState.errors["errorMaxLabCount"]}
          errorTimeOfOneClass={teacherClassGroupControlState.errors["errorTimeOfOneClass"]}
          setCountClassThatNotAttestation={setCountClassThatNotAttestationClass}
          setMaxLabCount={setMaxCountLab}
          setTimeOfOneClass={setTimeOfOneClass}
          countClassThatNotAttestation={teacherClassGroupControlState.countClassThatNotAttestation}
          maxLabCount={teacherClassGroupControlState.maxLabCount}
          timeOfOneClass={teacherClassGroupControlState.timeOfOneClass}
          calculateState={teacherClassGroupControlState.loadingCalculate}
          onCaclulate={calculateAttestation}
          onCancel={closeClassAttestation}
          isMobile={false}
          />
      </Popup>
      <Popup isActive={isOpenAttestationGrade} closePopup={closeAttestationGrade}>
        <ControlAttestationGrade
          errorAvgGrade={teacherClassGroupControlState.errors["errorAvgGrade"]}
          errorCurrentCountLab={teacherClassGroupControlState.errors["errorCurrentCountLab"]}
          errorMaxCountLab={teacherClassGroupControlState.errors["errorMaxCountLab"]}
          errorHour={teacherClassGroupControlState.errors["errorHour"]}
          setCurrentCountLab={setCountClassThatNotAttestationClass}
          setMaxCountLab={setMaxCountLab}
          setHour={setHourAttestation}
          toggleAttested={toggleAttested}
          isAttested={teacherClassGroupControlState.isAttested}
          setAvgGrade={setAvgGrade}
          avgGrade={teacherClassGroupControlState.avgGrade}
          currentCountLab={teacherClassGroupControlState.countClassThatNotAttestation}
          maxCountLab={teacherClassGroupControlState.maxLabCount}
          hour={teacherClassGroupControlState.hourAttestation}
          stateSave={teacherClassGroupControlState.loadingCalculate}
          onSave={onClickSave}
          onCancel={closeAttestationGrade}
          isMobile={false}
          />
      </Popup>
      <Popup closePopup={closeRenameClass} isActive={isOpenRenameClass}>
        <Column horizontalAlign='center' style={{width: 440}}>
          <Input 
            header='Введите название' 
            placeholder='Введение...' error={teacherClassGroupControlState.errors["nameOfClassError"]}
            value={teacherClassGroupControlState.nameOfClass} setValue={setNameOfClass}/>
          <Spacing variant='Column' themeSpace={35}/>
          <Row>
            <Button onClick={renameClass} state={teacherClassGroupControlState.loadingRename} variant='recomended' padding={[12,17]}>
              Сохранить
            </Button>
            <Spacing variant='Row' themeSpace={25}/>
            <Button onClick={closeRenameClass} state={'idle'} variant='attentive' padding={[12,17]}>
              Отмена
            </Button>
          </Row>
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
      <Popup isActive={isOpenRules} closePopup={closeRules} >
        <RulesText/>
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
  startQrCode: () => void;
  isMobile: boolean;
};
    
export const QrCodeControlPopup: FC<QrCodeControlPopupProps> = memo(({
  isActive,
  closePopup,
  startQrCode,
  timeValueForRefresh,
  timeValueForReview,
  setTimeValueForRefresh,
  setTimeValueForReview,
  stateQrCode,
  isMobile,
  generateQrCode,
  stateStart,
  qrCodeData,
  clearDataQrCode
}) => {
  
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const [isStarted, setIsStarted] = useState<boolean>(false);

  const handleStart = useCallback(() => {
    startQrCode();
    setIsStarted(true);

    if (intervalRef.current) return;

    intervalRef.current = setInterval(() => {
      generateQrCode();
    }, timeValueForRefresh * 1000);
  },[startQrCode, generateQrCode, timeValueForRefresh]);

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

  const [isOpenFull, setIsOpenFull] = useState<boolean>(false);
  const secretKey = process.env.REACT_APP_SECRET_KEY || "default-secret-key";

  const encryptText = useCallback((text: string): string => {
     return encryptAES(text, secretKey);
  }, [secretKey]);

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
        <Spacing variant='Column' themeSpace={15}/>
        <Text themeFont={theme.fonts.h2}>
          Время для пересмотра: <span style={{width: 70, display: 'inline-block'}}><b> {timeValueForReview} мин.</b> </span>
        </Text>
        <Spacing variant='Column' themeSpace={15}/>
        <RangeSlider
          minValue={1}
          maxValue={10}
          disabled={isStarted}
          value={timeValueForReview} 
          step={1}
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
      <Spacing variant='Column' themeSpace={10}/>
      <Surface padding='10px' borderRadius='10px' borderColor={theme.colors.foreground} height={isMobile ? 320 : 370} width={isMobile ? 320: 370}>
        <Column style={{height: '100%', position: 'relative'}} horizontalAlign='center' verticalAlign='center'>
          {!isStarted ? <Image src={ShieldLogo} width={250} height={250}/> : <>
            {
              (stateQrCode === 'idle' || stateQrCode === 'loading') ? 
                (<CircleLoading state={'loading'}/>) :
                (<>
                  <QRCode level='L' size={500} onClick={ !isMobile ? () => setIsOpenFull(true) : () => {}}
                    value={encryptText(JSON.stringify(qrCodeData))}
                    />
                </>)
            }
            </>}
        </Column>
        {isOpenFull && <Column horizontalAlign='center' verticalAlign='center'
        onClick={() => setIsOpenFull(false)}
          style={{
            position: 'absolute', 
            left: 0, top: 0, 
            height: '100vh', 
            width: '100vw', 
            background: 'white', 
            zIndex: 1000000000000000}}>
              {
                (stateQrCode === 'idle' || stateQrCode === 'loading') ? 
                (<CircleLoading state={'loading'}/>) :
                (<>
                  <QRCode level='L' size={550}
                    value={encryptText(JSON.stringify(qrCodeData))}
                  />
                </>)
              }
      </Column>}
      </Surface>
      <Spacing variant='Column' themeSpace={10}/>
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

export type ControlAttestationClassProps = {
  isMobile: boolean;

  errorCountClassThatNotAttestation: string | null;
  errorMaxLabCount: string | null;
  errorTimeOfOneClass: string | null;

  countClassThatNotAttestation: number | null;
  maxLabCount: number | null;
  timeOfOneClass: number | null;
  setCountClassThatNotAttestation: (value: string) => void;
  setMaxLabCount: (value: string) => void;
  setTimeOfOneClass: (value: string) => void;
  calculateState: "idle" | "loading" | "success" | "error";

  onCancel: () => void;
  onCaclulate: () => void;
};
    
export const ControlAttestationClass: FC<ControlAttestationClassProps> = memo(({
  isMobile,

  errorCountClassThatNotAttestation,
  errorMaxLabCount,
  errorTimeOfOneClass,

  setCountClassThatNotAttestation,
  setMaxLabCount,
  setTimeOfOneClass,
  countClassThatNotAttestation,
  maxLabCount,
  timeOfOneClass,

  calculateState,

  onCaclulate,
  onCancel
}) => {
  
  return (
    <Column style={isMobile ? {} : {width: 440}} horizontalAlign='center'>
      <Text themeFont={theme.fonts.h1}>
        Аттестация
		  </Text>
      <Spacing themeSpace={25} variant='Column' />
      <Input 
          header='Прошедшее количество занятий' 
          placeholder='9' error={errorMaxLabCount}
          value={maxLabCount?.toString() || ''} setValue={setMaxLabCount}/>
      <Spacing themeSpace={25} variant='Column' />
      <Input 
          header='Необходимое кол-во защищённых занятий' 
          placeholder='9' error={errorCountClassThatNotAttestation}
          value={countClassThatNotAttestation?.toString() || ''} setValue={setCountClassThatNotAttestation}/>
      <Spacing themeSpace={25} variant='Column' />
      <Input 
          header='Продолжительность занятия, мин' 
          placeholder='9' error={errorTimeOfOneClass}
          value={timeOfOneClass?.toString() || ''} setValue={setTimeOfOneClass}/>
      <Spacing themeSpace={25} variant='Column' />
      <Row>
        <Button 
          onClick={onCaclulate}
          state={calculateState} 
          variant='recomended' padding={[12,17]}>
          Вычислить
        </Button>
        <Spacing variant='Row' themeSpace={20}/>
        <Button onClick={onCancel} variant='attentive' padding={[12,17]}>
          Отмена
        </Button>
      </Row>
    </Column>
  );
});


export type ControlAttestationGradeProps = {
  isMobile: boolean;

  errorAvgGrade: string | null;
  errorHour: string | null;
  errorMaxCountLab: string | null;
  errorCurrentCountLab: string | null;

  avgGrade: string;
  isAttested: boolean;
  hour: string;
  maxCountLab: number | null;
  currentCountLab: number | null;
  setAvgGrade: (value: string) => void;
  setHour: (value: string) => void;
  setCurrentCountLab: (value: string) => void;
  setMaxCountLab: (value: string) => void;
  
  stateSave: "idle" | "loading" | "success" | "error";

  toggleAttested: () => void;

  onCancel: () => void;
  onSave: () => void;
};
    
export const ControlAttestationGrade: FC<ControlAttestationGradeProps> = memo(({
  isMobile,

  errorAvgGrade,
  errorHour,
  errorMaxCountLab,
  errorCurrentCountLab,
  isAttested,
  toggleAttested,

  avgGrade,
  hour,
  maxCountLab,
  currentCountLab,
  setAvgGrade,
  setHour,
  setCurrentCountLab,
  setMaxCountLab,

  stateSave,

  onSave,
  onCancel
}) => {
  
  return (
    <Column style={isMobile ? {} : {width: 440}} horizontalAlign='center'>
      <ActionButtonSwitch  
        text='Аттестован'
        isLeft={!isAttested} 
        onClick={toggleAttested} />
      <Spacing themeSpace={20} variant='Column' />
      <Input 
          header='Оценка' 
          placeholder='9' error={errorAvgGrade}
          value={avgGrade} setValue={setAvgGrade}/>
      <Spacing themeSpace={25} variant='Column' />
      <Input 
          header='Количество часов' 
          placeholder='9' error={errorHour}
          value={hour} setValue={setHour}/>
      <Spacing themeSpace={25} variant='Column' />
      <Input 
          header='Кол-во защищённых занятий' 
          placeholder='9' error={errorCurrentCountLab}
          value={currentCountLab?.toString() || ''} setValue={setCurrentCountLab}/>
      <Spacing themeSpace={25} variant='Column' />
      <Input 
          header='Максимальное кол-во защищённых занятий' 
          placeholder='9' error={errorMaxCountLab}
          value={maxCountLab?.toString() || ''} setValue={setMaxCountLab}/>
      <Spacing themeSpace={25} variant='Column' />
      <Row>
        <Button 
          onClick={onSave}
          state={stateSave} 
          variant='recomended' padding={[12,17]}>
          Сохранить
        </Button>
        <Spacing variant='Row' themeSpace={20}/>
        <Button onClick={onCancel} variant='attentive' padding={[12,17]}>
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
  openClassAttestation: (value: ClassHeaderType) => void;
  openAttestationGrade: (value: AttestationGradeInfo) => void
};
  
export const StudentsTable: FC<StudentsTableProps> = memo(({
	data,
	classesIds,
	onClickGrade,
  openClassControlForStudents,
  openClassAttestation,
  openAttestationGrade
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
      {classesIds.length === 0 && <Spacing variant='Column' themeSpace={50} />}
		  <TableHeader>
		    <NameHeader isHide={isVerticalScrollNeeded}>
		  	<Text themeFont={theme.fonts.h3}>
          ФИО студента
		  	</Text>
		    </NameHeader>
		    {classesIds.length !== 0 && <HeaderClasses ref={horizontalScrollRef1}>
		  	{classesIds.map((item, index) => (
		  	  <HeaderClassItem key={index} onClick={
            item.isAttestation ? 
          () => openClassAttestation(item) : 
          () => openClassControlForStudents(item)}>
		  		<Text themeFont={theme.fonts.h3} >
            {!item.isAttestation ? 
            <>Занятие {item.position}</> : <span style={{color: theme.colors.attentive}}>Аттестация</span>}
		  		</Text>
          {item.className !== null && <Spacing variant='Row' themeSpace={5} />}
          <Text themeFont={theme.fonts.ml} format='hide' style={{maxHeight: 100}}>
            {item.className}
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
              onClickAttestation={openAttestationGrade}/>)}
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
    <ClassItem 
    style={{backgroundColor: item.isAttested ? theme.colors.neutral : '#fc657e80'}}  
    onClick={() => onClickAttestation(item)}>
      {item.avgGrade !== null && <Text themeFont={theme.fonts.ht2} style={{ fontSize: 11 }}>
        <b>{item.avgGrade}</b>
      </Text>}
      {item.hour !== null && <Text themeFont={theme.fonts.ht2} style={{ fontSize: 11 }}>
        <b>{item.hour} ч.</b>
      </Text>}
      <Text themeFont={theme.fonts.ht2} style={{fontSize: 11}}>
      {(item.currentCountLab !== null && item.maxCountLab === null) && <b>{item.currentCountLab}</b>}
      {(item.currentCountLab === null && item.maxCountLab !== null) && <b>{item.maxCountLab} макс.</b>}
      {(item.currentCountLab !== null && item.maxCountLab !== null) && <b>{item.currentCountLab} / {item.maxCountLab} макс.</b>}
		  </Text>
    </ClassItem>
  );
});
