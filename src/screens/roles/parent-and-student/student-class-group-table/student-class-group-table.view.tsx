
import { FC, memo, useCallback, useEffect, useState } from 'react';
import { useMediaQuery } from 'react-responsive';
import { theme } from '../../../../ui-kit/themes/theme';
import { WrapperMobile } from '../../../../components/wrapper-mobile';
import { WrapperDesktop } from '../../../../components/wrapper-desktop';
import { GradeInfo, HeaderClassType, StatisticOfStudent, StudentClassGroupTableState } from '../../../../store/reducers/roles/student-and-parent/student-class-group-table';
import { Column } from '../../../../ui-kit/column';
import { CircleLoading } from '../../../../ui-kit/circle-loading';
import { Surface } from '../../../../ui-kit/surface';
import { Text } from '../../../../ui-kit/text';
import { Spacing } from '../../../../ui-kit/spacing';
import { ClassesContainer, ClassesRow, ClassItem, ColorCircle, ExistMark, HeaderClasses, HeaderClassItem, NameHeader, ScrollWrapper, StudentItem, StudentsContainer, Table, TableHeader, TableWrapper } from './student-class-group-table.styled';
import { Popup } from '../../../../ui-kit/popup';
import { Modal } from '../../../../ui-kit/modal';
import { ScrollView } from '../../../../ui-kit/scroll-view';
import { Button } from '../../../../ui-kit/button';
import ShieldLogo from '../../../../ui-kit/assets/security-shield.svg';
import { Image } from '../../../../ui-kit/image';
import { Scanner } from '@yudiel/react-qr-scanner';
import { ErrorPopup } from '../../../../ui-kit/error-popup';
import { SuccessfulPopup } from '../../../../ui-kit/successful-popup';
import { Row } from '../../../../ui-kit/row';

export type StudentClassGroupTableViewProps = {
  role: "ROLE_STUDENT" | "ROLE_PARENTS";
  studentClassGroupTableState: StudentClassGroupTableState;
  goToClassGroups: () => void;
  setSelectedGrade: (gradeInfo: GradeInfo, onSuccess: () => void) => void;
  setSelectedClass: (value: HeaderClassType, onSuccess: () => void) => void;
  getKeyForQr: (onError: () => void) => void;
  clearRedisKey: () => void;
  askReview: (onSuccess: () => void, onError: () => void, closePrewPopup: () => void) => void;
};

export const StudentClassGroupTableView: FC<StudentClassGroupTableViewProps> = memo(({
  role,
  setSelectedGrade,
  getKeyForQr,
  goToClassGroups,
  clearRedisKey,
  setSelectedClass,
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
    setSelectedClass({id: -1, position: -1},controlClassControlPopup);
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

  return (
    <>
      {isMobile ? 
        (<StudentClassGroupTableMobileView
          role={role}
          goToClassGroups={goToClassGroups}
		      setSelectedGrade={setSelectedGrade}
          closeClassControl={closeClassControl}
          openClassControl={openClassControl}
          hasCameraAccess={hasCameraAccess}
          setErrorAccessCamera={setErrorAccessCamera}
          isClassControlPopup={isClassControlPopup}
          getKeyForQr={onGetKeyForQr}
          onAskReview={controlConfirmReviewPopup}
          studentClassGroupTableState={studentClassGroupTableState}
          />) :
        (<StudentClassGroupTableDesktopView
          role={role}
          hasCameraAccess={hasCameraAccess}
          onAskReview={controlConfirmReviewPopup}
          setErrorAccessCamera={setErrorAccessCamera}
          closeClassControl={closeClassControl}
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
          textError={<>Время пересмотра истекло</>}
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
          isOpen={false}
          textError={<></>}
          closePopup={() => {}}
        />
        <SuccessfulPopup
          text={<>Присутствие подтверждено</>}
          isOpen={false}
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
  isClassControlPopup: boolean;
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
  setErrorAccessCamera,
  isClassControlPopup,
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

  return (
    <WrapperMobile onBack={goToClassGroups} role={role} header='Таблица'>
      {studentClassGroupTableState.loading === 'loading' ?
      <Column style={{position: 'absolute', height: '100vh', top: 0}}>
        <CircleLoading state={studentClassGroupTableState.loading}/>
      </Column> : <>
        <Surface>
          <Text themeFont={theme.fonts.h2} style={{lineHeight: 1.7}}>
            Предмет: <span style={{fontFamily: theme.fonts.ht2.family}}>
              {studentClassGroupTableState.classGroup?.subjectName}</span><br/>
            Формат занятия: <span style={{fontFamily: theme.fonts.ht2.family}}>
              {studentClassGroupTableState.classGroup?.formatName}</span><br/>
          </Text>
          <Spacing themeSpace={20} variant='Column' />
          {studentClassGroupTableState.studentsStatistics.length !== 0 ? 
            <StudentsTable onClickGrade={openDescription} openClassControl={openClassControl}
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
        <Text themeFont={theme.fonts.h1}>
          Занятие {studentClassGroupTableState.selectedClass.position}
        </Text>
        <Spacing themeSpace={15} variant='Column' />
        <Button 
          onClick={studentClassGroupTableState.redisKeyData === null ? getKeyForQr : () => {}} 
          width={200}
          borderRaius={10}
          variant={studentClassGroupTableState.redisKeyData === null ? 'primary' : 'recomended'} padding={[12,17]}>
          {studentClassGroupTableState.redisKeyData === null ? "Получить ключ" : "✓"}
        </Button>
        <Spacing themeSpace={15} variant='Column' />
        <Surface 
          padding='10px' borderRadius='10px' 
          borderColor={theme.colors.foreground} height={357} width={300}>
            {studentClassGroupTableState.redisKeyData === null ? (
              <Column style={{height: '100%', position: 'relative'}} horizontalAlign='center' verticalAlign='center'>
                <Image src={ShieldLogo} width={250} height={250}/>
              </Column>) : (<>
              <Surface 
                padding='0px' 
                borderColor={theme.colors.surface} 
                style={{borderRadius: 10, overflow: 'hidden', borderWidth: 5}}>
                  {hasCameraAccess ? <Scanner 
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
                }} onScan={(result) => console.log(result)} /> : 
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
      </Modal>
    </WrapperMobile>
  );
});

export const StudentClassGroupTableDesktopView: FC<LocalViewProps> = memo(({
  studentClassGroupTableState,
  goToClassGroups,
  openClassControl,
  getKeyForQr,
  setSelectedGrade,
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

  return (
    <WrapperDesktop style={{padding: 'none'}}  onBack={goToClassGroups} role={role} header='Таблица' isCenter={true}>
	    {studentClassGroupTableState.loading === 'loading' ?
        <Column style={{position: 'absolute', height: '100vh', top: 0}}>
          <CircleLoading state={studentClassGroupTableState.loading}/>
        </Column> : <>
        <Surface style={{width: 900}}>
          <Text themeFont={theme.fonts.h2} style={{lineHeight: 1.7}}>
            Предмет: <span style={{fontFamily: theme.fonts.ht2.family}}>
              {studentClassGroupTableState.classGroup?.subjectName}</span><br/>
            Формат занятия: <span style={{fontFamily: theme.fonts.ht2.family}}>
              {studentClassGroupTableState.classGroup?.formatName}</span><br/>
          </Text>
          <Spacing themeSpace={20} variant='Column' />
          {studentClassGroupTableState.studentsStatistics.length !== 0 ? 
            <StudentsTable
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
    </WrapperDesktop>
  );
});

export type StudentsTableProps = {
	data: StatisticOfStudent[];
	classesIds: number[];
  onClickGrade: (value: GradeInfo) => void;
  openClassControl: (value: HeaderClassType) => void;
};
  
export const StudentsTable: FC<StudentsTableProps> = memo(({
	data,
  onClickGrade,
  openClassControl,
	classesIds,
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
          <HeaderClassItem key={index} onClick={() => openClassControl({id: item, position: index + 1})}>
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
		  	  	{item.grades.map((item, index) => <ClassItem key={index} onClick={() => onClickGrade(item)}>
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