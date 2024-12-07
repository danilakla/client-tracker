
import { FC, memo, useCallback, useEffect, useRef, useState } from 'react';
import { useMediaQuery } from 'react-responsive';
import { theme } from '../../../../../ui-kit/themes/theme';
import { WrapperMobile } from '../../../../../components/wrapper-mobile';
import { WrapperDesktop } from '../../../../../components/wrapper-desktop';
import { Surface } from '../../../../../ui-kit/surface';
import {  ClassesContainer, ClassesRow, ClassItem, ColorCircle, ColorCircleButton, ExistMark, HeaderClasses, HeaderClassItem, NameHeader, ScrollWrapper, StudentItem, StudentsContainer, Table, TableHeader, TableWrapper } from './class-group-panel.styled';
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

export type ClassGroupPanelViewProps = {
  teacherClassGroupControlState: SubjectsState;
  goToTeacherClassGroupSubgroups: () => void;
  setSelectedGrade: (gradeInfo: GradeInfo, onSuccess: () => void) => void;
  updateGrade: (onSuccess: () => void) => void;
  deleteClass: (onSuccess: () => void) => void;
  createClass: (onSuccess: () => void) => void;
};

export const ClassGroupPanelView: FC<ClassGroupPanelViewProps> = memo(({
  teacherClassGroupControlState,
  goToTeacherClassGroupSubgroups,
  createClass,
  updateGrade,
  setSelectedGrade,
  deleteClass
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
    
  },[])
  const confirmDeletePopup = useCallback(() => {
    
  },[])

  return (
    <>
      {
        isMobile ? 
        (<ClassGroupPanelMobileView
          openAddPopup={openAddPopup}
          teacherClassGroupControlState={teacherClassGroupControlState}
          goToTeacherClassGroupSubgroups={goToTeacherClassGroupSubgroups}
          />) :
        (<ClassGroupPanelDesktopView
          openAddPopup={openAddPopup}
          goToTeacherClassGroupSubgroups={goToTeacherClassGroupSubgroups}
          teacherClassGroupControlState={teacherClassGroupControlState}
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
        isActive={false} 
        state={teacherClassGroupControlState.loadingDelete}
        onDelete={confirmDeletePopup} />
    </>
  );
});


type LocalViewProps = {
  teacherClassGroupControlState: SubjectsState;
  goToTeacherClassGroupSubgroups: () => void;
  openAddPopup: () => void;
};

export const ClassGroupPanelMobileView: FC<LocalViewProps> = memo(({
  teacherClassGroupControlState,
  goToTeacherClassGroupSubgroups,
  openAddPopup
}) => {

  return (
    <WrapperMobile onBack={goToTeacherClassGroupSubgroups} role='ROLE_TEACHER' header='Таблица'>
      {teacherClassGroupControlState.loading === 'loading' ?
      <Column style={{position: 'absolute', height: '100vh', top: 0}}>
        <CircleLoading state={teacherClassGroupControlState.loading}/>
      </Column> : <>
        <Surface>
          <Text themeFont={theme.fonts.h2} style={{lineHeight: 1.7}}>
            Предмет: <span style={{fontFamily: theme.fonts.ht2.family}}>{teacherClassGroupControlState.initData?.classGroup.subjectName}</span><br/>
            Формат занятия: <span style={{fontFamily: theme.fonts.ht2.family}}>{teacherClassGroupControlState.initData?.classGroup.nameClassFormat}</span><br/>
            Подгруппа: <span style={{fontFamily: theme.fonts.ht2.family}}>{teacherClassGroupControlState.initData?.subgroup.subgroupNumber}</span>
          </Text>
          <Spacing themeSpace={20} variant='Column' />
          {teacherClassGroupControlState.studentsStatistics.length !== 0 ? 
            <StudentsTable 
              length={teacherClassGroupControlState.countClasses}
              data={teacherClassGroupControlState.studentsStatistics}/> :
            <Text themeFont={theme.fonts.h2} themeColor={theme.colors.attentive}>
              Студенты не найдены
            </Text>}
          <Spacing themeSpace={20} variant='Column' />
          {teacherClassGroupControlState.studentsStatistics.length !== 0 && 
            <Button onClick={openAddPopup} variant='primary' padding={[12, 17]}>
              Добавить занятие
            </Button>}
        </Surface>
      </>}
      <Modal isActive={false} closeModal={() => {}}>
        <Column horizontalAlign='center'>
          <Input 
            header='Оценка' 
            placeholder='9' error={teacherClassGroupControlState.errors['universityNameError']}
            value={''} setValue={() => {}}/>
          <Spacing themeSpace={25} variant='Column' />
          <Input 
            header='Примечание' 
            placeholder='Ай, красавчик...' error={teacherClassGroupControlState.errors['universityNameError']}
            value={''} setValue={() => {}}/>
          <Spacing themeSpace={25} variant='Column' />
          <Column style={{maxWidth: 440}}>
            <Text themeColor={theme.colors.gray} themeFont={theme.fonts.h3}>
              Присутствие
            </Text>
            <Spacing variant='Column' themeSpace={5}/>
            <Surface style={{width: 'auto'}} padding='15px'>
              <Row style={{gap: 25, width: '100%'}} horizontalAlign='center'>
                <ColorCircleButton variant={1} isSelected={true} />
                <ColorCircleButton variant={2} isSelected={true} />
                <ColorCircleButton variant={3} isSelected={true} />
              </Row>
            </Surface>
          </Column>
          <Spacing themeSpace={25} variant='Column' />
          <Row>
            <Button 
              onClick={() => {}} 
              state={'idle'} 
              variant='recomended' padding={[12,17]}>
              Сохранить
            </Button>
            <Spacing variant='Row' themeSpace={20}/>
            <Button onClick={() => {}} variant='attentive' padding={[12,17]}>
              Отмена
            </Button>
          </Row>
        </Column>
      </Modal>
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
              {item.grades.map(item => <ClassItem key={item.idStudent}>
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