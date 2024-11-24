import { Navigate, Route, Routes } from "react-router";
import './App.css';
import { FC } from "react";
import { Login } from './screens/auth/login';
import { Signup } from './screens/auth/signup';
import { PrivateRoute } from "./private-route";
import { useTypedSelector } from "./hooks/use-typed-selector";
import { Profile } from "./screens/roles/general/profile-parent/profile";
import { ChangeAccoundData } from "./screens/roles/general/profile-parent/change-accound-data";
import { ChangePassword } from "./screens/roles/general/profile-parent/change-password";
import { ChangeLogin } from "./screens/roles/general/profile-parent/change-login";
import { UniversityInfo } from "./screens/roles/general/profile-parent/university-info";
import { Workshop as AdminWorkShop } from "./screens/roles/admin/workshop-parent/workshop";
import { GeneratorKeys as AdminGeneratorKeys } from "./screens/roles/admin/workshop-parent/generator-keys";
import { UniversityEditor as AdminUniversityEditor } from "./screens/roles/admin/workshop-parent/university-editor";
import { Members as AdminMembers } from "./screens/roles/admin/workshop-parent/members";

import { Workshop as DeanWorkshop } from "./screens/roles/dean/workshop-parent/workshop";
import { ClassFormats as DeanClassFormats } from "./screens/roles/dean/workshop-parent/class-formats";
import { Specialties as DeanSpecialties } from "./screens/roles/dean/workshop-parent/specialties";
import { GenerateStudents as DeanGenerateStudents } from "./screens/roles/dean/workshop-parent/generate-students";
import { Students as DeanStudents } from "./screens/roles/dean/workshop-parent/students";
import { ControlSubjects as DeanControlSubjects } from "./screens/roles/dean/workshop-parent/subjects-parent/control-subjects";
import { ClassGroupsDetails as DeanClassGroupsDetails } from "./screens/roles/dean/workshop-parent/subjects-parent/class-groups-details";
import { ClassGroups as DeanClassGroups } from "./screens/roles/dean/workshop-parent/subjects-parent/class-groups";
import { Loader } from "./screens/loader";
import { useAuthentication } from "./hooks/authentication-hook";

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
  adminMembers: '/admin/workshop/members',

  deanWorkshop: '/dean/workshop',
  deanClassFormats: '/dean/workshop/class-formats',
  deanSpecialities: '/dean/workshop/specialities',
  deanGenerateStudents: '/dean/workshop/generate-students',
  deanStudents: '/dean/workshop/students',
  deanSubjects: '/dean/workshop/subjects',
  deanClassGroups: '/dean/workshop/subjects/class-groups',
  deanClassGroupAdd: '/dean/workshop/subjects/class-group/add',
  deanClassGroupEdit: '/dean/workshop/subjects/class-group/edit',
};

type RootProps = {};

export const Root: FC<RootProps> = () => {
  const { user } = useTypedSelector(state => state.user);

  return (
    <Routes>
      <Route path={urls.logInUser} element={<Login typeOfLogin='other' />} />
      <Route path={urls.logInParent} element={<Login typeOfLogin='parent' />} />
      <Route path={urls.signUp} element={<Signup/>} />

      <Route element={<PrivateRoute/>}>
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
          <Route path={urls.adminMembers} element={<AdminMembers/>}/>
          
        </>}
        {user.role === 'ROLE_DEAN' && <>
          <Route index element={<Navigate to={urls.profile} />} />

          <Route path={urls.deanWorkshop} element={<DeanWorkshop/>}/>
          <Route path={urls.deanClassFormats} element={<DeanClassFormats/>}/>
          <Route path={urls.deanSpecialities} element={<DeanSpecialties/>}/>

          <Route path={urls.deanSubjects} element={<DeanControlSubjects/>}/>
          <Route path={urls.deanClassGroups} element={<DeanClassGroups/>}/>
          <Route path={urls.deanClassGroupAdd} element={<DeanClassGroupsDetails type='add' />}/>
          <Route path={urls.deanClassGroupEdit} element={<DeanClassGroupsDetails type='edit' />}/>

          <Route path={urls.profileUpdateAccountData} element={<ChangeAccoundData/>}/>
          <Route path={urls.profileUpdatePassword} element={<ChangePassword/>}/>
          <Route path={urls.profileUpdateLogin} element={<ChangeLogin/>}/>
          <Route path={urls.deanGenerateStudents} element={<DeanGenerateStudents/>}/>
          <Route path={urls.deanStudents} element={<DeanStudents/>}/>
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
        <Route path='*' element={<Navigate to='/' />} />
      </Route>
    </Routes>
  );
};