
import { FC, memo, useCallback, useEffect, useState } from 'react';
import { useMediaQuery } from 'react-responsive';
import { theme } from '../../../../ui-kit/themes/theme';
import { WrapperMobile } from '../../../../components/wrapper-mobile';
import { WrapperDesktop } from '../../../../components/wrapper-desktop';
import { GradeInfo, ClassHeaderType, RedisKeyDataType, StatisticOfStudent, StudentClassGroupTableState, AttestationGradeInfo, decryptAES } from '../../../../store/reducers/roles/student-and-parent/student-class-group-table';
import { Column } from '../../../../ui-kit/column';
import { CircleLoading } from '../../../../ui-kit/circle-loading';
import { Surface } from '../../../../ui-kit/surface';
import { Text } from '../../../../ui-kit/text';
import { Spacing } from '../../../../ui-kit/spacing';
import { ClassesContainer, ClassesRow, ClassItem, ColorCircle, ExistMark, ScrollWrapper, StudentItem, StudentsContainer, Table, TableWrapper, VerticalSlider, VerticalTrack } from './student-class-group-table.styled';
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
import { ContainerWrapper, EmptyClassItem } from '../../teacher/subjects-parent/class-group-panel/class-group-panel.styled';
import bookLogo from '../../../../ui-kit/assets/book.svg';
import RefreshLogo from '../../../../ui-kit/assets/refresh.svg';
import InfoLogo from '../../../../ui-kit/assets/info.svg';
import { RulesText } from '../../dean/workshop-parent/class-table/class-table.view';
import { Line } from '../../../../ui-kit/line';

export type StudentClassGroupTableViewProps = {
  role: "ROLE_STUDENT" | "ROLE_PARENTS";
  fioOfStudent: string;
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
  fioOfStudent,
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
          fioOfStudent={fioOfStudent}
          isClassControlPopup={isClassControlPopup}
          getKeyForQr={onGetKeyForQr}
          reloadTable={reloadTable}
          onAskReview={controlConfirmReviewPopup}
          studentClassGroupTableState={studentClassGroupTableState}
          />) :
        (<StudentClassGroupTableDesktopView
          role={role}
          onAskReview={controlConfirmReviewPopup}
          reloadTable={reloadTable}
          fioOfStudent={fioOfStudent}
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
              или ключ не был создан
            </>}
          closePopup={controlErrorKeyPopup}
        />
        <ErrorPopup
          isOpen={isOpenErrorQrCodePopup}
          textError={<>Время действия <br/>  
          QR-кода истекло
          </>}
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
  fioOfStudent: string;
  onAskReview: () => void;
  openClassControl: (value: ClassHeaderType) => void;
  setSelectedGrade: (gradeInfo: GradeInfo, onSuccess: () => void) => void;
  getKeyForQr: () => void;
};

export const StudentClassGroupTableMobileView: FC<LocalViewProps> = memo(({
  goToClassGroups,
  studentClassGroupTableState,
  getKeyForQr,
  fioOfStudent,
  onAskReview,
  setSelectedGrade,
  reloadTable,
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

  const [isOpenRules, setIsOpenRules] = useState<boolean>(false);
  const closeRules = useCallback(() => {
    setIsOpenRules(false);
  },[])
  const openRules = useCallback(() => {
    setIsOpenRules(true);
  },[])

  return (
    <WrapperMobile onBack={goToClassGroups} role={role} header={studentClassGroupTableState.classGroup?.description}>
      {studentClassGroupTableState.loading === 'loading' ?
      <Column style={{position: 'absolute', height: '100dvh', top: 0}}>
        <CircleLoading state={studentClassGroupTableState.loading}/>
      </Column> : <ContainerWrapper isDesktop={false}>
        <Row>
          <Surface style={{width: 'fit-content'}}>
          <Row style={{position: 'absolute'}}>
            <Button height={38.4} width={38.4} onClick={openRules} variant='recomended' padding={0}>
              <Column style={{height: '100%'}}  verticalAlign='center' horizontalAlign='center'>
                <Image src={bookLogo} width={20} height={20}/> 
              </Column>
            </Button>
            <Spacing themeSpace={10} variant='Row' />
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
          <Spacing themeSpace={60} variant='Column' />
          <Text themeFont={theme.fonts.h3} >
          {fioOfStudent}
          </Text>
          <Spacing themeSpace={15} variant='Column' />
          {studentClassGroupTableState.classesIds.length !== 0 ? 
            <StudentsTable 
              role={role}
              onClickGrade={openDescription} openClassControl={openClassControl}
              classesIds={studentClassGroupTableState.classesIds}
              data={studentClassGroupTableState.studentsStatistics}/> :
            <Text themeFont={theme.fonts.h2} themeColor={theme.colors.attentive}>
              Занятия не найдены
            </Text>}
        </Surface>
        </Row>
        <Spacing variant='Column' themeSpace={85} />
      </ContainerWrapper>}
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
      <Modal isActive={isOpenRules} closeModal={closeRules} >
        <RulesText/>
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
  fioOfStudent,
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
        </Column> : <ContainerWrapper isDesktop={true}>
        <Row>
        <Surface>
          <Row style={{position: 'absolute'}} verticalAlign='center'>
            <Button height={38} width={38} onClick={reloadTable} 
              state={studentClassGroupTableState.loadingReloadTable} variant='recomended' padding={0}>
              <Column style={{height: '100%'}}  verticalAlign='center' horizontalAlign='center'>
              <Image src={RefreshLogo} width={15} height={15}/> 
              </Column>
            </Button>
            <Spacing themeSpace={15} variant='Row' />
            <Text themeFont={theme.fonts.h3} >
              {fioOfStudent}
            </Text>
          </Row>
          <Spacing themeSpace={60} variant='Column' />
          
          <Spacing themeSpace={15} variant='Column' />
          {studentClassGroupTableState.classesIds.length !== 0 ? 
            <StudentsTable
              role={role}
              onClickGrade={openDescription} openClassControl={openClassControl}
              classesIds={studentClassGroupTableState.classesIds}
              data={studentClassGroupTableState.studentsStatistics}/> :
            <Text themeFont={theme.fonts.h2} themeColor={theme.colors.attentive}>
              Занятия не найдены
            </Text>}
        </Surface>
        <Spacing themeSpace={25} variant='Row' />
        <Surface>
          <Text themeFont={theme.fonts.h2} style={{lineHeight: 1.7}}>
            Предмет: <span style={{fontFamily: theme.fonts.ht2.family}}>
              {studentClassGroupTableState.classGroup?.subjectName}</span><br/>
            Формат занятия: <span style={{fontFamily: theme.fonts.ht2.family}}>
              {studentClassGroupTableState.classGroup?.formatName}</span><br/>
            Преподаватель: <span style={{fontFamily: theme.fonts.ht2.family}}>
              {studentClassGroupTableState.classGroup?.teacherName.replaceAll('_', ' ')}</span><br/>
            Описание: <span style={{fontFamily: theme.fonts.ht2.family}}>
              {studentClassGroupTableState.classGroup?.description}</span><br/>
            <Line style={{borderRadius: 2, marginTop: 5, marginBottom: 5}} height={2} color={'#52526660'}/>
            <RulesText/>
          </Text>
        </Surface>
        </Row>
      </ContainerWrapper>}
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
        
      </Popup>
      <Popup isActive={isClassControlPopup} closePopup={closeClassControl}>
        <QrcCodePart
          redisKeyData={studentClassGroupTableState.redisKeyData}
          loadingKey={studentClassGroupTableState.loadingKey}
          getKeyForQr={getKeyForQr}
          className={studentClassGroupTableState.selectedClass.className}
          loadingScan={studentClassGroupTableState.loadingScan}
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
  onHandleQrCode: (value: string) => void;
  onAskReview: () => void;
  loadingKey: "idle" | "loading" | "success" | "error";
  loadingScan: "loading" | "idle" | "success" | "error";
};
  
export const QrcCodePart: FC<QrcCodePartProps> = memo(({
  position,
  redisKeyData,
  getKeyForQr,
  className,
  onHandleQrCode,
  onAskReview,
  loadingKey,
  loadingScan
}) => {
  const secretKey = process.env.REACT_APP_SECRET_KEY || "default-secret-key";
  
  const decryptText = useCallback((encryptedText: string): string => {
    return decryptAES(encryptedText, secretKey);
  }, [secretKey]);

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
        padding='0px' borderRadius='10px' style={{boxSizing: 'content-box'}}
        borderColor={theme.colors.foreground} height={372} width={300}>
          {redisKeyData === null ? (
            <Column style={{height: '100%', position: 'relative'}} horizontalAlign='center' verticalAlign='center'>
              <Image src={ShieldLogo} width={300} height={300}/>
            </Column>) : (<>
            <Surface 
              padding='0px' 
              borderColor={theme.colors.surface} 
              style={{borderRadius: 10, margin: 0, overflow: 'hidden', borderWidth: 0}}>
                {loadingScan === 'loading' ? 
                  (<Column style={{height: 300, position: 'relative'}} horizontalAlign='center' verticalAlign='center'>
                    <CircleLoading state={'loading'}/>
                  </Column>) : 
                (<Scanner 
                components={{zoom: true}}
                sound={false}
                styles={{
                video: {
                  height: 300,
                  width: 300,
                },
                container: {
                  height: 300,
                  width: 300
                }
              }} onScan={(result: IDetectedBarcode[]) => onHandleQrCode(decryptText(result[0].rawValue))} />)}
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
      isVerticalScrollNeeded,
      verticalTrackRef,
      verticalScrollRef,
      verticalSliderRef,
      handleVerticalStart,
      updateVerticalSliderPosition,
      updateVerticalSliderSize
  } = useTableScroll(classesIds);

  useEffect(() => {
    updateVerticalSliderPosition();
    updateVerticalSliderSize();
  }, [classesIds, updateVerticalSliderPosition, updateVerticalSliderSize]);

  return (
    <TableWrapper>
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
              {classesIds.map((item, index) => (
                <StudentItem key={index}
                  onClick={(item.gradeId === -1 || role === 'ROLE_PARENTS') ? () => {} : () => openClassControl(item)}>
                  <Text themeFont={theme.fonts.h3} >
                    {!item.isAttestation ? 
                    <>Занятие {item.position}</> : <span style={{color: theme.colors.attentive}}>Аттестация</span>}
                  </Text>
                  {item.className !== null && <Spacing variant='Row' themeSpace={5} />}
                  <Text themeFont={theme.fonts.ml} format='hide' style={{maxHeight: 100}}>
                    {item.className}
                  </Text>
                </StudentItem>
              ))}
            </StudentsContainer>
            <ClassesContainer>
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