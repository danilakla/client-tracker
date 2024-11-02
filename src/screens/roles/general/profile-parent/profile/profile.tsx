import { FC, memo, useCallback } from 'react';
import { ProfileProps } from './profile.props';
import { ProfileView } from './profile.view';
import { useUser } from '../../../../../hooks/user-hook';
import { useChangeAccoundData } from '../change-accound-data/change-accound-data.props';
import { useChangeLogin } from '../change-login/change-login.props';
import { useChangePassword } from '../change-password/change-password.props';
import { useUniversityInfo } from '../university-info/university-info.props';
import { useAppDispatch } from '../../../../../hooks/use-typed-selector';
import { userSlice } from '../../../../../store/reducers/user-slice';
import { useLogInUser } from '../../../../auth/login/login.props';
import { appStatusSlice } from '../../../../../store/reducers/app-status-slice';

export const Profile: FC<ProfileProps> = memo(() => {
  const {user} = useUser();

  const goChangeAccoundData = useChangeAccoundData();
  const goChangeLogin = useChangeLogin();
  const goChangePassword = useChangePassword();
  const goUniversityInfo = useUniversityInfo();
  const goToLogin = useLogInUser();

  const dispatch = useAppDispatch();

  const exitAccount = useCallback(() => {
    localStorage.removeItem('authToken');
    dispatch(userSlice.actions.reset());
    goToLogin();
    dispatch(appStatusSlice.actions.setStatusApp({status: 'idle'}));
  },[dispatch,goToLogin])

  return (
      <ProfileView 
        user={user}
        goChangeAccoundData={goChangeAccoundData}
        goChangeLogin={goChangeLogin}
        exitAccount={exitAccount}
        goChangePassword={goChangePassword}
        goUniversityInfo={goUniversityInfo}
        />
    );
});
