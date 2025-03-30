import { FC, memo, useCallback, useEffect, useState } from 'react';
import { GenerateStudentsProps } from './generate-students.props';
import { GenerateStudentsView } from './generate-students.view';
import { useDeanWorkshop } from '../workshop/workshop.props';
import { useAppDispatch, useTypedSelector } from '../../../../../hooks/use-typed-selector';
import { generateStudentsActionCreator, generateStudentsSlice, Student } from '../../../../../store/reducers/roles/dean/generate-students-slice';
import { useUser } from '../../../../../hooks/user-hook';

export const GenerateStudents: FC<GenerateStudentsProps> = memo(() => {
  const goToWorkshop = useDeanWorkshop();

  const deanGenerateStudentsState = useTypedSelector(state => state.deanGenerateStudents);

  const dispatch = useAppDispatch();
  const {authToken} = useUser();
  
  const onCreateAccounts = useCallback((onSuccess?: () => void, onError?: () => void) => {
    dispatch(generateStudentsActionCreator({
      authToken: authToken,
      students: deanGenerateStudentsState.students,
      onError: onError,
      onSuccess: onSuccess
    }));
  }, [dispatch, deanGenerateStudentsState.students, authToken])

  const { 
    setSearchTextActionCreator,
    setStudentsActionCreator,
    reset
  } = generateStudentsSlice.actions;

  
  const setStudents = useCallback((value: Student[])=>{
    dispatch(setStudentsActionCreator(value));
  },[dispatch, setStudentsActionCreator])

  const setSearchText = useCallback((value: string)=>{
    dispatch(setSearchTextActionCreator(value));
  },[dispatch, setSearchTextActionCreator])

  const clearData = useCallback(()=>{
    dispatch(reset());
  },[dispatch, reset])

  const [filteredStudents, setFilteredStudents] = useState<Student[]>([]);

  useEffect(() => {
    const trimmedSearchText = deanGenerateStudentsState.searchText.trim().toLowerCase();
  
    const filteredStudents = deanGenerateStudentsState.students.filter(student => {
      const groupInfo = student.numberOfGroup.split('.');

      return (
        !trimmedSearchText ||
        student.name.toLowerCase().includes(trimmedSearchText) ||
        student.lastname.toLowerCase().includes(trimmedSearchText) ||
        student.surname.toLowerCase().includes(trimmedSearchText) ||
        `${student.course} курс ${groupInfo[0]} группа ${groupInfo[1]} подгруппа`.includes(trimmedSearchText) ||
        student.specialty.toLowerCase().includes(trimmedSearchText)
      );
    });
  
      setFilteredStudents(filteredStudents);
  }, [deanGenerateStudentsState.searchText, deanGenerateStudentsState.students]);

  useEffect(() => {
    return () => {
      dispatch(reset());
    };
  }, [dispatch, reset]);

  return (
      <GenerateStudentsView 
        setSearchText={setSearchText}
        clearData={clearData}
        setStudents={setStudents}
        filteredStudents={filteredStudents}
        onCreateAccounts={onCreateAccounts}
        goToWorkshop={goToWorkshop}
        deanGenerateStudentsState={deanGenerateStudentsState}
        />
    );
});
