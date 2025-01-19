
import { FC, memo, useCallback, useEffect, useRef, useState } from 'react';
import { useMediaQuery } from 'react-responsive';
import { theme } from '../../../../../ui-kit/themes/theme';
import { WrapperMobile } from '../../../../../components/wrapper-mobile';
import { WrapperDesktop } from '../../../../../components/wrapper-desktop';
import { Surface } from '../../../../../ui-kit/surface';
import { ClassesContainer, ClassesRow, ClassItem, ColorCircle, ColorCircleButton, ExistMark, HeaderClasses, HeaderClassItem, NameHeader, ScrollWrapper, StudentItem, StudentsContainer, Table, TableHeader, TableWrapper } from './class-group-panel.styled';
import { Text } from '../../../../../ui-kit/text';
import { Spacing } from '../../../../../ui-kit/spacing';
import { GradeInfo, HeaderClassType, QrCodeDataType, StatisticOfStudent, СlassGroupControlState } from '../../../../../store/reducers/roles/teacher/class-group-control-slice';
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

export type ClassGroupPanelViewProps = {
  teacherClassGroupControlState: СlassGroupControlState;
  goToTeacherClassGroupSubgroups: () => void;
  setSelectedGrade: (gradeInfo: GradeInfo, onSuccess: () => void) => void;
  updateGrade: (onSuccess: () => void) => void;
  deleteClass: (onSuccess: () => void) => void;
  createClass: (onSuccess: () => void) => void;
  setGradeNumber: (value: string) => void;
  setDescription: (value: string) => void;
  setAttendance: (value: 0 | 1 | 2 | 3) => void;

  setSelectedClass: (value: HeaderClassType, onSuccess: () => void) => void;
  setExpirationOfRefresh: (value: number) => void
  setExpirationOfKey: (value: number) => void;
  setExpirationOfReview: (value: number) => void;

  activateKeyForClass: (onSuccess: () => void) => void;

  clearQrCodeData: () => void;
  createQrCode: () => void;
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

  setExpirationOfRefresh,
  setExpirationOfKey,
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
    if(isOpenGenerateKeyPopup) setExpirationOfKey(90); 
    setIsOpenGenerateKeyPopup(!isOpenGenerateKeyPopup);
  },[setExpirationOfKey, isOpenGenerateKeyPopup])
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

  const confirmActivateKeyForClass = useCallback(() => {
    activateKeyForClass(controlGenerateKeyPopup);
  },[activateKeyForClass, controlGenerateKeyPopup])

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
          setGradeNumber={setGradeNumber}
          openUpdateWindow={openUpdateWindow}
          closeUpdateWindow={closeUpdateWindow}
          openDeletePopup={openDeletePopup}
          confirmUpdate={confirmUpdate}
          isClassControlPopup={isClassControlPopup}
          isOpenUpdateWindow={isOpenUpdateWindow}
          controlGenerateKeyPopup={controlGenerateKeyPopup}
          controlQrCodePopup={controlQrCodePopup}
          closeClassControlForStudents={closeClassControlForStudents}
          openClassControlForStudents={openClassControlForStudents}
          />) :
        (<ClassGroupPanelDesktopView
          openAddPopup={openAddPopup}
          closeClassControlForStudents={closeClassControlForStudents}
          goToTeacherClassGroupSubgroups={goToTeacherClassGroupSubgroups}
          teacherClassGroupControlState={teacherClassGroupControlState}
          setAttendance={setAttendance}
          openDeletePopup={openDeletePopup}
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
        setTimeValue={setExpirationOfKey} 
        timeValue={teacherClassGroupControlState.generateKeyPopup.expiration} 
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
  setDescription: (value: string) => void;
  setAttendance: (value: 0 | 1 | 2 | 3) => void;
  isOpenUpdateWindow: boolean;
  closeUpdateWindow: () => void;
  confirmUpdate: () => void;
  isClassControlPopup: boolean;
  openUpdateWindow: (value: GradeInfo) => void;
  closeClassControlForStudents: () => void;

  controlQrCodePopup: () => void;
  controlGenerateKeyPopup: () => void;
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
  confirmUpdate,

  controlGenerateKeyPopup,
  controlQrCodePopup
}) => {

  return (
    <WrapperMobile onBack={goToTeacherClassGroupSubgroups} role='ROLE_TEACHER' header='Таблица'>
      {teacherClassGroupControlState.loading === 'loading' ?
      <Column style={{position: 'absolute', height: '100vh', top: 0}}>
        <CircleLoading state={teacherClassGroupControlState.loading}/>
      </Column> : <>
        <Surface>
          <Text themeFont={theme.fonts.h2} style={{lineHeight: 1.7}}>
            Предмет: <span style={{fontFamily: theme.fonts.ht2.family}}>
              {teacherClassGroupControlState.initData?.classGroup.subjectName}</span><br/>
            Формат занятия: <span style={{fontFamily: theme.fonts.ht2.family}}>
              {teacherClassGroupControlState.initData?.classGroup.nameClassFormat}</span><br/>
            Подгруппа: <span style={{fontFamily: theme.fonts.ht2.family}}>
              {teacherClassGroupControlState.initData?.subgroup.subgroupNumber}</span>
          </Text>
          <Spacing themeSpace={20} variant='Column' />
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
        <Column horizontalAlign='center'>
          <Column style={{maxWidth: 440}} horizontalAlign='center'>
            <Text themeColor={theme.colors.gray} themeFont={theme.fonts.h3}>
              Присутствие
            </Text>
            <Spacing variant='Column' themeSpace={15}/>
            <Row style={{gap: 25, width: '100%'}} horizontalAlign='center'>
              <ColorCircleButton 
                variant={0} onClick={() => setAttendance(0)}
                isSelected={teacherClassGroupControlState.selectedGrade.attendance === 0} />
              <ColorCircleButton 
                variant={1} onClick={() => setAttendance(1)}
                isSelected={teacherClassGroupControlState.selectedGrade.attendance === 1} />
              <ColorCircleButton 
                variant={2} onClick={() => setAttendance(2)}
                isSelected={teacherClassGroupControlState.selectedGrade.attendance === 2} />
              <ColorCircleButton 
                variant={3} onClick={() => setAttendance(3)}
                isSelected={teacherClassGroupControlState.selectedGrade.attendance === 3} />
            </Row>
          </Column>
          <Spacing themeSpace={25} variant='Column' />
          <Input 
            header='Оценка' 
            placeholder='9' error={teacherClassGroupControlState.errors['gradeNumberError']}
            value={teacherClassGroupControlState.selectedGrade.grade?.toString() || ''} setValue={setGradeNumber}/>
          <Spacing themeSpace={25} variant='Column' />
          <Textarea
            value={teacherClassGroupControlState.selectedGrade.description || ''}
            placeholder='Примечание...' 
            height={120} setValue={setDescription}
            error={teacherClassGroupControlState.errors['descriptionError']}
            header='Примечание' />
          <Spacing themeSpace={25} variant='Column' />
          <Row>
            <Button 
              onClick={confirmUpdate} 
              state={teacherClassGroupControlState.loadingUpdate} 
              variant='recomended' padding={[12,17]}>
              Сохранить
            </Button>
            <Spacing variant='Row' themeSpace={20}/>
            <Button onClick={closeUpdateWindow} variant='attentive' padding={[12,17]}>
              Отмена
            </Button>
          </Row>
        </Column>
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

  controlGenerateKeyPopup,
  controlQrCodePopup
}) => {

  return (
    <WrapperDesktop style={{padding: 'none'}} onBack={goToTeacherClassGroupSubgroups} role='ROLE_TEACHER' header='Таблица' isCenter={true}>
      {teacherClassGroupControlState.loading === 'loading' ?
      <Column style={{position: 'absolute', height: '100vh', top: 0}}>
        <CircleLoading state={teacherClassGroupControlState.loading}/>
      </Column> : <>
        <Surface style={{width: 900}}>
          <Text themeFont={theme.fonts.h2} style={{lineHeight: 1.7}}>
            Предмет: <span style={{fontFamily: theme.fonts.ht2.family}}>
              {teacherClassGroupControlState.initData?.classGroup.subjectName}</span><br/>
            Формат занятия: <span style={{fontFamily: theme.fonts.ht2.family}}>
              {teacherClassGroupControlState.initData?.classGroup.nameClassFormat}</span><br/>
            Подгруппа: <span style={{fontFamily: theme.fonts.ht2.family}}>
              {teacherClassGroupControlState.initData?.subgroup.subgroupNumber}</span>
          </Text>
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
        <Column style={{width: 440}} horizontalAlign='center'>
          <Column style={{maxWidth: 440}} horizontalAlign='center'>
            <Text themeColor={theme.colors.gray} themeFont={theme.fonts.h3}>
              Присутствие
            </Text>
            <Spacing variant='Column' themeSpace={15}/>
            <Row style={{gap: 25, width: '100%'}} horizontalAlign='center'>
              <ColorCircleButton 
                variant={0} onClick={() => setAttendance(0)}
                isSelected={teacherClassGroupControlState.selectedGrade.attendance === 0} />
              <ColorCircleButton 
                variant={1} onClick={() => setAttendance(1)}
                isSelected={teacherClassGroupControlState.selectedGrade.attendance === 1} />
              <ColorCircleButton 
                variant={2} onClick={() => setAttendance(2)}
                isSelected={teacherClassGroupControlState.selectedGrade.attendance === 2} />
              <ColorCircleButton 
                variant={3} onClick={() => setAttendance(3)}
                isSelected={teacherClassGroupControlState.selectedGrade.attendance === 3} />
            </Row>
          </Column>
          <Spacing themeSpace={25} variant='Column' />
          <Input 
            header='Оценка' 
            placeholder='9' error={teacherClassGroupControlState.errors['gradeNumberError']}
            value={teacherClassGroupControlState.selectedGrade.grade?.toString() || ''} setValue={setGradeNumber}/>
          <Spacing themeSpace={25} variant='Column' />
          <Textarea
            value={teacherClassGroupControlState.selectedGrade.description || ''}
            placeholder='Примечание...' 
            height={120} setValue={setDescription}
            error={teacherClassGroupControlState.errors['descriptionError']}
            header='Примечание' />
          <Spacing themeSpace={25} variant='Column' />
          <Row>
            <Button 
              onClick={confirmUpdate}
              state={teacherClassGroupControlState.loadingUpdate} 
              variant='recomended' padding={[12,17]}>
              Сохранить
            </Button>
            <Spacing variant='Row' themeSpace={20}/>
            <Button onClick={closeUpdateWindow} variant='attentive' padding={[12,17]}>
              Отмена
            </Button>
          </Row>
        </Column>
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
        </Column>
      </Popup>
    </WrapperDesktop>
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
	return (
	  <TableWrapper>
		  <TableHeader>
		    <NameHeader>
		  	<Text themeFont={theme.fonts.h3}>
		  	  Имя студента
		  	</Text>
		    </NameHeader>
		    {classesIds.length !== 0 && <HeaderClasses>
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
		  <ScrollWrapper>
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
		  	<ClassesContainer>
		  	  {data.map((item, index)=> <ClassesRow key={index}>
		  		{item.grades.map((item, index) => 
          <ClassItem key={index}
		  		  onClick={() => onClickGrade(item)} >
		  		  {item.description !== null && <ExistMark/>}
		  		  {item.grade !== null && <Text themeFont={theme.fonts.ht2}>
		  			{item.grade}
		  		  </Text>}
		  		  <ColorCircle variant={item.attendance} />
		  		</ClassItem>)}
		  	  </ClassesRow>)}
		  	</ClassesContainer>
		    </Table>
		  </ScrollWrapper>
	  </TableWrapper>
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
  },[]);

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
  setTimeValue: (value: number) => void;
  timeValue: number;
  onActivateClick: () => void;
  stateActivate: "idle" | "loading" | "success" | "error";
};
    
export const GenerateKeyPopup: FC<GenerateKeyPopupProps> = memo(({
  isActive,
  closePopup,
  setTimeValue,
  stateActivate,
  onActivateClick,
  timeValue,
}) => {
  
  return (
    <Popup isActive={isActive} closePopup={closePopup}>
      <Text themeFont={theme.fonts.h2}>
        Срок действия: <span style={{width: 110, display: 'inline-block'}}><b> {timeValue} cекунд</b> </span>
      </Text>
      <Spacing variant='Column' themeSpace={15}/>
      <RangeSlider value={timeValue} setValue={setTimeValue}/>
      <Spacing variant='Column' themeSpace={30}/>
      <Column horizontalAlign='center'>
        <Button 
          onClick={onActivateClick} 
          width={140}
          borderRaius={15} state={stateActivate}
          variant="primary" padding={[12,17]}>
          Активировать
        </Button>
      </Column>
    </Popup>
  );
});




      