import { FC, memo, useCallback, useEffect, useRef } from 'react';
import { MembersProps } from './members.props';
import { MembersView } from './members.view';
import { useWorkshop } from '../workshop/workshop.props';
import { useUser } from '../../../../../hooks/user-hook';
import { useAppDispatch, useTypedSelector } from '../../../../../hooks/use-typed-selector';
import { DeanInfoState, initializeMembersDataActionCreator, membersSlice, TeacherInfoState } from '../../../../../store/reducers/roles/admin/members-slice';

export const Members: FC<MembersProps> = memo(() => {
  const goToWorkshop = useWorkshop();

  const {authToken} = useUser();

  const adminMembersState = useTypedSelector(state => state.adminMembers);

  const dispatch = useAppDispatch();

  const { 
    reset,
    setSelectedDeanActionCreater,
    setSearchTextActionCreater,
    setSelectedTeacherActionCreater
  } = membersSlice.actions;

  const isInizialized = useRef(true);

  const initializeMembersData = useCallback(()=>{
    dispatch(initializeMembersDataActionCreator({authToken: authToken}));
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

  const setSelectedTeacher = useCallback((value: TeacherInfoState) => {
    dispatch(setSelectedTeacherActionCreater(value));
  }, [dispatch, setSelectedTeacherActionCreater])

  const setSearchText = useCallback((value: string) => {
    dispatch(setSearchTextActionCreater(value));
  }, [dispatch, setSearchTextActionCreater])

  return (
      <MembersView 
        adminMembersState={adminMembersState}
        setSearchText={setSearchText}
        setSelectedDean={setSelectedDean}
        setSelectedTeacher={setSelectedTeacher}
        goToWorkshop={goToWorkshop}
        />
    );
});
