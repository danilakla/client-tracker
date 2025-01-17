
import { FC, memo, useCallback, useEffect, useRef, useState } from 'react';
import { useMediaQuery } from 'react-responsive';
import { theme } from '../../../../../ui-kit/themes/theme';
import { WrapperMobile } from '../../../../../components/wrapper-mobile';
import { WrapperDesktop } from '../../../../../components/wrapper-desktop';
import { Surface } from '../../../../../ui-kit/surface';
import { ClassesContainer, ClassesRow, ClassItem, ColorCircle, ColorCircleButton, ExistMark, HeaderClasses, HeaderClassItem, NameHeader, ScrollWrapper, StudentItem, StudentsContainer, Table, TableHeader, TableWrapper } from './class-group-panel.styled';
import { Text } from '../../../../../ui-kit/text';
import { Spacing } from '../../../../../ui-kit/spacing';
import { GradeInfo, StatisticOfStudent, СlassGroupControlState } from '../../../../../store/reducers/roles/teacher/class-group-control-slice';
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

  setSelectedClass: (value: {id: number, position: number}, onSuccess: () => void) => void;
  setExpirationOfQrCodeUpdateKey: (value: number) => void;
  setExpirationOfKey: (value: number) => void;
  setExpirationOfReview: (value: number) => void;

  activateKeyForClass: (onSuccess: () => void) => void;
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

  setExpirationOfQrCodeUpdateKey,
  setExpirationOfKey,
  setSelectedClass,
  setExpirationOfReview,

  activateKeyForClass
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

  // logic of qr-code-part

  const [isOpenGenerateKeyPopup, setIsOpenGenerateKeyPopup] = useState<boolean>(false);
  const controlGenerateKeyPopup = useCallback(() => {
    setIsOpenGenerateKeyPopup(!isOpenGenerateKeyPopup);
  },[isOpenGenerateKeyPopup])
  const [isOpenControlReviewPopup, setIsOpenControlReviewPopup] = useState<boolean>(false);
  const controlControlReviewPopup = useCallback(() => {
    setIsOpenControlReviewPopup(!isOpenControlReviewPopup);
  },[isOpenControlReviewPopup])
  const [isOpenQrCodePopup, setIsOpenQrCodePopup] = useState<boolean>(false);
  const controlQrCodePopup = useCallback(() => {
    setIsOpenQrCodePopup(!isOpenQrCodePopup);
  },[isOpenQrCodePopup])

  const [isClassControlPopup, setIsClassControlPopup] = useState<boolean>(false);
  const controlClassControlPopup = useCallback(() => {
    setIsClassControlPopup(!isClassControlPopup);
  },[isClassControlPopup])
  const openClassControlForStudents = useCallback((value: {id: number, position: number}) => {
    setSelectedClass(value, controlClassControlPopup);
  },[setSelectedClass, controlClassControlPopup])

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
          controlControlReviewPopup={controlControlReviewPopup}
          controlGenerateKeyPopup={controlGenerateKeyPopup}
          controlQrCodePopup={controlQrCodePopup}
          controlClassControlPopup={controlClassControlPopup}
          openClassControlForStudents={openClassControlForStudents}
          />) :
        (<ClassGroupPanelDesktopView
          openAddPopup={openAddPopup}
          controlClassControlPopup={controlClassControlPopup}
          goToTeacherClassGroupSubgroups={goToTeacherClassGroupSubgroups}
          teacherClassGroupControlState={teacherClassGroupControlState}
          setAttendance={setAttendance}
          openDeletePopup={openDeletePopup}
          controlControlReviewPopup={controlControlReviewPopup}
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
        stateQrCode={teacherClassGroupControlState.qrCodePopup.loadingQrCode} 
        stateStart={teacherClassGroupControlState.qrCodePopup.loadingStart} 
        stateStop={teacherClassGroupControlState.qrCodePopup.loadingStop} 
        isOpenQrCode={teacherClassGroupControlState.qrCodePopup.isOpenQrCode} 
        onStartClick={() => {}} onStopClick={() => {}}
        setTimeValue={setExpirationOfQrCodeUpdateKey} 
        timeValue={teacherClassGroupControlState.qrCodePopup.expiration} 
        closePopup={controlQrCodePopup} isActive={isOpenQrCodePopup}/>
      <ReviewControlPopup 
        onStartClick={() => {}} stateStart={teacherClassGroupControlState.reviewPopup.loadingStart}
        setTimeValue={setExpirationOfReview} 
        timeValue={teacherClassGroupControlState.reviewPopup.expiration} 
        closePopup={controlControlReviewPopup} isActive={isOpenControlReviewPopup}/>
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
  openClassControlForStudents: (value: {id: number, position: number}) => void;
  setGradeNumber: (value: string) => void;
  setDescription: (value: string) => void;
  setAttendance: (value: 0 | 1 | 2 | 3) => void;
  isOpenUpdateWindow: boolean;
  closeUpdateWindow: () => void;
  confirmUpdate: () => void;
  isClassControlPopup: boolean;
  openUpdateWindow: (value: GradeInfo) => void;
  controlClassControlPopup: () => void;

  controlQrCodePopup: () => void;
  controlControlReviewPopup: () => void;
  controlGenerateKeyPopup: () => void;
};

export const ClassGroupPanelMobileView: FC<LocalViewProps> = memo(({
  teacherClassGroupControlState,
  goToTeacherClassGroupSubgroups,
  openAddPopup,
  controlClassControlPopup,
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

  controlControlReviewPopup,
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
      <Modal isActive={isClassControlPopup} closeModal={controlClassControlPopup}>
        <Text themeFont={theme.fonts.h1}>
		  		Занятие {teacherClassGroupControlState.selectedClass.position}
		  	</Text>
        <Spacing themeSpace={25} variant='Column' />
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
          onClick={controlControlReviewPopup} 
          width={200}
          borderRaius={10}
          variant="primary" padding={[12,17]}>
          Пересмотр занятия
        </Button>
      </Modal>
    </WrapperMobile>
  );
});


export const ClassGroupPanelDesktopView: FC<LocalViewProps> = memo(({
  teacherClassGroupControlState,
  goToTeacherClassGroupSubgroups,
  controlClassControlPopup,
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

  controlControlReviewPopup,
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
      <Popup padding='25px' isActive={isClassControlPopup} closePopup={controlClassControlPopup}>
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
            onClick={controlControlReviewPopup} 
            width={240}
            borderRaius={10}
            variant="primary" padding={[12,17]}>
            Пересмотр занятия
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
  openClassControlForStudents: (value: {id: number, position: number}) => void;
  };
  
export const StudentsTable: FC<StudentsTableProps> = memo(({
	data,
	classesIds,
	onClickGrade,
  openClassControlForStudents
}) => {
  const container1Ref = useRef<HTMLDivElement>(null);
  const container2Ref = useRef<HTMLDivElement>(null);

  const isDragging = useRef(false);
  const startX = useRef(0);
  const startY = useRef(0);
  const scrollLeft = useRef(0);
  const scrollTop = useRef(0);

  const handleStart = (e: React.MouseEvent<HTMLDivElement> | React.TouchEvent<HTMLDivElement>) => {
    isDragging.current = true;

    if ("touches" in e) {
      startX.current = e.touches[0].pageX;
      startY.current = e.touches[0].pageY;
    } else {
      startX.current = e.pageX;
      startY.current = e.pageY;
    }

    const container = container1Ref.current!;
    scrollLeft.current = container.scrollLeft;
    scrollTop.current = container.scrollTop;

    document.body.style.cursor = "grabbing";
    document.body.style.userSelect = "none";
  };

  const handleMove = (e: React.MouseEvent<HTMLDivElement> | React.TouchEvent<HTMLDivElement>) => {
    if (!isDragging.current) return;

    e.preventDefault();

    let dx: number, dy: number;
    if ("touches" in e) {
      dx = e.touches[0].pageX - startX.current;
      dy = e.touches[0].pageY - startY.current;
    } else {
      dx = e.pageX - startX.current;
      dy = e.pageY - startY.current;
    }

    const container1 = container1Ref.current!;
    const container2 = container2Ref.current!;

    container1.scrollLeft = scrollLeft.current - dx;
    container1.scrollTop = scrollTop.current - dy;

    container2.scrollLeft = container1.scrollLeft;
    container2.scrollTop = container1.scrollTop;
  };

  const handleEnd = () => {
    isDragging.current = false;

    document.body.style.cursor = "default";
    document.body.style.userSelect = "auto";
  };

  const handleScroll = () => {
    const container1 = container1Ref.current!;
    const container2 = container2Ref.current!;

    container2.scrollTop = container1.scrollTop;
    container2.scrollLeft = container1.scrollLeft;
  };

  useEffect(() => {
    const container1 = container1Ref.current!;
    const container2 = container2Ref.current!;
  
    // Add non-passive event listeners
    const addListeners = (container: HTMLDivElement) => {
      container.addEventListener(
        "touchstart",
        handleStart as unknown as EventListener,
        { passive: false }
      );
      container.addEventListener(
        "touchmove",
        handleMove as unknown as EventListener,
        { passive: false }
      );
      container.addEventListener(
        "touchend",
        handleEnd as unknown as EventListener
      );
    };
  
    const removeListeners = (container: HTMLDivElement) => {
      container.removeEventListener(
        "touchstart",
        handleStart as unknown as EventListener
      );
      container.removeEventListener(
        "touchmove",
        handleMove as unknown as EventListener
      );
      container.removeEventListener(
        "touchend",
        handleEnd as unknown as EventListener
      );
    };
  
    addListeners(container1);
    addListeners(container2);
  
    return () => {
      removeListeners(container1);
      removeListeners(container2);
    };
  }, []);
	
	return (
	  <TableWrapper>
		  <TableHeader>
		    <NameHeader>
		  	<Text themeFont={theme.fonts.h3}>
		  	  Имя студента
		  	</Text>
		    </NameHeader>
		    {classesIds.length !== 0 && <HeaderClasses 
          ref={container1Ref}
          onScroll={handleScroll}
          onMouseDown={handleStart}
          onMouseMove={handleMove}
          onMouseUp={handleEnd}
          onMouseLeave={handleEnd}
          onTouchStart={handleStart}
          onTouchMove={handleMove}
          onTouchEnd={handleEnd}>
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
		  	  {data.map(item => <StudentItem>
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
		  	<ClassesContainer 
          ref={container2Ref}
          onScroll={handleScroll}
          onMouseDown={handleStart}
          onMouseMove={handleMove}
          onMouseUp={handleEnd}
          onMouseLeave={handleEnd}
          onTouchStart={handleStart}
          onTouchMove={handleMove}
          onTouchEnd={handleEnd}>
		  	  {data.map(item=> <ClassesRow>
		  		{item.grades.map((item) => 
          <ClassItem 
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
  setTimeValue: (value: number) => void;
  timeValue: number;
  onStartClick: () => void;
  onStopClick: () => void;
  isOpenQrCode: boolean;
  stateStart: "idle" | "loading" | "success" | "error";
  stateStop: "idle" | "loading" | "success" | "error";
  stateQrCode: "idle" | "loading" | "success" | "error";
};
    
export const QrCodeControlPopup: FC<QrCodeControlPopupProps> = memo(({
  isActive,
  isOpenQrCode,
  closePopup,
  timeValue,
  onStopClick,
  stateQrCode,
  stateStop,
  stateStart,
  onStartClick,
  setTimeValue
}) => {
  
  return (
    <Popup isActive={isActive} closePopup={() => {}}>
      <Column horizontalAlign='center'>
        <Text themeFont={theme.fonts.h2}>
          Время обновления: <span style={{width: 70, display: 'inline-block'}}><b> {timeValue} cек.</b> </span>
        </Text>
        <Spacing variant='Column' themeSpace={15}/>
        <RangeSlider
          minValue={1}
          maxValue={10}
          value={timeValue} 
          step={0.5}
          setValue={setTimeValue}/>
        <Spacing variant='Column' themeSpace={25}/>
        <Row>
          <Button 
            onClick={onStartClick} 
            width={100}
            borderRaius={15} state={stateStart}
            variant="primary" padding={[12,17]}>
            Старт
          </Button>
          <Spacing variant='Row' themeSpace={15}/>
          <Button 
            onClick={onStopClick} 
            width={100}
            borderRaius={15} state={stateStop}
            variant='attentive' padding={[12,17]}>
            Стоп
          </Button>
        </Row>
      </Column>
      <Spacing variant='Column' themeSpace={30}/>
      <Surface padding='10px' borderRadius='10px' borderColor={theme.colors.foreground} height={300} width={300}>
        <Column style={{height: '100%'}} horizontalAlign='center' verticalAlign='center'>
          {!isOpenQrCode && <Image src={ShieldLogo} width={250} height={250}/>}
        </Column>
      </Surface>
      <Spacing variant='Column' themeSpace={25}/>
      <Column horizontalAlign='center'>
        <Button 
          onClick={closePopup} 
          width={120}
          borderRaius={15} state={stateStop}
          variant='attentive' padding={[12,17]}>
          Закрыть 
        </Button>
      </Column>
    </Popup>
  );
});

export type ReviewControlPopupProps = {
  isActive: boolean;
  closePopup: () => void;
  setTimeValue: (value: number) => void;
  timeValue: number;
  onStartClick: () => void;
  stateStart: "idle" | "loading" | "success" | "error";
};

export const ReviewControlPopup: FC<ReviewControlPopupProps> = memo(({
  isActive,
  closePopup,
  stateStart,
  setTimeValue,
  onStartClick,
  timeValue
}) => {
  
  return (
    <Popup isActive={isActive} closePopup={closePopup}>
      <Column horizontalAlign='center'>
        <Text themeFont={theme.fonts.h2}>
          Время для пересмотра: <span style={{width: 70, display: 'inline-block'}}><b> {timeValue} cек.</b> </span>
        </Text>
        <Spacing variant='Column' themeSpace={15}/>
        <RangeSlider
          minValue={1}
          maxValue={10}
          value={timeValue} 
          step={0.5}
          setValue={setTimeValue}/>
        <Spacing variant='Column' themeSpace={25}/>
        <Row>
          <Button 
            onClick={onStartClick} 
            width={100}
            state={stateStart}
            borderRaius={15}
            variant="primary" padding={[12,17]}>
            Запустить
          </Button>
        </Row>
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




      