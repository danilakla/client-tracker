import { FC, memo, useCallback, useEffect, useRef, useState } from 'react';
import { MembersProps } from './members.props';
import { MembersView } from './members.view';
import { useWorkshop } from '../workshop/workshop.props';
import { useUser } from '../../../../../hooks/user-hook';
import { useAppDispatch, useTypedSelector } from '../../../../../hooks/use-typed-selector';
import { DeanInfoState, deleteDeanActionCreator, deleteTeacherActionCreator, initializeMembersDataActionCreator, membersSlice, recoverPasswordActionCreator, TeacherInfoState } from '../../../../../store/reducers/roles/admin/members-slice';
import { ItemOfSelectType } from '../../../../../ui-kit/select/select';

export const Members: FC<MembersProps> = memo(() => {
  const goToWorkshop = useWorkshop();

  const {authToken} = useUser();

  const adminMembersState = useTypedSelector(state => state.adminMembers);

  const dispatch = useAppDispatch();

  const { 
    reset,
    setSelectedDeanActionCreater,
    setSearchTextActionCreater,
    setSelectedTeacherActionCreater,
    setSelectedNewResponsibleActionCreater,
  } = membersSlice.actions;

  const isInizialized = useRef(true);

  const initializeMembersData = useCallback(()=>{
    dispatch(initializeMembersDataActionCreator({authToken: authToken}));
  },[dispatch, authToken])

  const recoverPassword = useCallback((id: number, onSuccess: () => void)=>{
    dispatch(recoverPasswordActionCreator({authToken: authToken, id, onSuccess: onSuccess}));
  },[dispatch, authToken])

  useEffect(() => {
    if (isInizialized.current) {
      isInizialized.current = false;
      initializeMembersData();
    } else return () => {
      dispatch(reset());
    };
  }, [dispatch, reset, initializeMembersData]);

  const setSelectedDean = useCallback((value: DeanInfoState) => {
    dispatch(setSelectedDeanActionCreater(value));
  }, [dispatch, setSelectedDeanActionCreater])

  const setSelectedNewResponsible = useCallback((value: ItemOfSelectType) => {
    dispatch(setSelectedNewResponsibleActionCreater(value));
  }, [dispatch, setSelectedNewResponsibleActionCreater])

  const setSelectedTeacher = useCallback((value: TeacherInfoState) => {
    dispatch(setSelectedTeacherActionCreater(value));
  }, [dispatch, setSelectedTeacherActionCreater])

  const setSearchText = useCallback((value: string) => {
    dispatch(setSearchTextActionCreater(value));
  }, [dispatch, setSearchTextActionCreater])

  const [filteredListDeans, setFilteredListDeans] = useState<DeanInfoState[]>();
  const [filteredListTeachers, setFilteredListTeachers] = useState<TeacherInfoState[]>();

  useEffect(() => {
    const trimmedSearchText = adminMembersState.searchText.trim().toLowerCase();

    const filteredDeans = adminMembersState.listDeans
      .filter(dean => !trimmedSearchText || dean.flpName.toLowerCase().includes(trimmedSearchText))
      .sort((a, b) => a.flpName.localeCompare(b.flpName));

    const filteredTeachers = adminMembersState.listTeachers
      .filter(teacher => !trimmedSearchText || teacher.flpName.toLowerCase().includes(trimmedSearchText))
      .sort((a, b) => a.flpName.localeCompare(b.flpName));

    setFilteredListDeans(filteredDeans);
    setFilteredListTeachers(filteredTeachers);
  }, [adminMembersState.listDeans, adminMembersState.listTeachers, adminMembersState.searchText]);

  const onDelete = useCallback((toggle: 'left' | 'right', onSuccess?: () => void) => {
    if(toggle === 'left'){
      dispatch(deleteDeanActionCreator({
        authToken: authToken,
        deanId: adminMembersState.selectedDean.idDean,
        newDeanId: parseInt(adminMembersState.selectedNewResponsible.value),
        onSuccess: onSuccess
      }));
    } else if(toggle === 'right'){
      dispatch(deleteTeacherActionCreator({
        authToken: authToken,
        teacherId: adminMembersState.selectedTeacher.idTeacher,
        newTeacherId: parseInt(adminMembersState.selectedNewResponsible.value),
        onSuccess: onSuccess
      }));
    }
  }, [
    dispatch, 
    adminMembersState.selectedDean.idDean, 
    adminMembersState.selectedNewResponsible.value,
    adminMembersState.selectedTeacher.idTeacher, 
    authToken
  ])

  return (
      <MembersView 
        onDelete={onDelete}
        adminMembersState={adminMembersState}
        setSearchText={setSearchText}
        recoverPassword={recoverPassword}
        setSelectedDean={setSelectedDean}
        filteredListDeans={filteredListDeans}
        filteredListTeachers={filteredListTeachers}
        setSelectedTeacher={setSelectedTeacher}
        goToWorkshop={goToWorkshop}
        setSelectedNewResponsible={setSelectedNewResponsible}
        />
    );
});
