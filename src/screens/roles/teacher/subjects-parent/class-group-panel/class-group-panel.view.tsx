
import { FC, memo, useRef } from 'react';
import { useMediaQuery } from 'react-responsive';
import { theme } from '../../../../../ui-kit/themes/theme';
import { WrapperMobile } from '../../../../../components/wrapper-mobile';
import { WrapperDesktop } from '../../../../../components/wrapper-desktop';
import { Surface } from '../../../../../ui-kit/surface';
import {  ClassesContainer, ClassesRow, ClassItem, ColorCircle, ExistMark, HeaderClasses, HeaderClassItem, NameHeader, ScrollWrapper, StudentItem, StudentsContainer, Table, TableHeader, TableWrapper } from './class-group-panel.styled';
import { Text } from '../../../../../ui-kit/text';
import { Spacing } from '../../../../../ui-kit/spacing';
import { StatisticOfStudent, SubjectsState } from '../../../../../store/reducers/roles/teacher/class-group-control-slice';

export type ClassGroupPanelViewProps = {
  teacherClassGroupControlState: SubjectsState;
};

export const ClassGroupPanelView: FC<ClassGroupPanelViewProps> = memo(({
  teacherClassGroupControlState
}) => {
  const isMobile = useMediaQuery({maxWidth: theme.toMobileSize});

  return (
    isMobile ? 
      (<ClassGroupPanelMobileView
        teacherClassGroupControlState={teacherClassGroupControlState}
        />) :
      (<ClassGroupPanelDesktopView
        teacherClassGroupControlState={teacherClassGroupControlState}
        />)
  );
});


type LocalViewProps = {
  teacherClassGroupControlState: SubjectsState;
};

export const ClassGroupPanelMobileView: FC<LocalViewProps> = memo(({
  teacherClassGroupControlState
}) => {

  return (
    <WrapperMobile role='ROLE_TEACHER' header='Предметы'>
      <Surface>
        <StudentsTable 
          length={teacherClassGroupControlState.countClasses}
          data={teacherClassGroupControlState.studentsStatistics}/>
      </Surface>
    </WrapperMobile>
  );
});

export const ClassGroupPanelDesktopView: FC<LocalViewProps> = memo(() => {

  return (
    <WrapperDesktop role='ROLE_TEACHER' header='Предметы'>

    </WrapperDesktop>
  );
});




export type StudentsTableProps = {
  data: StatisticOfStudent[];
  length: number
};

export const StudentsTable: FC<StudentsTableProps> = memo(({
  data,
  length
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
        <HeaderClasses ref={container1Ref} onScroll={handleScroll}>
          {Array.from({ length }).map((_, index) => (
            <HeaderClassItem key={index}>
              <Text themeFont={theme.fonts.h3}>
                Занятие {index + 1}
              </Text>
            </HeaderClassItem>
          ))}
        </HeaderClasses>
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
              {item.grades.map(item => <ClassItem>
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