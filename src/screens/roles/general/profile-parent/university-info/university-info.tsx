import { FC, memo, useCallback, useEffect, useRef } from 'react';
import { UniversityInfoProps } from './university-info.props';
import { UniversityInfoView } from './university-info.view';
import { useUser } from '../../../../../hooks/user-hook';
import { useProfile } from '../profile/profile.props';
import { useAppDispatch, useTypedSelector } from '../../../../../hooks/use-typed-selector';
import { getUniversityInfoActionCreator, universityInfoSlice } from '../../../../../store/reducers/profile/university-info-slice';

export const UniversityInfo: FC<UniversityInfoProps> = memo(() => {
  const {user,authToken} = useUser();
  const universityInfoState = useTypedSelector(state => state.universityInfo);

  const goToProfile = useProfile();

  const { 
    reset
  } = universityInfoSlice.actions;

  const dispatch = useAppDispatch();

  const isInizialized = useRef(true);

  const getUniversityInfo = useCallback(()=>{
    dispatch(getUniversityInfoActionCreator({authToken: authToken}));
  },[dispatch, authToken])

  useEffect(() => {
    if (isInizialized.current) {
      isInizialized.current = false;
      getUniversityInfo();
    } 
    
    return () => {
      dispatch(reset());
    };
  }, [dispatch,reset, getUniversityInfo]);
  
  return (
      <UniversityInfoView 
        universityInfoState={universityInfoState}
        goToProfile={goToProfile}
        user={user}
        />
    );
});
