
import { FC, memo, useRef } from 'react';
import { useMediaQuery } from 'react-responsive';
import { theme } from '../../../../ui-kit/themes/theme';
import { WrapperMobile } from '../../../../components/wrapper-mobile';
import { WrapperDesktop } from '../../../../components/wrapper-desktop';
import { StatisticOfStudent, StudentClassGroupTableState } from '../../../../store/reducers/roles/student-and-parent/student-class-group-table';
import { Column } from '../../../../ui-kit/column';
import { CircleLoading } from '../../../../ui-kit/circle-loading';
import { Surface } from '../../../../ui-kit/surface';
import { Text } from '../../../../ui-kit/text';
import { Spacing } from '../../../../ui-kit/spacing';
import { ClassesContainer, ClassesRow, ClassItem, ColorCircle, ExistMark, HeaderClasses, HeaderClassItem, NameHeader, ScrollWrapper, StudentItem, StudentsContainer, Table, TableHeader, TableWrapper } from './student-class-group-table.styled';

export type StudentClassGroupTableViewProps = {
  role: "ROLE_STUDENT" | "ROLE_PARENT";
  studentClassGroupTableState: StudentClassGroupTableState;
  goToClassGroups: () => void;
};

export const StudentClassGroupTableView: FC<StudentClassGroupTableViewProps> = memo(({
  role,
  goToClassGroups,
  studentClassGroupTableState
}) => {
  const isMobile = useMediaQuery({maxWidth: theme.toMobileSize});

  return (
    isMobile ? 
      (<StudentClassGroupTableMobileView
        role={role}
        goToClassGroups={goToClassGroups}
        studentClassGroupTableState={studentClassGroupTableState}
        />) :
      (<StudentClassGroupTableDesktopView
        role={role}
        goToClassGroups={goToClassGroups}
        studentClassGroupTableState={studentClassGroupTableState}
        />)
  );
});


export const StudentClassGroupTableMobileView: FC<StudentClassGroupTableViewProps> = memo(({
  goToClassGroups,
  studentClassGroupTableState,
  role
}) => {

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
            <StudentsTable
              length={studentClassGroupTableState.countClasses}
              data={studentClassGroupTableState.studentsStatistics}/> :
            <Text themeFont={theme.fonts.h2} themeColor={theme.colors.attentive}>
              Студенты не найдены
            </Text>}
          <Spacing themeSpace={20} variant='Column' />
        </Surface>
      </>}
    </WrapperMobile>
  );
});

export const StudentClassGroupTableDesktopView: FC<StudentClassGroupTableViewProps> = memo(({
  studentClassGroupTableState,
  goToClassGroups,
  role
}) => {

  return (
    <WrapperDesktop onBack={goToClassGroups} role={role} header='Таблица'>

    </WrapperDesktop>
  );
});

export type StudentsTableProps = {
	data: StatisticOfStudent[];
	length: number;
  };
  
export const StudentsTable: FC<StudentsTableProps> = memo(({
	data,
	length,
  }) => {
  
	const container1Ref = useRef<HTMLDivElement>(null);
	const container2Ref = useRef<HTMLDivElement>(null);
	
	const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
	  const source = e.target as HTMLDivElement;
	  
	  const target =
		source === container1Ref.current ? container2Ref.current : container1Ref.current;
  
	  if (target) {
		target.scrollTop = source.scrollTop;
		target.scrollLeft = source.scrollLeft;
	  }
	};
	
	return (
	  <TableWrapper>
		  <TableHeader>
		    <NameHeader>
		  	<Text themeFont={theme.fonts.h3}>
		  	  Имя студента
		  	</Text>
		    </NameHeader>
		    {length !== 0 && <HeaderClasses ref={container1Ref} onScroll={handleScroll}>
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
		  	  <ClassesContainer ref={container2Ref} onScroll={handleScroll}>
		  	    {data.map(item=> <ClassesRow>
		  	  	{item.grades.map((item) => <ClassItem>
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