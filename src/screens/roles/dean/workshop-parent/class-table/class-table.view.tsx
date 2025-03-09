
import { FC, memo, useCallback, useState } from 'react';
import { theme } from '../../../../../ui-kit/themes/theme';
import { useMediaQuery } from 'react-responsive';
import { WrapperMobile } from '../../../../../components/wrapper-mobile';
import { WrapperDesktop } from '../../../../../components/wrapper-desktop';
import { attendanceColorsForStudents, AttestationGradeInfo, checkIsAttestationGrade, ClassHeaderType, GradeInfo, InitData, StatisticOfStudent } from '../../../../../store/reducers/roles/dean/class-group-table-slice';
import { useTableScroll } from '../../../../../hooks/table-scroll-hook';
import { ClassesContainer, ClassesRow, ClassItem, ColorCircle, EmptyClassItem, ExistMark, HeaderClasses, HeaderClassItem, HorizontalSlider, HorizontalTrack, NameHeader, ScrollWrapper, StudentItem, StudentsContainer, Table, TableHeader, TableWrapper, VerticalSlider, VerticalTrack } from './class-table.styled';
import { Spacing } from '../../../../../ui-kit/spacing';
import { Text } from '../../../../../ui-kit/text';
import { Row } from '../../../../../ui-kit/row';
import { Column } from '../../../../../ui-kit/column';
import { CircleLoading } from '../../../../../ui-kit/circle-loading';
import { Surface } from '../../../../../ui-kit/surface';
import { Button } from '../../../../../ui-kit/button';
import { Image } from '../../../../../ui-kit/image';
import { Modal } from '../../../../../ui-kit/modal';
import { ScrollView } from '../../../../../ui-kit/scroll-view';
import { Popup } from '../../../../../ui-kit/popup';

import RefreshLogo from '../../../../../ui-kit/assets/refresh.svg';
import InfoLogo from '../../../../../ui-kit/assets/info.svg';


export type ClassTableViewProps = {
  loading: "idle" | "loading" | "success" | "error";
  loadingRefresh: "idle" | "loading" | "success" | "error";
  studentsStatistics: StatisticOfStudent[];
  classesIds: ClassHeaderType[];
  selectedGrade: GradeInfo;
  initData: InitData | null;
  reloadTable: () => void;
  setSelectedGrade: (value: GradeInfo, onSuccess: () => void) => void;
  onBack: () => void;
};

export const ClassTableView: FC<ClassTableViewProps> = memo(({
  loading,
  loadingRefresh,
  studentsStatistics,
  classesIds,
  selectedGrade,
  initData,
  reloadTable,
  setSelectedGrade,
  onBack
}) => {
  const isMobile = useMediaQuery({maxWidth: theme.toMobileSize});

  const [isOpenClassDescription, setIsOpenClassDescription] = useState<boolean>(false);
  const closeClassDescription = useCallback(() => {
    setIsOpenClassDescription(false);
  },[])
  const openClassDescription = useCallback(() => {
    setIsOpenClassDescription(true);
  },[])
  
  const [isOpenGradeInfo, setIsOpenGradeInfo] = useState<boolean>(false);
  const closeGradeInfo = useCallback(() => {
    setIsOpenGradeInfo(false);
  },[])
  const openGradeInfo = useCallback(() => {
    setIsOpenGradeInfo(true);
  },[])

  const onOpenGradeInfo = useCallback((value: GradeInfo) => {
    setSelectedGrade(value, openGradeInfo);
  },[setSelectedGrade, openGradeInfo])

  return (
    isMobile ? 
      (<ClassTableMobileView
        loading={loading}
        loadingRefresh={loadingRefresh}
        classesIds={classesIds}
        studentsStatistics={studentsStatistics}
        selectedGrade={selectedGrade}
        initData={initData}
        reloadTable={reloadTable}
        openClassDescription={openClassDescription}
        openGradeInfo={onOpenGradeInfo}
        isOpenGradeInfo={isOpenGradeInfo}
        closeGradeInfo={closeGradeInfo}
        isOpenClassDescription={isOpenClassDescription}
        closeClassDescription={closeClassDescription}
        onBack={onBack}
        />) :
      (<ClassTableDesktopView
        loading={loading}
        onBack={onBack}
        loadingRefresh={loadingRefresh}
        classesIds={classesIds}
        studentsStatistics={studentsStatistics}
        selectedGrade={selectedGrade}
        initData={initData}
        reloadTable={reloadTable}
        openClassDescription={openClassDescription}
        openGradeInfo={onOpenGradeInfo}
        isOpenGradeInfo={isOpenGradeInfo}
        closeGradeInfo={closeGradeInfo}
        isOpenClassDescription={isOpenClassDescription}
        closeClassDescription={closeClassDescription}
        />)
  );
});

type LocalViewProps = {
  loading: "idle" | "loading" | "success" | "error";
  loadingRefresh: "idle" | "loading" | "success" | "error";
  studentsStatistics: StatisticOfStudent[];
  classesIds: ClassHeaderType[];
  selectedGrade: GradeInfo;
  initData: InitData | null;
  reloadTable: () => void;
  openClassDescription: () => void;
  openGradeInfo: (value: GradeInfo) => void;
  isOpenGradeInfo: boolean;
  closeGradeInfo: () => void;
  isOpenClassDescription: boolean;
  closeClassDescription: () => void;
  onBack: () => void;
}

export const ClassTableMobileView: FC<LocalViewProps> = memo(({
  loading,
  loadingRefresh,
  classesIds,
  studentsStatistics,
  selectedGrade,
  initData,
  reloadTable,
  onBack,
  openClassDescription,
  openGradeInfo,
  isOpenGradeInfo,
  closeGradeInfo,
  isOpenClassDescription,
  closeClassDescription
}) => {

  return (
    <WrapperMobile role='ROLE_DEAN' header='Таблица' onBack={onBack}>
      {loading === 'loading' ?
      <Column style={{position: 'absolute', height: '100dvh', top: 0}}>
        <CircleLoading state={loading}/>
      </Column> : <>
        <Surface>
        <Row style={{position: 'absolute'}}>
          <Button height={38.4} width={38.4} onClick={openClassDescription} variant='recomended' padding={0}>
              <Column style={{height: '100%'}}  verticalAlign='center' horizontalAlign='center'>
              <Image src={InfoLogo} width={15} height={15}/> 
              </Column>
            </Button>
            <Spacing themeSpace={10} variant='Row' />
            <Button height={38} width={38} onClick={reloadTable} 
              state={loadingRefresh} variant='recomended' padding={0}>
              <Column style={{height: '100%'}}  verticalAlign='center' horizontalAlign='center'>
              <Image src={RefreshLogo} width={15} height={15}/> 
              </Column>
            </Button>
          </Row>
          <Spacing themeSpace={10} variant='Column' />
          {studentsStatistics.length !== 0 ? 
            <StudentsTable 
              onClickGrade={openGradeInfo}
              classesIds={classesIds}
              data={studentsStatistics}/> :
            <Text style={{marginTop: 70}} themeFont={theme.fonts.h2} themeColor={theme.colors.attentive}>
              Студенты не найдены
            </Text>}
        </Surface>
        <Spacing variant='Column' themeSpace={85} />
      </>}
      <Modal isActive={isOpenGradeInfo} closeModal={closeGradeInfo}> 
        <ScrollView style={{maxHeight: 450}}>
          <Text themeFont={theme.fonts.h3} themeColor={theme.colors.gray}>
            {selectedGrade.description}
          </Text>
        </ScrollView>
      </Modal>
      <Modal isActive={isOpenClassDescription} closeModal={closeClassDescription} >
        <Text themeFont={theme.fonts.h2} style={{lineHeight: 1.7}}>
          Предмет: <span style={{fontFamily: theme.fonts.ht2.family}}>
            {initData?.subjectName}</span><br/>
          Формат занятия: <span style={{fontFamily: theme.fonts.ht2.family}}>
            {initData?.formatName}</span><br/>
          Преподаватель: <span style={{fontFamily: theme.fonts.ht2.family}}>
            {initData?.teacherName.replaceAll('_', ' ')}</span><br/>
          Описание: <span style={{fontFamily: theme.fonts.ht2.family}}>
            {initData?.description}</span><br/>
        </Text>
      </Modal>
    </WrapperMobile>
  );
});

export const ClassTableDesktopView: FC<LocalViewProps> = memo(({
  loading,
  loadingRefresh,
  classesIds,
  studentsStatistics,
  selectedGrade,
  initData,
  reloadTable,
  openClassDescription,
  openGradeInfo,
  isOpenGradeInfo,
  closeGradeInfo,
  isOpenClassDescription,
  closeClassDescription,
  onBack
}) => {

  return (
    <WrapperDesktop role='ROLE_DEAN' header='Таблица' onBack={onBack}>
      {loading === 'loading' ?
        <Column style={{position: 'absolute', height: '100dvh', top: 0}}>
          <CircleLoading state={loading}/>
        </Column> : <>
        <Surface style={{width: 900}}>
          <Row style={{position: 'absolute'}}>
            <Button height={38.4} width={38.4} onClick={openClassDescription} variant='recomended' padding={0}>
              <Column style={{height: '100%'}}  verticalAlign='center' horizontalAlign='center'>
              <Image src={InfoLogo} width={15} height={15}/> 
              </Column>
            </Button>
            <Spacing themeSpace={10} variant='Row' />
            <Button height={38} width={38} onClick={reloadTable} 
              state={loadingRefresh} variant='recomended' padding={0}>
              <Column style={{height: '100%'}}  verticalAlign='center' horizontalAlign='center'>
              <Image src={RefreshLogo} width={15} height={15}/> 
              </Column>
            </Button>
          </Row>
          <Spacing themeSpace={20} variant='Column' />
          {studentsStatistics.length !== 0 ? 
            <StudentsTable
              onClickGrade={openGradeInfo}
              classesIds={classesIds}
              data={studentsStatistics}/> :
            <Text style={{marginTop: 70}} themeFont={theme.fonts.h2} themeColor={theme.colors.attentive}>
              Студенты не найдены
            </Text>}
        </Surface>
      </>}
      <Popup isActive={isOpenGradeInfo} closePopup={closeGradeInfo}> 
        <Column style={{width: 440}}>
          <ScrollView style={{maxHeight: 500}}>
            <Text themeFont={theme.fonts.h3} themeColor={theme.colors.gray}>
              {selectedGrade.description}
            </Text>
          </ScrollView>
        </Column>
      </Popup>
      <Popup style={{width: 440}} isActive={isOpenClassDescription} closePopup={closeClassDescription} >
        <Text themeFont={theme.fonts.h2} style={{lineHeight: 1.7}}>
          Предмет: <span style={{fontFamily: theme.fonts.ht2.family}}>
            {initData?.subjectName}</span><br/>
          Формат занятия: <span style={{fontFamily: theme.fonts.ht2.family}}>
            {initData?.formatName}</span><br/>
          Преподаватель: <span style={{fontFamily: theme.fonts.ht2.family}}>
            {initData?.teacherName.replaceAll('_', ' ')}</span><br/>
          Описание: <span style={{fontFamily: theme.fonts.ht2.family}}>
            {initData?.description}</span><br/>
        </Text>
      </Popup>
    </WrapperDesktop>
  );
});

export type StudentsTableProps = {
  data: StatisticOfStudent[];
  classesIds: ClassHeaderType[];
  onClickGrade: (value: GradeInfo) => void;
};
  
export const StudentsTable: FC<StudentsTableProps> = memo(({
  data,
  classesIds,
  onClickGrade
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
          Имя студента
        </Text>
        </NameHeader>
        {classesIds.length !== 0 && <HeaderClasses ref={horizontalScrollRef1}>
        {classesIds.map((item, index) => (
          <HeaderClassItem key={index}>
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
              onClickGrade={onClickGrade}/>)}
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
};
    
export const ClassItemView: FC<ClassItemViewProps> = memo(({ 
  item,
  onClickGrade
 }) => {
  
  return !checkIsAttestationGrade(item) ? (
    item.idStudentGrate !== -1 ? (
      <ClassItem
        isPassed={item.isPassLab}
        isReview={
          item.isReview && 
          ![3, 7, 8].includes(item.attendance)}
        onClick={() => (item.description !== null && item.description !== "") &&  onClickGrade(item)} >
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
    style={{backgroundColor: item.isAttested ? theme.colors.neutral : '#fc657e80'}}>
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
