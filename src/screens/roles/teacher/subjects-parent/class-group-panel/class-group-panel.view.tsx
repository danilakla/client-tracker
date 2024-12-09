
import { FC, memo, useCallback, useRef, useState } from 'react';
import { useMediaQuery } from 'react-responsive';
import { theme } from '../../../../../ui-kit/themes/theme';
import { WrapperMobile } from '../../../../../components/wrapper-mobile';
import { WrapperDesktop } from '../../../../../components/wrapper-desktop';
import { Surface } from '../../../../../ui-kit/surface';
import { ClassesContainer, ClassesRow, ClassItem, ColorCircle, ColorCircleButton, ExistMark, HeaderClasses, HeaderClassItem, NameHeader, ScrollWrapper, StudentItem, StudentsContainer, Table, TableHeader, TableWrapper } from './class-group-panel.styled';
import { Text } from '../../../../../ui-kit/text';
import { Spacing } from '../../../../../ui-kit/spacing';
import { GradeInfo, StatisticOfStudent, SubjectsState } from '../../../../../store/reducers/roles/teacher/class-group-control-slice';
import { Button } from '../../../../../ui-kit/button';
import { Column } from '../../../../../ui-kit/column';
import { CircleLoading } from '../../../../../ui-kit/circle-loading';
import { Popup } from '../../../../../ui-kit/popup';
import { Modal } from '../../../../../ui-kit/modal';
import { Input } from '../../../../../ui-kit/input';
import { Row } from '../../../../../ui-kit/row';
import { ConfirmDeletePopup } from '../../../../../components/confirm-delete-popup';
import { Textarea } from '../../../../../ui-kit/textarea';

export type ClassGroupPanelViewProps = {
  teacherClassGroupControlState: SubjectsState;
  goToTeacherClassGroupSubgroups: () => void;
  setSelectedGrade: (gradeInfo: GradeInfo, onSuccess: () => void) => void;
  updateGrade: (onSuccess: () => void) => void;
  deleteClass: (onSuccess: () => void) => void;
  createClass: (onSuccess: () => void) => void;
  setGradeNumber: (value: string) => void;
  setDescription: (value: string) => void;
  setAttendance: (value: 0 | 1 | 2 | 3) => void;
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
          isOpenUpdateWindow={isOpenUpdateWindow}
          />) :
        (<ClassGroupPanelDesktopView
          openAddPopup={openAddPopup}
          goToTeacherClassGroupSubgroups={goToTeacherClassGroupSubgroups}
          teacherClassGroupControlState={teacherClassGroupControlState}
          setAttendance={setAttendance}
          openDeletePopup={openDeletePopup}
          setDescription={setDescription}
          openUpdateWindow={openUpdateWindow}
          setGradeNumber={setGradeNumber}
          closeUpdateWindow={closeUpdateWindow}
          confirmUpdate={confirmUpdate}
          isOpenUpdateWindow={isOpenUpdateWindow}
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
    </>
  );
});


type LocalViewProps = {
  teacherClassGroupControlState: SubjectsState;
  goToTeacherClassGroupSubgroups: () => void;
  openAddPopup: () => void;
  openDeletePopup: () => void;
  setGradeNumber: (value: string) => void;
  setDescription: (value: string) => void;
  setAttendance: (value: 0 | 1 | 2 | 3) => void;
  isOpenUpdateWindow: boolean;
  closeUpdateWindow: () => void;
  confirmUpdate: () => void;
  openUpdateWindow: (value: GradeInfo) => void;
};

export const ClassGroupPanelMobileView: FC<LocalViewProps> = memo(({
  teacherClassGroupControlState,
  goToTeacherClassGroupSubgroups,
  openAddPopup,
  isOpenUpdateWindow,
  openDeletePopup,
  setAttendance,
  setDescription,
  setGradeNumber,
  closeUpdateWindow,
  openUpdateWindow,
  confirmUpdate
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
              onClickGrade={openUpdateWindow}
              length={teacherClassGroupControlState.countClasses}
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
    </WrapperMobile>
  );
});

export const ClassGroupPanelDesktopView: FC<LocalViewProps> = memo(({
  teacherClassGroupControlState,
  goToTeacherClassGroupSubgroups,
  openAddPopup,
  isOpenUpdateWindow,
  setAttendance,
  openDeletePopup,
  setDescription,
  setGradeNumber,
  closeUpdateWindow,
  openUpdateWindow,
  confirmUpdate
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
              onClickGrade={openUpdateWindow}
              length={teacherClassGroupControlState.countClasses}
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
              <Spacing themeSpace={10} variant='Row' />
              {teacherClassGroupControlState.classesIds.length !== 0 && 
                <Button onClick={openDeletePopup} variant='attentive' padding={[12, 17]}>
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
    </WrapperDesktop>
  );
});

export type StudentsTableProps = {
	data: StatisticOfStudent[];
	length: number;
	onClickGrade: (value: GradeInfo) => void;
  };
  
export const StudentsTable: FC<StudentsTableProps> = memo(({
	data,
	length,
	onClickGrade
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
	
	return (
	  <TableWrapper>
		  <TableHeader>
		    <NameHeader>
		  	<Text themeFont={theme.fonts.h3}>
		  	  Имя студента
		  	</Text>
		    </NameHeader>
		    {length !== 0 && <HeaderClasses 
          ref={container1Ref}
          onScroll={handleScroll}
          onMouseDown={handleStart}
          onMouseMove={handleMove}
          onMouseUp={handleEnd}
          onMouseLeave={handleEnd}
          onTouchStart={handleStart}
          onTouchMove={handleMove}
          onTouchEnd={handleEnd}>
		  	{Array.from({ length }).map((_, index) => (
		  	  <HeaderClassItem>
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