import { Navigate, Route, Routes } from "react-router";
import './App.css';
import { FC } from "react";
import { Login } from './screens/auth/login';
import { Signup } from './screens/auth/signup';
import { PrivateRoute } from "./private-route";
import { useTypedSelector } from "./hooks/use-typed-selector";
import { Example } from "./screens/roles/example";
import { Profile } from "./screens/roles/general/profile-parent/profile";
import { ChangeAccoundData } from "./screens/roles/general/profile-parent/change-accound-data";
import { ChangePassword } from "./screens/roles/general/profile-parent/change-password";
import { ChangeLogin } from "./screens/roles/general/profile-parent/change-login";
import { UniversityInfo } from "./screens/roles/general/profile-parent/university-info";
import { Workshop as AdminWorkShop } from "./screens/roles/admin/workshop-parent/workshop";
import { GeneratorKeys as AdminGeneratorKeys } from "./screens/roles/admin/workshop-parent/generator-keys";
import { UniversityEditor as AdminUniversityEditor } from "./screens/roles/admin/workshop-parent/university-editor";

export const urls = {
  logInUser: '/log-in/user',
  logInParent: '/log-in/parent',
  signUp: '/sign-up',

  profile: '/profile',
  profileUpdateAccountData: '/profile/update-account-data',
  profileUpdatePassword: '/profile/update-password',
  profileUpdateLogin: '/profile/update-login',
  profileUniversityInfo: '/profile/university',

  adminWorkshop: '/admin/workshop',
  adminGeneratorKeys: '/admin/workshop/generator-keys',
  adminUniversityEditor: '/admin/workshop/university-editor',
};

type RootProps = {};

export const Root: FC<RootProps> = () => {
  const { user } = useTypedSelector(state => state.user);

  return (
    <Routes>
      <Route path={urls.logInUser} element={<Login typeOfLogin='other' />} />
      <Route path={urls.logInParent} element={<Login typeOfLogin='parent' />} />
      <Route path={urls.signUp} element={<Signup/>} />

      <Route element={<PrivateRoute />} >
        {/* General */}
        <Route path={urls.profile} element={<Profile/>}/>
        <Route path={urls.profileUniversityInfo} element={<UniversityInfo/>}/>
        

        {user.role === 'ROLE_ADMIN' && <>
          <Route index element={<Navigate to={urls.profile} />} />

          <Route path={urls.profileUpdateAccountData} element={<ChangeAccoundData/>}/>
          <Route path={urls.profileUpdatePassword} element={<ChangePassword/>}/>
          <Route path={urls.profileUpdateLogin} element={<ChangeLogin/>}/>
            
          <Route path={urls.adminWorkshop} element={<AdminWorkShop/>}/>
          <Route path={urls.adminGeneratorKeys} element={<AdminGeneratorKeys/>}/>
          <Route path={urls.adminUniversityEditor} element={<AdminUniversityEditor/>}/>
        </>}
        {user.role === 'ROLE_DEAN' && <>
          <Route index element={<Navigate to={urls.profile} />} />

          <Route path={urls.profileUpdateAccountData} element={<ChangeAccoundData/>}/>
          <Route path={urls.profileUpdatePassword} element={<ChangePassword/>}/>
          <Route path={urls.profileUpdateLogin} element={<ChangeLogin/>}/>
        </>}
        {user.role === 'ROLE_PARENT' && <>
          <Route index element={<Navigate to={urls.profile} />} />

          <Route path={urls.profile} element={<Profile/>}/>
          <Route path={urls.profileUniversityInfo} element={<UniversityInfo/>}/>
        
        </>}
        {user.role === 'ROLE_STUDENT' && <>
          <Route index element={<Navigate to={urls.profile} />} />

          <Route path={urls.profileUpdatePassword} element={<ChangePassword/>}/>
          <Route path={urls.profileUpdateLogin} element={<ChangeLogin/>}/>
        </>}
        {user.role === 'ROLE_TEACHER' && <>
          <Route index element={<Navigate to={urls.profile} />} />

          <Route path={urls.profileUpdateAccountData} element={<ChangeAccoundData/>}/>
          <Route path={urls.profileUpdatePassword} element={<ChangePassword/>}/>
          <Route path={urls.profileUpdateLogin} element={<ChangeLogin/>}/>
        </>}
      </Route>
      <Route path='*' element={<Navigate to='/' />} />
    </Routes>
  );
};