
import { FC, memo, useCallback, useRef, useState } from 'react';
import { useMediaQuery } from 'react-responsive';
import { theme } from '../../../../ui-kit/themes/theme';
import { WrapperMobile } from '../../../../components/wrapper-mobile';
import { WrapperDesktop } from '../../../../components/wrapper-desktop';
import { GradeInfo, StatisticOfStudent, StudentClassGroupTableState } from '../../../../store/reducers/roles/student-and-parent/student-class-group-table';
import { Column } from '../../../../ui-kit/column';
import { CircleLoading } from '../../../../ui-kit/circle-loading';
import { Surface } from '../../../../ui-kit/surface';
import { Text } from '../../../../ui-kit/text';
import { Spacing } from '../../../../ui-kit/spacing';
import { ClassesContainer, ClassesRow, ClassItem, ColorCircle, ExistMark, HeaderClasses, HeaderClassItem, NameHeader, ScrollWrapper, StudentItem, StudentsContainer, Table, TableHeader, TableWrapper } from './student-class-group-table.styled';
import { Popup } from '../../../../ui-kit/popup';
import { Modal } from '../../../../ui-kit/modal';
import { ScrollView } from '../../../../ui-kit/scroll-view';

export type StudentClassGroupTableViewProps = {
  role: "ROLE_STUDENT" | "ROLE_PARENTS";
  studentClassGroupTableState: StudentClassGroupTableState;
  goToClassGroups: () => void;
  setSelectedGrade: (gradeInfo: GradeInfo, onSuccess: () => void) => void;
};

export const StudentClassGroupTableView: FC<StudentClassGroupTableViewProps> = memo(({
  role,
  setSelectedGrade,
  goToClassGroups,
  studentClassGroupTableState
}) => {
  const isMobile = useMediaQuery({maxWidth: theme.toMobileSize});

  return (
    isMobile ? 
      (<StudentClassGroupTableMobileView
        role={role}
        goToClassGroups={goToClassGroups}
		    setSelectedGrade={setSelectedGrade}
        studentClassGroupTableState={studentClassGroupTableState}
        />) :
      (<StudentClassGroupTableDesktopView
        role={role}
		    setSelectedGrade={setSelectedGrade}
        goToClassGroups={goToClassGroups}
        studentClassGroupTableState={studentClassGroupTableState}
        />)
  );
});


export const StudentClassGroupTableMobileView: FC<StudentClassGroupTableViewProps> = memo(({
  goToClassGroups,
  studentClassGroupTableState,
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
            <StudentsTable onClickGrade={openDescription}
              length={studentClassGroupTableState.countClasses}
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
    </WrapperMobile>
  );
});

export const StudentClassGroupTableDesktopView: FC<StudentClassGroupTableViewProps> = memo(({
  studentClassGroupTableState,
  goToClassGroups,
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
              onClickGrade={openDescription}
              length={studentClassGroupTableState.countClasses}
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
	length: number;
  onClickGrade: (value: GradeInfo) => void;
};
  
export const StudentsTable: FC<StudentsTableProps> = memo(({
	data,
  onClickGrade,
	length,
}) => {
  
  const container1Ref = useRef<HTMLDivElement>(null);
  const container2Ref = useRef<HTMLDivElement>(null);

  const isDragging = useRef(false);
  const startX = useRef(0);
  const startY = useRef(0);
  const scrollLeft = useRef(0);
  const scrollTop = useRef(0);

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    isDragging.current = true;
    startX.current = e.pageX;
    startY.current = e.pageY;

    const container = container1Ref.current!;
    scrollLeft.current = container.scrollLeft;
    scrollTop.current = container.scrollTop;

    document.body.style.cursor = "grabbing";
    document.body.style.userSelect = "none";
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isDragging.current) return;

    e.preventDefault();
    const dx = e.pageX - startX.current;
    const dy = e.pageY - startY.current;

    const container1 = container1Ref.current!;
    const container2 = container2Ref.current!;

    container1.scrollLeft = scrollLeft.current - dx;
    container1.scrollTop = scrollTop.current - dy;

    container2.scrollLeft = container1.scrollLeft;
    container2.scrollTop = container1.scrollTop;
  };

  const handleMouseUpOrLeave = () => {
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
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUpOrLeave}
          onMouseLeave={handleMouseUpOrLeave}>
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
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUpOrLeave}
            onMouseLeave={handleMouseUpOrLeave}>
		  	    {data.map(item=> <ClassesRow>
		  	  	{item.grades.map((item) => <ClassItem onClick={() => onClickGrade(item)}>
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