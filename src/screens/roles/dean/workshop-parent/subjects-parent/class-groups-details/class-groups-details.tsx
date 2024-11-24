import { FC, memo, useCallback, useEffect, useRef } from 'react';
import { ClassGroupsDetailsProps } from './class-groups-details.props';
import { ClassGroupsDetailsView } from './class-groups-details.view';
import { useDeanWorkshop } from '../../workshop/workshop.props';
import { useClassGroups } from '../class-groups/class-groups.props';
import { useAppDispatch, useTypedSelector } from '../../../../../../hooks/use-typed-selector';
import { classGroupDetailsSlice, initClassGroupDetailsActionCreator } from '../../../../../../store/reducers/roles/dean/subjects-parent/class-group-details-slice';
import { useUser } from '../../../../../../hooks/user-hook';
import { ItemOfSelectType } from '../../../../../../ui-kit/select/select';

export const ClassGroupsDetails: FC<ClassGroupsDetailsProps> = memo(({
  type
}) => {
  const goToClassGroups = useClassGroups();
  const {authToken} = useUser();
  const deanClassGroupDetailsState = useTypedSelector(state => state.deanClassGroupDetails);

  const isInizialized = useRef(true);

  useEffect(() => {
    if(type === 'edit' && deanClassGroupDetailsState.selectedClassGroup === null)
      goToClassGroups();
  },[type, deanClassGroupDetailsState.selectedClassGroup, goToClassGroups])


  const { 
    setSelectedClassFormatActionCreator,
    setSelectedTeacherActionCreator,
    setDescriptionActionCreator,
    reset
  } = classGroupDetailsSlice.actions;

  const dispatch = useAppDispatch();

  const initClassGroupDetails = useCallback(() => {
    dispatch(initClassGroupDetailsActionCreator({
      authToken: authToken,
      selectedClassGroup: deanClassGroupDetailsState.selectedClassGroup,
      type: type
    }));
  },[
    dispatch, 
    authToken,
    deanClassGroupDetailsState.selectedClassGroup,
    type
  ])

  useEffect(() => {
    if (isInizialized.current) {
      isInizialized.current = false;
      initClassGroupDetails();
    } else return () => {
      dispatch(reset());
    };
  }, [dispatch, initClassGroupDetails, reset]);

  const setSelectedTeacher = useCallback((value: ItemOfSelectType) => {
    dispatch(setSelectedTeacherActionCreator(value));
  }, [dispatch, setSelectedTeacherActionCreator]);

  const setSelectedClassFormat = useCallback((value: ItemOfSelectType) => {
    dispatch(setSelectedClassFormatActionCreator(value));
  }, [dispatch, setSelectedClassFormatActionCreator]);

  const setDescription = useCallback((value: string) => {
    dispatch(setDescriptionActionCreator(value));
  }, [dispatch, setDescriptionActionCreator]);

  return (
      <ClassGroupsDetailsView 
        deanClassGroupDetailsState={deanClassGroupDetailsState}
        goToClassGroups={goToClassGroups}
        setDescription={setDescription}
        setSelectedClassFormat={setSelectedClassFormat}
        setSelectedTeacher={setSelectedTeacher}
        type={type}
        />
    );
});
