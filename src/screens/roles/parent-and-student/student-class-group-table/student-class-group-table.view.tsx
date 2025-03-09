
import { FC, memo, useCallback, useEffect, useState } from 'react';
import { useMediaQuery } from 'react-responsive';
import { theme } from '../../../../ui-kit/themes/theme';
import { WrapperMobile } from '../../../../components/wrapper-mobile';
import { WrapperDesktop } from '../../../../components/wrapper-desktop';
import { GradeInfo, ClassHeaderType, RedisKeyDataType, StatisticOfStudent, StudentClassGroupTableState, AttestationGradeInfo } from '../../../../store/reducers/roles/student-and-parent/student-class-group-table';
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
import { attendanceColorsForStudents, checkIsAttestationGrade } from '../../../../store/reducers/roles/teacher/class-group-control-slice';
import { useTableScroll } from '../../../../hooks/table-scroll-hook';
import { EmptyClassItem } from '../../teacher/subjects-parent/class-group-panel/class-group-panel.styled';

import RefreshLogo from '../../../../ui-kit/assets/refresh.svg';
import InfoLogo from '../../../../ui-kit/assets/info.svg';

export type StudentClassGroupTableViewProps = {
  role: "ROLE_STUDENT" | "ROLE_PARENTS";
  studentClassGroupTableState: StudentClassGroupTableState;
  goToClassGroups: () => void;
  setSelectedGrade: (gradeInfo: GradeInfo, onSuccess: () => void) => void;
  setSelectedClass: (value: ClassHeaderType, onSuccess: () => void) => void;
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
  const openClassControl = useCallback((value: ClassHeaderType) => {
    setSelectedClass(value, controlClassControlPopup);
  },[setSelectedClass, controlClassControlPopup])
  const closeClassControl = useCallback(() => {
    setSelectedClass({
      idClass: -1, 
      position: -1, 
      className: null,
      gradeId: -1,
      isAttestation: false,
      dateCreation: 'undefined'
    },controlClassControlPopup);
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
  openClassControl: (value: ClassHeaderType) => void;
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
      <Column style={{position: 'absolute', height: '100dvh', top: 0}}>
        <CircleLoading state={studentClassGroupTableState.loading}/>
      </Column> : <>
        <Surface>
        <Row style={{position: 'absolute'}}>
          <Button height={38.4} width={38.4} onClick={controlInfoWindow} variant='recomended' padding={0}>
              <Column style={{height: '100%'}}  verticalAlign='center' horizontalAlign='center'>
              <Image src={InfoLogo} width={15} height={15}/> 
              </Column>
            </Button>
            <Spacing themeSpace={10} variant='Row' />
            <Button height={38} width={38} onClick={reloadTable} 
              state={studentClassGroupTableState.loadingReloadTable} variant='recomended' padding={0}>
              <Column style={{height: '100%'}}  verticalAlign='center' horizontalAlign='center'>
              <Image src={RefreshLogo} width={15} height={15}/> 
              </Column>
            </Button>
          </Row>
          <Spacing themeSpace={10} variant='Column' />
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
        <Spacing variant='Column' themeSpace={85} />
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
          className={studentClassGroupTableState.selectedClass.className}
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
          Преподаватель: <span style={{fontFamily: theme.fonts.ht2.family}}>
            {studentClassGroupTableState.classGroup?.teacherName.replaceAll('_', ' ')}</span><br/>
          Описание: <span style={{fontFamily: theme.fonts.ht2.family}}>
            {studentClassGroupTableState.classGroup?.description}</span><br/>
        </Text>
      </Modal>
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
        <Column style={{position: 'absolute', height: '100dvh', top: 0}}>
          <CircleLoading state={studentClassGroupTableState.loading}/>
        </Column> : <>
        <Surface style={{width: 900}}>
          <Row style={{position: 'absolute'}}>
            <Button height={38.4} width={38.4} onClick={controlInfoWindow} variant='recomended' padding={0}>
              <Column style={{height: '100%'}}  verticalAlign='center' horizontalAlign='center'>
              <Image src={InfoLogo} width={15} height={15}/> 
              </Column>
            </Button>
            <Spacing themeSpace={10} variant='Row' />
            <Button height={38} width={38} onClick={reloadTable} 
              state={studentClassGroupTableState.loadingReloadTable} variant='recomended' padding={0}>
              <Column style={{height: '100%'}}  verticalAlign='center' horizontalAlign='center'>
              <Image src={RefreshLogo} width={15} height={15}/> 
              </Column>
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
          Преподаватель: <span style={{fontFamily: theme.fonts.ht2.family}}>
            {studentClassGroupTableState.classGroup?.teacherName.replaceAll('_', ' ')}</span><br/>
          Описание: <span style={{fontFamily: theme.fonts.ht2.family}}>
            {studentClassGroupTableState.classGroup?.description}</span><br/>
        </Text>
      </Popup>
      <Popup isActive={isClassControlPopup} closePopup={closeClassControl}>
        <QrcCodePart
          redisKeyData={studentClassGroupTableState.redisKeyData}
          loadingKey={studentClassGroupTableState.loadingKey}
          getKeyForQr={getKeyForQr}
          className={studentClassGroupTableState.selectedClass.className}
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
  className: string | null;
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
  className,
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
      {className !== null && <Spacing themeSpace={10} variant='Column' />}
      <Text themeFont={theme.fonts.ht1} style={{maxWidth: 200}} format='break' >
        {className}
      </Text>
      <Spacing themeSpace={15} variant='Column' />
      <Button 
        onClick={redisKeyData === null ? getKeyForQr : () => {}} 
        width={200} state={loadingKey}
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
	classesIds: ClassHeaderType[];
  onClickGrade: (value: GradeInfo) => void;
  openClassControl: (value: ClassHeaderType) => void;
  role: "ROLE_STUDENT" | "ROLE_PARENTS";
};
  
export const StudentsTable: FC<StudentsTableProps> = memo(({ 
  data,
  onClickGrade,
  openClassControl,
  role,
  classesIds,
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
      handleVerticalStart,
  } = useTableScroll(classesIds);

  return (
    <TableWrapper>
      {classesIds.length === 0 && <Spacing variant='Column' themeSpace={50} />}
      <TableHeader>
        <NameHeader isHide={isVerticalScrollNeeded}>
          <Text themeFont={theme.fonts.h3}>Имя студента</Text>
        </NameHeader>
        {classesIds.length !== 0 && (
          <HeaderClasses ref={horizontalScrollRef1}>
            {classesIds.map((item, index) => (
              <HeaderClassItem
                key={index} 
                onClick={(item.gradeId === -1 || role === 'ROLE_PARENTS') ? () => {} : () => openClassControl(item)}>
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
                  <Text themeFont={theme.fonts.ht2}>{item.student.surname}</Text>
                  <Text themeFont={theme.fonts.ht2}>{item.student.name}</Text>
                  <Text themeFont={theme.fonts.ht2}>{item.student.lastname}</Text>
                </StudentItem>
              ))}
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
          onClick={() => onClickGrade(item)}>
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
    onClick={() => {}}>
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
    </ClassItem>)
});