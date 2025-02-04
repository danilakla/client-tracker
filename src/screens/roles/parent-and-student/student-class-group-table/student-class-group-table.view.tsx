
import { FC, memo, useCallback, useEffect, useRef, useState } from 'react';
import { useMediaQuery } from 'react-responsive';
import { theme } from '../../../../ui-kit/themes/theme';
import { WrapperMobile } from '../../../../components/wrapper-mobile';
import { WrapperDesktop } from '../../../../components/wrapper-desktop';
import { GradeInfo, HeaderClassType, RedisKeyDataType, StatisticOfStudent, StudentClassGroupTableState } from '../../../../store/reducers/roles/student-and-parent/student-class-group-table';
import { Column } from '../../../../ui-kit/column';
import { CircleLoading } from '../../../../ui-kit/circle-loading';
import { Surface } from '../../../../ui-kit/surface';
import { Text } from '../../../../ui-kit/text';
import { Spacing } from '../../../../ui-kit/spacing';
import { ClassesContainer, ClassesRow, ClassItem, ColorCircle, ExistMark, HeaderClasses, HeaderClassItem, HorizontalSlider, HorizontalTrack, NameHeader, ScrollWrapper, StudentItem, StudentsContainer, Table, TableHeader, TableWrapper, VerticalSlider, VerticalTrack } from './student-class-group-table.styled';
import { Popup } from '../../../../ui-kit/popup';
import { Modal } from '../../../../ui-kit/modal';
import { ScrollView } from '../../../../ui-kit/scroll-view';
import { Button } from '../../../../ui-kit/button';
import ShieldLogo from '../../../../ui-kit/assets/security-shield.svg';
import { Image } from '../../../../ui-kit/image';
import { IDetectedBarcode, Scanner } from '@yudiel/react-qr-scanner';
import { ErrorPopup } from '../../../../ui-kit/error-popup';
import { SuccessfulPopup } from '../../../../ui-kit/successful-popup';
import { Row } from '../../../../ui-kit/row';
import { attendanceColorsForStudents } from '../../../../store/reducers/roles/teacher/class-group-control-slice';

export type StudentClassGroupTableViewProps = {
  role: "ROLE_STUDENT" | "ROLE_PARENTS";
  studentClassGroupTableState: StudentClassGroupTableState;
  goToClassGroups: () => void;
  setSelectedGrade: (gradeInfo: GradeInfo, onSuccess: () => void) => void;
  setSelectedClass: (value: HeaderClassType, onSuccess: () => void) => void;
  getKeyForQr: (onError: () => void) => void;
  clearRedisKey: () => void;
  askReview: (onSuccess: () => void, onError: () => void, closePrewPopup: () => void) => void;
  reloadTable: () => void;
  checkQrCode: (value: string, onSuccess: () => void, onError: () => void) => void;
};

export const StudentClassGroupTableView: FC<StudentClassGroupTableViewProps> = memo(({
  role,
  setSelectedGrade,
  getKeyForQr,
  goToClassGroups,
  clearRedisKey,
  reloadTable,
  setSelectedClass,
  checkQrCode,
  askReview,
  studentClassGroupTableState
}) => {
  const isMobile = useMediaQuery({maxWidth: theme.toMobileSize});

  const [isClassControlPopup, setIsClassControlPopup] = useState<boolean>(false);
  const controlClassControlPopup = useCallback(() => {
    setIsClassControlPopup(!isClassControlPopup);
  },[isClassControlPopup])
  const openClassControl = useCallback((value: HeaderClassType) => {
    setSelectedClass(value, controlClassControlPopup);
  },[setSelectedClass, controlClassControlPopup])
  const closeClassControl = useCallback(() => {
    setSelectedClass({id: -1, position: -1, gradeId: -1},controlClassControlPopup);
    clearRedisKey();
  },[setSelectedClass, controlClassControlPopup,clearRedisKey])

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'hidden') {
        clearRedisKey();
      } else if (document.visibilityState === 'visible') {
        clearRedisKey();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [clearRedisKey]);

  const [hasCameraAccess, setHasCameraAccess] = useState<boolean>(true);
  const setErrorAccessCamera = useCallback(() => {
    setHasCameraAccess(false);
  },[])

  const [isReviewSuccessPopup, setIsReviewSuccessPopup] = useState<boolean>(false);
  const openReviewSuccessPopup = useCallback(() => {
    setIsReviewSuccessPopup(true);
  },[])
  const closeReviewSuccessPopup = useCallback(() => {
    setIsReviewSuccessPopup(false);
    closeClassControl();
  },[setIsReviewSuccessPopup, closeClassControl])

  const [isOpenErrorReviewPopup , setIsOpenErrorReviewPopup] = useState<boolean>(false);
  const openErrorReviewPopup = useCallback(() => {
    setIsOpenErrorReviewPopup(true);
  },[])
  const closeErrorReviewPopup = useCallback(() => {
    setIsOpenErrorReviewPopup(false);
  },[])

  const [isOpenErrorQrCodePopup , setIsOpenErrorQrCodePopup] = useState<boolean>(false);
  const openErrorQrCodePopup = useCallback(() => {
    setIsOpenErrorQrCodePopup(true);
  },[])
  const closeErrorQrCodePopup = useCallback(() => {
    setIsOpenErrorQrCodePopup(false);
  },[])

  const [isOpenSuccessQrCodePopup, setIsOpenSuccessQrCodePopup] = useState<boolean>(false);
  const openSuccessQrCodePopup = useCallback(() => {
    setIsOpenSuccessQrCodePopup(true);
  },[])
  const closeSuccessQrCodePopup = useCallback(() => {
    setIsOpenSuccessQrCodePopup(false);
    closeClassControl();
  },[setIsOpenSuccessQrCodePopup, closeClassControl])

  const [isOpenConfirmReviewPopup, setIsOpenConfirmReviewPopup] = useState<boolean>(false);
  const controlConfirmReviewPopup = useCallback(() => {
    setIsOpenConfirmReviewPopup(!isOpenConfirmReviewPopup);
  },[isOpenConfirmReviewPopup])

  const [isOpenErrorKeyPopup, setIsOpenErrorKeyPopup] = useState<boolean>(false);
  const controlErrorKeyPopup = useCallback(() => {
    setIsOpenErrorKeyPopup(!isOpenErrorKeyPopup);
  },[isOpenErrorKeyPopup])

  const onGetKeyForQr = useCallback(() => {
    getKeyForQr(controlErrorKeyPopup);
  },[getKeyForQr, controlErrorKeyPopup])

  const onAskReview = useCallback(() => {
    askReview(openReviewSuccessPopup, openErrorReviewPopup, controlConfirmReviewPopup);
  },[askReview, openReviewSuccessPopup, openErrorReviewPopup, controlConfirmReviewPopup])

  const onHandleQrCode = useCallback((value: string) => {
    checkQrCode(value, openSuccessQrCodePopup, openErrorQrCodePopup);
  },[checkQrCode, openSuccessQrCodePopup, openErrorQrCodePopup])

  return (
    <>
      {isMobile ? 
        (<StudentClassGroupTableMobileView
          role={role}
          goToClassGroups={goToClassGroups}
		      setSelectedGrade={setSelectedGrade}
          closeClassControl={closeClassControl}
          openClassControl={openClassControl}
          onHandleQrCode={onHandleQrCode}
          hasCameraAccess={hasCameraAccess}
          setErrorAccessCamera={setErrorAccessCamera}
          isClassControlPopup={isClassControlPopup}
          getKeyForQr={onGetKeyForQr}
          reloadTable={reloadTable}
          onAskReview={controlConfirmReviewPopup}
          studentClassGroupTableState={studentClassGroupTableState}
          />) :
        (<StudentClassGroupTableDesktopView
          role={role}
          hasCameraAccess={hasCameraAccess}
          onAskReview={controlConfirmReviewPopup}
          setErrorAccessCamera={setErrorAccessCamera}
          reloadTable={reloadTable}
          closeClassControl={closeClassControl}
          onHandleQrCode={onHandleQrCode}
          openClassControl={openClassControl}
          getKeyForQr={onGetKeyForQr}
          isClassControlPopup={isClassControlPopup}
		      setSelectedGrade={setSelectedGrade}
          goToClassGroups={goToClassGroups}
          studentClassGroupTableState={studentClassGroupTableState}
          />)}
        <Popup isActive={isOpenConfirmReviewPopup} closePopup={controlConfirmReviewPopup}>
          <Column horizontalAlign='center'>
            <Text themeColor={theme.colors.gray} themeFont={theme.fonts.h2} align='center'> 
              Вы уверены, что хотите<br/>
               запросить пересмотр?
            </Text>
            <Spacing  themeSpace={25} variant='Column' />
            <Row>
              <Button 
                onClick={onAskReview} 
                state={studentClassGroupTableState.loadingReview} 
                variant='recomended' padding={[12,17]}>
                Запросить
              </Button>
              <Spacing variant='Row' themeSpace={20}/>
              <Button onClick={controlConfirmReviewPopup} variant='attentive' padding={[12,17]}>
                Отмена
              </Button>
            </Row>
          </Column>
        </Popup>
        <SuccessfulPopup
          text={<>
            Заявка на пересмотр<br/>
            успешно отправлена
          </>}
          isOpen={isReviewSuccessPopup}
          closePopup={closeReviewSuccessPopup}
        />
        <ErrorPopup
          isOpen={isOpenErrorReviewPopup}
          textError={<>
            Время пересмотра истекло <br/> или
             преподаватель не <br/>запустил ещё процесс
          </>}
          closePopup={closeErrorReviewPopup}
        />
        <ErrorPopup
          isOpen={isOpenErrorKeyPopup}
          textError={
            <>Срок действия ключа истек<br/>
              или ключа не был создан
            </>}
          closePopup={controlErrorKeyPopup}
        />
        <ErrorPopup
          isOpen={isOpenErrorQrCodePopup}
          textError={<>шО ТЫ ДЕЛАЕШЬ</>}
          closePopup={closeErrorQrCodePopup}
        />
        <SuccessfulPopup
          text={<>Присутствие подтверждено</>}
          isOpen={isOpenSuccessQrCodePopup}
          closePopup={closeSuccessQrCodePopup}
        />
      </>
  );
});

type LocalViewProps = {
  role: "ROLE_STUDENT" | "ROLE_PARENTS";
  studentClassGroupTableState: StudentClassGroupTableState;
  goToClassGroups: () => void;
  closeClassControl: () => void;
  onHandleQrCode: (value: string) => void;
  isClassControlPopup: boolean;
  reloadTable: () => void;
  onAskReview: () => void;
  hasCameraAccess: boolean | null;
  openClassControl: (value: HeaderClassType) => void;
  setSelectedGrade: (gradeInfo: GradeInfo, onSuccess: () => void) => void;
  getKeyForQr: () => void;
  setErrorAccessCamera: () => void;
};

export const StudentClassGroupTableMobileView: FC<LocalViewProps> = memo(({
  goToClassGroups,
  studentClassGroupTableState,
  getKeyForQr,
  onAskReview,
  setSelectedGrade,
  hasCameraAccess,
  reloadTable,
  setErrorAccessCamera,
  isClassControlPopup,
  onHandleQrCode,
  closeClassControl,
  openClassControl, 
  role
}) => {
  const [isOpenDescription, setIsOpenDescription] = useState<boolean>(false);
  const openDescription = useCallback((value: GradeInfo)=> {
    if(value.description != null)
      setSelectedGrade(value, () => setIsOpenDescription(true));
  },[setSelectedGrade])
  const closeDescription = useCallback(()=> {
    setIsOpenDescription(false);
  },[])
  
  const [isOpenInfo, setIsOpenInfo] = useState<boolean>(false);
  const controlInfoWindow = useCallback(()=> {
    setIsOpenInfo(!isOpenInfo);
  },[isOpenInfo])

  return (
    <WrapperMobile onBack={goToClassGroups} role={role} header='Таблица'>
      {studentClassGroupTableState.loading === 'loading' ?
      <Column style={{position: 'absolute', height: '100vh', top: 0}}>
        <CircleLoading state={studentClassGroupTableState.loading}/>
      </Column> : <>
        <Surface>
        <Row>
            <Button onClick={controlInfoWindow} borderRaius={10} variant='recomended' padding={[10, 10]}>
              Информация 🛈
            </Button>
            <Spacing themeSpace={15} variant='Row' />
            <Button onClick={reloadTable} borderRaius={10} state={studentClassGroupTableState.loadingReloadTable} variant='recomended' padding={[10, 10]}>
              Обновить
            </Button>
          </Row>
          <Spacing themeSpace={20} variant='Column' />
          {studentClassGroupTableState.studentsStatistics.length !== 0 ? 
            <StudentsTable 
              role={role}
              onClickGrade={openDescription} openClassControl={openClassControl}
              classesIds={studentClassGroupTableState.classesIds}
              data={studentClassGroupTableState.studentsStatistics}/> :
            <Text themeFont={theme.fonts.h2} themeColor={theme.colors.attentive}>
              Студенты не найдены
            </Text>}
          <Spacing themeSpace={20} variant='Column' />
        </Surface>
      </>}
      <Modal isActive={isOpenDescription} closeModal={closeDescription}> 
        <ScrollView style={{maxHeight: 450}}>
          <Text themeFont={theme.fonts.h3} themeColor={theme.colors.gray}>
            {studentClassGroupTableState.selectedGrade.description}
          </Text>
        </ScrollView>
      </Modal>
      <Modal isActive={isClassControlPopup} closeModal={closeClassControl}>
        <QrcCodePart
          redisKeyData={studentClassGroupTableState.redisKeyData}
          loadingKey={studentClassGroupTableState.loadingKey}
          getKeyForQr={getKeyForQr}
          loadingScan={studentClassGroupTableState.loadingScan}
          hasCameraAccess={hasCameraAccess}
          setErrorAccessCamera={setErrorAccessCamera}
          onHandleQrCode={onHandleQrCode}
          onAskReview={onAskReview}
          position={studentClassGroupTableState.selectedClass.position}/>
      </Modal>
      <Modal isActive={isOpenInfo} closeModal={controlInfoWindow} >
        <Text themeFont={theme.fonts.h2} style={{lineHeight: 1.7}}>
          Предмет: <span style={{fontFamily: theme.fonts.ht2.family}}>
            {studentClassGroupTableState.classGroup?.subjectName}</span><br/>
          Формат занятия: <span style={{fontFamily: theme.fonts.ht2.family}}>
            {studentClassGroupTableState.classGroup?.formatName}</span><br/>
        </Text>
      </Modal>
      {/* <CustomScrollWithDiv/> */}
    </WrapperMobile>
  );
});


export const StudentClassGroupTableDesktopView: FC<LocalViewProps> = memo(({
  goToClassGroups,
  studentClassGroupTableState,
  getKeyForQr,
  onAskReview,
  setSelectedGrade,
  reloadTable,
  hasCameraAccess,
  setErrorAccessCamera,
  isClassControlPopup,
  onHandleQrCode,
  closeClassControl,
  openClassControl, 
  role
}) => {
  const [isOpenDescription, setIsOpenDescription] = useState<boolean>(false);
  const openDescription = useCallback((value: GradeInfo)=> {
    if(value.description != null)
      setSelectedGrade(value, () => setIsOpenDescription(true));
  },[setSelectedGrade])
  const closeDescription = useCallback(()=> {
    setIsOpenDescription(false);
  },[])

  const [isOpenInfo, setIsOpenInfo] = useState<boolean>(false);
  const controlInfoWindow = useCallback(()=> {
    setIsOpenInfo(!isOpenInfo);
  },[isOpenInfo])

  return (
    <WrapperDesktop style={{padding: 'none'}}  onBack={goToClassGroups} role={role} header='Таблица' isCenter={true}>
	    {studentClassGroupTableState.loading === 'loading' ?
        <Column style={{position: 'absolute', height: '100vh', top: 0}}>
          <CircleLoading state={studentClassGroupTableState.loading}/>
        </Column> : <>
        <Surface style={{width: 900}}>
          <Row>
            <Button onClick={controlInfoWindow} borderRaius={10} variant='recomended' padding={[10, 10]}>
              Информация 🛈
            </Button>
            <Spacing themeSpace={15} variant='Row' />
            <Button onClick={reloadTable} borderRaius={10} state={studentClassGroupTableState.loadingReloadTable} variant='recomended' padding={[10, 10]}>
              Обновить
            </Button>
          </Row>
          <Spacing themeSpace={20} variant='Column' />
          {studentClassGroupTableState.studentsStatistics.length !== 0 ? 
            <StudentsTable
              role={role}
              onClickGrade={openDescription} openClassControl={openClassControl}
              classesIds={studentClassGroupTableState.classesIds}
              data={studentClassGroupTableState.studentsStatistics}/> :
            <Text themeFont={theme.fonts.h2} themeColor={theme.colors.attentive}>
              Студенты не найдены
            </Text>}
        </Surface>
      </>}
      <Popup isActive={isOpenDescription} closePopup={closeDescription}> 
        <Column style={{width: 440}}>
          <ScrollView style={{maxHeight: 500}}>
            <Text themeFont={theme.fonts.h3} themeColor={theme.colors.gray}>
              {studentClassGroupTableState.selectedGrade.description}
            </Text>
          </ScrollView>
        </Column>
      </Popup>
      <Popup style={{width: 440}} isActive={isOpenInfo} closePopup={controlInfoWindow} >
        <Text themeFont={theme.fonts.h2} style={{lineHeight: 1.7}}>
          Предмет: <span style={{fontFamily: theme.fonts.ht2.family}}>
            {studentClassGroupTableState.classGroup?.subjectName}</span><br/>
          Формат занятия: <span style={{fontFamily: theme.fonts.ht2.family}}>
            {studentClassGroupTableState.classGroup?.formatName}</span><br/>
        </Text>
      </Popup>
      <Popup isActive={isClassControlPopup} closePopup={closeClassControl}>
        <QrcCodePart
          redisKeyData={studentClassGroupTableState.redisKeyData}
          loadingKey={studentClassGroupTableState.loadingKey}
          getKeyForQr={getKeyForQr}
          loadingScan={studentClassGroupTableState.loadingScan}
          hasCameraAccess={hasCameraAccess}
          setErrorAccessCamera={setErrorAccessCamera}
          onHandleQrCode={onHandleQrCode}
          onAskReview={onAskReview}
          position={studentClassGroupTableState.selectedClass.position}/>
      </Popup>
    </WrapperDesktop>
  );
});

export type QrcCodePartProps = {
  position: number;
  redisKeyData: RedisKeyDataType | null;
  getKeyForQr: () => void;
  setErrorAccessCamera: () => void;
  onHandleQrCode: (value: string) => void;
  onAskReview: () => void;
  hasCameraAccess: boolean | null;
  loadingKey: "idle" | "loading" | "success" | "error";
  loadingScan: "loading" | "idle" | "success" | "error";
};
  
export const QrcCodePart: FC<QrcCodePartProps> = memo(({
  position,
  redisKeyData,
  getKeyForQr,
  setErrorAccessCamera,
  hasCameraAccess,
  onHandleQrCode,
  onAskReview,
  loadingKey,
  loadingScan
}) => {
	return (
	  <Column horizontalAlign='center'>
      <Text themeFont={theme.fonts.h1}>
        Занятие {position}
      </Text>
      <Spacing themeSpace={15} variant='Column' />
      <Button 
        onClick={redisKeyData === null ? getKeyForQr : () => {}} 
        width={200} state={loadingKey}
        borderRaius={10}
        variant={redisKeyData === null ? 'primary' : 'recomended'} padding={[12,17]}>
        {redisKeyData === null ? "Получить ключ" : "✓"}
      </Button>
      <Spacing themeSpace={15} variant='Column' />
      <Surface 
        padding='10px' borderRadius='10px' 
        borderColor={theme.colors.foreground} height={357} width={300}>
          {redisKeyData === null ? (
            <Column style={{height: '100%', position: 'relative'}} horizontalAlign='center' verticalAlign='center'>
              <Image src={ShieldLogo} width={250} height={250}/>
            </Column>) : (<>
            <Surface 
              padding='0px' 
              borderColor={theme.colors.surface} 
              style={{borderRadius: 10, overflow: 'hidden', borderWidth: 5}}>
                {hasCameraAccess ? loadingScan === 'loading' ? 
                  (<Column style={{height: 268, position: 'relative'}} horizontalAlign='center' verticalAlign='center'>
                    <CircleLoading state={'loading'}/>
                  </Column>) : 
                (<Scanner 
                onError={() => setErrorAccessCamera()}
                styles={{
                video: {
                  height: 268,
                  width: 268
                },
                container: {
                  height: 268,
                  width: 268
                }
              }} onScan={(result: IDetectedBarcode[]) => onHandleQrCode(result[0].rawValue)} />)
                : 
              <Column style={{height: 268}} horizontalAlign='center' verticalAlign='center'>
                <Text align='center' themeFont={theme.fonts.h3} themeColor={theme.colors.gray}>
                  При подключении к камере произошла ошибка, перезагрузите страницу или проверте доступ
                </Text>
            </Column>}
            </Surface>
            <Spacing themeSpace={15} variant='Column' />
            <Column horizontalAlign='center'>
              <Button 
                onClick={onAskReview} 
                width={270}
                borderRaius={10}
                variant="primary" padding={[12,17]}>
                Запросить пересмотр
              </Button>
            </Column>
            </>)}
      </Surface>
    </Column>
	);
});

export type StudentsTableProps = {
	data: StatisticOfStudent[];
	classesIds: HeaderClassType[];
  onClickGrade: (value: GradeInfo) => void;
  openClassControl: (value: HeaderClassType) => void;
  role: "ROLE_STUDENT" | "ROLE_PARENTS";
};
  
export const StudentsTable: FC<StudentsTableProps> = memo(({ 
  data,
  onClickGrade,
  openClassControl,
  role,
  classesIds,
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

  useEffect(() => {
    updateHorizontalSliderSize();
    updateHorizontalSliderPosition();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [classesIds]);

  return (
    <TableWrapper>
      <TableHeader>
        <NameHeader isHide={isVerticalScrollNeeded}>
          <Text themeFont={theme.fonts.h3}>Имя студента</Text>
        </NameHeader>
        {classesIds.length !== 0 && (
          <HeaderClasses ref={horizontalScrollRef1}>
            {classesIds.map((item, index) => (
              <HeaderClassItem
                key={index} 
                onClick={(item.gradeId === -1 || role === 'ROLE_PARENTS') ? () => {} : () => openClassControl(item)}
              >
                <Text themeFont={theme.fonts.h3}>Занятие {index + 1}</Text>
              </HeaderClassItem>
            ))}
          </HeaderClasses>
        )}
      </TableHeader>
      <Spacing themeSpace={10} variant="Column" />
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
              {data.map((item, index) => (
                <StudentItem key={index}>
                  <Text themeFont={theme.fonts.ht2}>{item.student.lastname}</Text>
                  <Text themeFont={theme.fonts.ht2}>{item.student.name}</Text>
                  <Text themeFont={theme.fonts.ht2}>{item.student.surname}</Text>
                </StudentItem>
              ))}
            </StudentsContainer>
            <ClassesContainer ref={horizontalScrollRef2}>
              {data.map((item, index) => (
                <ClassesRow key={index}>
                  {item.grades.map((grade, gradeIndex) => (
                    grade.idStudentGrate !== -1 ? 
                    <ClassItem
                      key={gradeIndex}
                      onClick={() => onClickGrade(grade)}
                    >
                      {grade.description !== null && <ExistMark />}
                      {grade.grade !== null && (
                        <Text themeFont={theme.fonts.ht2}>{grade.grade}</Text>
                      )}
                      <ColorCircle
                        color={attendanceColorsForStudents[grade.attendance]}
                      />
                    </ClassItem> : 
                    <ClassItem style={{borderRight: 0, backgroundColor: '#d3d3d376'}} key={index}
                      onClick={() => {}} >
                    </ClassItem>
                  ))}
                </ClassesRow>
              ))}
            </ClassesContainer>
          </Table>
        </ScrollWrapper>
      </Row>
      {isHorizontalScrollNeeded && 
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
      </Column>}
    </TableWrapper>
  );
});
